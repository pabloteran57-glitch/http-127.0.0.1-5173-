import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

const publicValidation = process.argv.includes("--public");
const read = (name) => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const parts = read("parts-manifest");
const cables = read("cables-manifest");
const variants = read("variants");
const layout = read("layout-manifest");
const assembly = read("assembly-guide");
const sources = read("sources");
const ports = read("ports-manifest");
const audit = read("geometry-audit");
const references = read("geometry-references");
const engineering = read("engineering-manifest");
const partIds = new Set(parts.parts.map(p => p.id));
const cableIds = new Set(cables.cables.map(c => c.cable_id));
const portById=Object.fromEntries(ports.ports.map(p=>[p.id,p]));
assert.equal(Object.keys(portById).length,ports.ports.length,"Duplicate port IDs");
for(const port of ports.ports){
  assert(port.part_id===null||partIds.has(port.part_id));
  assert(port.connector&&port.identity_source_url.startsWith("https://"));
  assert(port.local_position_mm===null||(port.local_position_mm.length===3&&port.local_position_mm.every(Number.isFinite)));
  assert(!/verified_exact/.test(port.position_confidence),"No unsourced exact port geometry");
}
assert.equal(partIds.size, parts.parts.length, "Duplicate parts");
assert.equal(cableIds.size, cables.cables.length, "Duplicate cables");
assert.equal(parts.parts.length, 30, "Conservar 27 entradas originales y 3 accesorios verificados de monitor");
assert.equal(assembly.steps.length, 13, "All thirteen assembly stages required");
assert.equal(variants.variants.length, 7, "All seven profiles required");
assert(variants.variants.some(v => v.id === variants.master_variant_id));
for (const part of parts.parts) {
  assert(part.primary_source_url.startsWith("https://"), `Missing source: ${part.id}`);
  assert(["high", "medium", "low"].includes(part.confidence_level));
  assert(part.planning_weight_g === null || part.planning_weight_g > 0);
  if(part.verified_weight_g.source_url)assert(sources.sources.some(s=>s.url===part.verified_weight_g.source_url&&s.type==="official"),"Fuente de masa sin registro oficial: "+part.id);
}
for (const node of layout.nodes) {
  assert(partIds.has(node.id), `Unknown geometry: ${node.id}`);
  for (const key of ["position_mm", "size_xyz_mm", "explode_mm"]) {
    assert.equal(node[key].length, 3);
    assert(node[key].every(Number.isFinite));
  }
  assert(node.size_xyz_mm.every(x => x > 0));
  assert(node.parent_id===null||partIds.has(node.parent_id));
  assert.equal(node.rotation_deg.length,3);
  assert(node.rotation_deg.every(Number.isFinite));
  assert(node.dimension_source_url.startsWith("https://"));
  if(node.subcomponent_id){const p=parts.parts.find(p=>p.id===node.id),c=p.subcomponents?.find(c=>c.id===node.subcomponent_id);assert(c&&c.weight_g>0&&c.source_url.startsWith("https://"),"Subcomponente sin evidencia: "+node.id);}
  if(node.mount_point_id){const parent=layout.nodes.find(n=>n.id===node.parent_id);assert(parent?.mounting_points?.some(p=>p.id===node.mount_point_id&&p.source_url.startsWith("https://")),"Interfaz de montaje ausente: "+node.id);}
  const seen=new Set([node.id]);
  let parent=node.parent_id;
  while(parent){
    assert(!seen.has(parent),"Support graph cycle: "+node.id);
    seen.add(parent);parent=layout.nodes.find(n=>n.id===parent)?.parent_id;
  }
}
assert.equal(layout.nodes.find(n => n.kind === "rods").size_xyz_mm[2], 203.2);
assert.equal(layout.nodes.find(n => n.kind === "rods").size_xyz_mm[1], 15);
assert.equal(layout.nodes.find(n => n.kind === "monitor").mass_domain, "fixed");
for (const cable of cables.cables) {
  assert(portById[cable.from_port_id]&&portById[cable.to_port_id],"Unknown port: "+cable.cable_id);
  assert.equal(portById[cable.from_port_id].part_id,cable.from_part_id,"Source port/part mismatch");
  assert.equal(portById[cable.to_port_id].part_id,cable.to_part_id,"Destination port/part mismatch");
  assert(["cable","contacts","internal"].includes(cable.display_kind));
  assert(partIds.has(cable.source_part_id), `Unknown cable product: ${cable.cable_id}`);
  for (const endpoint of [cable.from_part_id, cable.to_part_id]) {
    assert(endpoint === null || partIds.has(endpoint), `Unknown endpoint: ${cable.cable_id}`);
  }
  assert(cable.risk_notes.length && cable.routing_path && cable.strain_relief_requirement);
}
for (const variant of variants.variants) {
  const active = new Set(variant.active_part_ids);
  for (const id of [...variant.active_part_ids, ...variant.conditional_part_ids, ...variant.parts_added, ...variant.parts_removed]) {
    assert(partIds.has(id), `Unknown profile part ${variant.id}: ${id}`);
  }
  assert.equal(active.size, variant.active_part_ids.length);
  assert(variant.conditional_part_ids.every(id=>!active.has(id)),"Conditional must not be active");
  const master=variants.variants.find(v=>v.id===variants.master_variant_id);
  assert.deepEqual(variant.parts_added,variant.active_part_ids.filter(id=>!master.active_part_ids.includes(id)),"Incorrect active part additions");
  assert.deepEqual(variant.parts_removed,master.active_part_ids.filter(id=>!active.has(id)),"Incorrect part removals");
  assert.deepEqual(variant.cables_added,variant.cable_profile_ids.filter(id=>!master.cable_profile_ids.includes(id)));
  assert.deepEqual(variant.cables_removed,master.cable_profile_ids.filter(id=>!variant.cable_profile_ids.includes(id)));
  for (const id of variant.cable_profile_ids) {
    assert(cableIds.has(id), `Unknown profile cable ${variant.id}: ${id}`);
    const cable = cables.cables.find(c => c.cable_id === id);
    assert.equal(cable.status, "candidate", "Parked circuits cannot be active");
    for (const endpoint of [cable.from_part_id, cable.to_part_id]) {
      assert(endpoint === null || active.has(endpoint), `Inactive endpoint ${variant.id}: ${id}`);
    }
  }
  assert(!active.has("startech-st122hd4ku"), "No unverified gimbal splitter mount");
  assert(!active.has("dji-lidar-transmission-hub"), "No missing Transmission hardware");
  if (active.has("dji-rs4-pro-combo")) {
    assert(active.has("dji-rs-bg70"));
    assert(!active.has("sony-xlr-h1"));
  }
  if (active.has("smallhd-indie-7")) {
    assert(active.has("smallrig-3026b") && active.has("dji-rs4-pro-combo"));
    assert(variant.cable_profile_ids.includes("pwr-plate-to-smallhd"));
  }
  if(active.has("smallrig-vb99-pro")){
    for(const id of ["smallrig-3203b","smallrig-rods-8in","smallrig-1674"])assert(active.has(id),"Battery needs real rod support chain");
    assert(variant.cable_profile_ids.includes("pwr-vmount-to-plate-contacts"));
  }
  assert(!(variant.cable_profile_ids.includes("vid-fx3-to-smallhd") && variant.cable_profile_ids.includes("vid-fx3-to-startech-splitter")), "One camera HDMI output");
}
assert(cables.profiles.requested_dual_feed_bench.includes("pwr-ac-to-splitter"));
assert.equal(sources.sources.length, new Set(sources.sources.map(s => s.id)).size);
assert.equal(audit.references.length,new Set(audit.references.map(r=>r.part_id)).size);
for(const ref of audit.references){
  assert(partIds.has(ref.part_id));
  assert(ref.display_image.startsWith("/references/")&&!ref.display_image.includes(".."));
  if (!publicValidation) assert(existsSync(new URL("../public"+ref.display_image,import.meta.url)),"Missing curated asset");
}
for(const ref of references.parts.flatMap(p=>p.images).concat(references.documents.filter(d=>d.local_path))){
  assert(ref.sha256?.length===64);
  if (!publicValidation) assert(existsSync(new URL("../public"+ref.local_path,import.meta.url)));
}
assert.equal(engineering.limits["3026b_supported_load_g"],1500);
assert.equal(engineering.limits.rs4_pro_tested_payload_g,4500);
assert.equal(parts.parts.find(p=>p.id==="smallrig-vb99-pro").planning_weight_g,644);
assert.equal(parts.parts.find(p=>p.id==="smallrig-3203b").planning_weight_g,351);
assert.equal(layout.nodes.find(n=>n.kind==="batteryPlate").size_xyz_mm[1],168.7);
assert.equal(layout.nodes.find(n=>n.kind==="monitor").parent_id,"smallrig-3026b");
const ui=JSON.parse(readFileSync(new URL("../data/ui-content.json",import.meta.url),"utf8"));
assert.deepEqual(new Set(Object.keys(ui.part_names)),partIds,"Presentation labels must cover the canonical parts exactly");
for(const variant of variants.variants)assert(ui.profile_hints[variant.id],"Missing profile hint");
assert.equal(ui.language,"es","El idioma de presentación debe ser español");
for(const cable of cables.cables){
  assert(ui.connector_labels[cable.connector_a],"Missing connector A label: "+cable.cable_id);
  assert(ui.connector_labels[cable.connector_b],"Missing connector B label: "+cable.cable_id);
}
const humanText=[...parts.notes,...parts.parts.flatMap(p=>[p.verified_dimensions_mm.note,p.verified_weight_g.note,p.mounting_method,p.likely_material,p.rig_role,...p.physical_constraints]),...layout.nodes.flatMap(n=>[n.label,n.placement,n.orientation,n.mount,n.rationale,n.rejected]),...layout.clearance_gates.flatMap(g=>[g.title,g.detail]),...cables.cables.flatMap(c=>[c.source,c.destination,c.connector_a,c.connector_b,c.voltage_or_signal_standard,c.ideal_length_estimate,c.routing_path,c.strain_relief_requirement,...c.risk_notes]),...assembly.steps.flatMap(s=>[s.title,s.mount,s.where,s.rebalance,...s.verify]),...variants.variants.flatMap(v=>[v.label,v.balance_impact,v.workflow_impact,v.budget_impact,v.complexity_impact,...v.dependencies])];
humanText.push(...ports.ports.flatMap(p=>[p.label,p.connector,p.note]),...Object.values(ui.part_names),...Object.values(ui.profile_hints),...Object.values(ui.task_hints),...Object.values(ui.connector_labels),...Object.values(ui.schema_labels),...audit.community_candidates.map(c=>c.note),...audit.geometry_upgrade_requirements);
const legacyEnglish=/\b(Not published|Handheld|Dummy|Baseplate|Labels On|Labels Off|Exploded View|Assembled View|Strain relief|Published nominal|Current source|Primary source|planning mass|source set|pending|not verified|splitter|Type-A|Type-C)\b/i;
for(const text of humanText)assert(!legacyEnglish.test(text),"Texto sin localizar: "+text);
const planner=JSON.parse(readFileSync(new URL("../data/planner-rules.json",import.meta.url),"utf8"));
assert.equal(planner.version,1);
assert(planner.selection_checks.length);
const checkCondition=condition=>{
  for(const id of [...(condition.all??[]),...(condition.any??[]),...(condition.none??[])])assert(partIds.has(id));
  for(const key of ["context","not_context"])if(condition[key])assert(["gimbal","handheld","static"].includes(condition[key]));
  if(condition.orientation)assert(["landscape","vertical"].includes(condition.orientation));
};
assert.equal(new Set(planner.selection_checks.map(c=>c.id)).size,planner.selection_checks.length);
planner.selection_checks.forEach(check=>{assert(check.message);checkCondition(check.condition);[...(check.required_all??[]),...(check.required_any??[])].forEach(id=>assert(partIds.has(id)));});
planner.cable_exclusions.forEach(rule=>{assert(cableIds.has(rule.cable_id));checkCondition(rule.condition);});
assert(planner.planning_root_part_ids.length&&planner.camera_part_ids.length);
for(const key of ["planning_root_part_ids","camera_part_ids","camera_external_power_part_ids","viewer_route_part_ids"]){assert(Array.isArray(planner[key]));assert.equal(new Set(planner[key]).size,planner[key].length);planner[key].forEach(id=>assert(partIds.has(id)));}
for(const id of planner.camera_part_ids)assert(planner.planning_root_part_ids.includes(id),"Cuerpo sin raíz declarada: "+id);
for(const id of planner.planning_root_part_ids)assert(!planner.mount_dependencies[id],"Raíz con soporte contradictorio: "+id);
for(const id of partIds)assert(planner.parked_part_ids.includes(id)||planner.planning_root_part_ids.includes(id)||planner.mount_dependencies[id]?.length,"Pieza sin cadena ni raíz declarada: "+id);
assert.equal(new Set(planner.exclusive_selection_groups.map(g=>g.id)).size,planner.exclusive_selection_groups.length);
for(const group of planner.exclusive_selection_groups){assert(group.id&&group.message&&Number.isInteger(group.max_active)&&group.max_active>0);assert(group.part_ids.length);assert.equal(new Set(group.part_ids).size,group.part_ids.length);group.part_ids.forEach(id=>assert(partIds.has(id)));}
assert(planner.viewer_routes.length);assert.equal(new Set(planner.viewer_routes.map(r=>r.id)).size,planner.viewer_routes.length);
for(const route of planner.viewer_routes){assert(layout.monitor_mount_routes[route.id]);checkCondition(route.condition);}
assert(Number.isInteger(planner.extraction_step)&&planner.assembly_frames.some(f=>f.step===planner.extraction_step));
for(const [id,completion]of Object.entries(planner.completion_rules)){assert(partIds.has(id)&&completion.label);[...completion.required_all,...completion.power_suggest_ids].forEach(id=>assert(partIds.has(id)));completion.power_cable_ids.forEach(id=>assert(cableIds.has(id)));}
for(const node of layout.nodes){
  if(node.vertical_frame!==undefined)assert(["camera","fixed"].includes(node.vertical_frame));
  for(const rule of node.visual_subassemblies??[]){assert(rule.object_name&&rule.hide_if_any_part_ids.length);rule.hide_if_any_part_ids.forEach(id=>assert(partIds.has(id)));}
}
for(const variant of variants.variants){assert(["gimbal","handheld","static"].includes(variant.viewer.rig_context));assert(layout.monitor_mount_routes[variant.viewer.monitor_mount_route]);}
for(const rule of planner.dynamic_mount_dependencies??[]){assert(partIds.has(rule.part_id));checkCondition(rule.condition);assert(rule.required_all.length);rule.required_all.forEach(id=>assert(partIds.has(id)&&id!==rule.part_id));}
for(const check of planner.selection_checks)for(const id of check.suggest_ids??[])assert(partIds.has(id)&&check.required_any?.includes(id));
assert.deepEqual(Object.keys(layout.monitor_mount_routes??{}).sort(),["cage","gimbal","xlr"]);
for(const route of Object.values(layout.monitor_mount_routes??{}))for(const [id,override]of Object.entries(route.overrides)){
  assert(layout.nodes.some(n=>n.id===id));assert(override.parent_id===undefined||layout.nodes.some(n=>n.id===override.parent_id));
  for(const key of ["position_mm","rotation_deg"])if(override[key])assert(override[key].length===3&&override[key].every(Number.isFinite));
  if(override.mass_domain)assert(["fixed","moving"].includes(override.mass_domain));
}
for(const cable of cables.cables)for(const [route,override]of Object.entries(cable.monitor_route_overrides??{})){
  assert(layout.monitor_mount_routes[route]);assert(override.routing_path&&override.motion_boundary);
  assert.deepEqual(Object.keys(override).sort(),["motion_boundary","route_control_frame","route_control_offsets_mm","routing_path"]);
  for(const values of Object.values(override.route_control_offsets_mm))assert(values.length===3&&values.every(Number.isFinite));
}
assert.equal(planner.assembly_frames.length,13);
const categorized=planner.categories.flatMap(c=>c.part_ids);
assert.equal(new Set(categorized).size,categorized.length);
assert.deepEqual(new Set(categorized),partIds);
for(const [id,deps] of Object.entries(planner.mount_dependencies)){
  assert(partIds.has(id));deps.forEach(dep=>assert(partIds.has(dep)));
  const visit=(part,seen)=>{assert(!seen.has(part),"Ciclo de dependencias: "+part);for(const dep of planner.mount_dependencies[part]??[])visit(dep,new Set([...seen,part]));};
  visit(id,new Set());
}
for(const key of ["parked_part_ids","gimbal_only_part_ids","gimbal_excluded_part_ids","vertical_excluded_part_ids","extraction_keep_part_ids"])planner[key].forEach(id=>assert(partIds.has(id)));
planner.assembly_frames.forEach((frame,i)=>{assert.equal(frame.step,i+1);[...frame.add_part_ids,...frame.context_part_ids].forEach(id=>assert(partIds.has(id)));frame.add_cable_ids.forEach(id=>assert(cableIds.has(id)));});
const profileContent=JSON.parse(readFileSync(new URL("../data/assembly-profile-content.json",import.meta.url),"utf8"));
assert.equal(profileContent.version,1);
assert.equal(profileContent.steps.length,13);
profileContent.steps.forEach((step,i)=>{
  assert.equal(step.number,i+1);assert(["mount","check","optional"].includes(step.kind));
  assert(step.title&&step.note&&step.rebalance&&step.blocks.length);
  step.requires_any.forEach(id=>assert(partIds.has(id)));
  for(const reference of step.references??[]){
    assert(partIds.has(reference.part_id)&&step.blocks.some(block=>block.part_ids.includes(reference.part_id)),"Referencia ajena a la etapa");
    assert(references.documents.some(document=>document.id===reference.document_id),"Manual no registrado");
    assert(Number.isInteger(reference.page)&&reference.page>0&&reference.alt);
    assert(reference.image_path.startsWith("/references/")&&!reference.image_path.includes(".."));
    if(!publicValidation)assert(existsSync(new URL("../public"+reference.image_path,import.meta.url)),"Ilustración de manual ausente");
  }
  for(const block of step.blocks){
    assert(block.part_ids.length&&block.mount&&block.where&&block.verify.length);
    [...block.part_ids,...(block.require_all??[]),...(block.unless_any??[])].forEach(id=>assert(partIds.has(id)));
    (block.cable_ids??[]).forEach(id=>assert(cableIds.has(id)));
    for(const text of [step.title,step.note,step.rebalance,block.mount,block.where,...block.verify])assert(!legacyEnglish.test(text),"Texto sin localizar: "+text);
  }
});
console.log(`CORRECTO: ${partIds.size} piezas, ${cableIds.size} conexiones, ${layout.nodes.length} elementos geométricos, 13 etapas, 7 plantillas y reglas de perfiles propios. Etiquetas en español comprobadas. No implica certificación mecánica.`);
const intake=JSON.parse(readFileSync(new URL("../data/catalog-intake.json",import.meta.url),"utf8")),contract=JSON.parse(readFileSync(new URL("../data/catalog-contract.json",import.meta.url),"utf8"));
assert.equal(intake.products.length,10);assert.equal(new Set(intake.products.map(p=>p.id)).size,10);
for(const product of intake.products){assert(!partIds.has(product.id),"Una alta en investigación no debe ser una pieza activada");assert.equal(product.release_status,"research_only");assert(/^https:\/\/www\.sony\.(com|co\.uk)\//.test(product.source_url));assert(product.model_number&&product.dimensions.note&&Number.isFinite(product.weight_g));}
assert.equal(new Set((intake.manifest_reviews??[]).map(review=>review.part_id)).size,(intake.manifest_reviews??[]).length);
for(const review of intake.manifest_reviews??[]){
  const product=intake.products.find(item=>item.id===review.part_id);assert(product&&review.reviewed_on&&review.remaining.length);
  assert.equal(review.status,"partial_official_manifest_not_released");assert(review.citations.length);
  for(const citation of review.citations){
    const source=sources.sources.find(item=>item.id===citation.source_id);assert(source?.type==="official"&&citation.locator&&citation.method);
    assert(citation.field_paths.length);for(const path of citation.field_paths)assert(path.split(".").reduce((value,key)=>value?.[key],product)!==undefined,"Campo investigado inexistente: "+path);
  }
  for(const entry of product.interfaces??[]){assert(entry.id&&entry.connector&&entry.note);assert.equal(entry.position_mm,null,"No se inventan posiciones en un manifiesto inicial");assert(entry.count===null||(Number.isInteger(entry.count)&&entry.count>0));}
}
assert.deepEqual(new Set(contract.products.map(p=>p.part_id)),partIds);assert.equal(contract.catalog_revision,planner.catalog_revision);
for(const entry of contract.products){assert.equal(entry.physically_tested,false);assert.equal(entry.geometry_profile_id,layout.nodes.find(n=>n.id===entry.part_id)?.id??null);}
const release=JSON.parse(readFileSync(new URL("../data/release.json",import.meta.url),"utf8")),pkg=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
assert.equal(release.version,pkg.version);assert.equal(release.catalog_revision,planner.catalog_revision);
const beta=JSON.parse(readFileSync(new URL("../data/beta-evidence.json",import.meta.url),"utf8")),protocol=JSON.parse(readFileSync(new URL("../data/beta-protocol.json",import.meta.url),"utf8"));
for(const row of beta.observations){assert(typeof row.participant_alias==="string"&&row.participant_alias.trim());assert(protocol.tasks.some(t=>t.id===row.task_id));assert(typeof row.completed==="boolean");assert(Number.isFinite(row.assistance_count)&&row.assistance_count>=0);assert(Number.isFinite(row.elapsed_seconds)&&row.elapsed_seconds>=0);}
console.log("CORRECTO: diez altas aisladas, índice derivado, versión de código y esquema de observaciones. No se inventan productos activos ni ensayos.");
const reviews=JSON.parse(readFileSync(new URL("../data/connection-reviews.json",import.meta.url),"utf8"));
assert.equal(reviews.version,1);assert(reviews.revision);assert.equal(reviews.catalog_revision,planner.catalog_revision);
assert.equal(new Set(reviews.reviews.map(r=>r.cable_id)).size,reviews.reviews.length);
const sourceById=new Map(sources.sources.map(s=>[s.id,s]));
assert.deepEqual(new Set(Object.keys(ui.builder.roles)),partIds,"Las tarjetas deben identificar todas las piezas, sin catálogo paralelo");
assert.deepEqual(ui.builder.views.map(view=>view.id),["catalog","selected","settings"]);
assert.deepEqual(ui.builder.contexts.map(c=>c.id),["gimbal","handheld","static"]);
ui.builder.contexts.forEach(c=>assert(["design","assemble","inventory"].includes(c.icon)));
const verticalReview=planner.vertical_monitor_review;
assert(verticalReview.reviewed_on&&verticalReview.rationale&&verticalReview.pending);
assert.equal(verticalReview.status,"documented_interfaces_candidate_not_physical_validation");
verticalReview.part_ids.forEach(id=>assert(partIds.has(id)&&!planner.vertical_excluded_part_ids.includes(id)));
verticalReview.source_urls.forEach(url=>assert(sources.sources.some(s=>s.type==="official"&&s.url===url)));
const electricalFields=new Set(["input_range_v","output_range_v","input_polarity","output_polarity","output_nominal_v","input_min_current_a","output_max_current_a","nominal_input_current_a","barrel_outer_mm","barrel_inner_mm"]);
for(const owner of [...ports.ports,...cables.cables]){
  const e=owner.electrical;if(!e)continue;assert(e.revision&&e.field_sources);
  for(const [field,value] of Object.entries(e)){
    if(["revision","field_sources"].includes(field))continue;assert(electricalFields.has(field));if(value===null)continue;
    assert(sourceById.has(e.field_sources[field]),"Falta fuente por campo eléctrico: "+field);
    if(field.endsWith("range_v"))assert(Array.isArray(value)&&value.length===2&&value.every(v=>Number.isFinite(v)&&v>0)&&value[0]<=value[1]);
    else if(field.endsWith("polarity"))assert(["center_positive","center_negative"].includes(value));
    else assert(Number.isFinite(value)&&value>0);
  }
}
for(const review of reviews.reviews){
  assert(cableIds.has(review.cable_id));assert.equal(review.catalog_revision,planner.catalog_revision);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_on));assert(review.action&&review.checks.length);
  const cable=cables.cables.find(c=>c.cable_id===review.cable_id),b=review.binding;
  for(const field of ["source_part_id","from_port_id","to_port_id","connector_a","connector_b"])assert.equal(b[field],cable[field]);
  assert.equal(b.signal_standard,cable.voltage_or_signal_standard);assert.equal(b.electrical_revision,cable.electrical?.revision??null);
  assert.deepEqual(new Set(b.models.map(p=>p.part_id)),new Set([cable.source_part_id,cable.from_part_id,cable.to_part_id].filter(Boolean)));
  b.models.forEach(model=>{const p=parts.parts.find(p=>p.id===model.part_id);assert.equal(model.model_number,p.model_number);assert.equal(model.exact_product_name,p.exact_product_name);});
  assert.deepEqual(new Set(b.ports.map(p=>p.id)),new Set([cable.from_port_id,cable.to_port_id]));
  b.ports.forEach(port=>{const actual=ports.ports.find(p=>p.id===port.id);assert.equal(port.connector,actual.connector);assert.equal(port.electrical_revision,actual.electrical?.revision??null);});
  for(const proof of Object.values(review.citations)){
    const source=sourceById.get(proof.source_id);assert.equal(source?.type,"official");assert.equal(proof.source_url,source.url);
    assert(proof.locator.trim()&&proof.claim.trim()&&proof.part_ids.length);
    proof.part_ids.forEach(id=>assert(b.models.some(p=>p.part_id===id)&&source.review_subject_part_ids?.includes(id)));
  }
  assert.equal(new Set(review.checks.map(c=>c.id)).size,review.checks.length);
  for(const check of review.checks){
    assert(check.label&&check.detail&&["specification","manufacturer_pair","voltage_range","polarity","operational"].includes(check.kind));
    check.citation_ids.forEach(id=>assert(review.citations[id]));if(check.kind!=="operational")assert(check.citation_ids.length);
    if(check.kind==="specification")check.subject_part_ids.forEach(id=>assert(b.models.some(p=>p.part_id===id)));
    if(check.kind==="manufacturer_pair"){assert.deepEqual(check.pair,[cable.from_part_id,cable.to_part_id]);assert(check.tested_firmware);}
    if(["voltage_range","polarity"].includes(check.kind))for(const ref of [check.source,check.receiver])assert(["from_port","to_port","cable"].includes(ref.owner)&&electricalFields.has(ref.field));
    for(const text of [check.label,check.detail,review.action])assert(!legacyEnglish.test(text),"Texto de revisión sin localizar: "+text);
  }
}
console.log(`CORRECTO: ${reviews.reviews.length} revisiones vinculadas a modelos/puertos y fuentes por campo. Desconocido no significa compatible.`);
