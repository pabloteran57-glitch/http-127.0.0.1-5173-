import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const moduleOf=async name=>{
  const code=ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`,import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const {resolveRig,newRig,assemblyFrame,completionIds,mountChainProblem,availableSupportIds}=await moduleOf("planner");
const {assemblyTimeline,nextPlaybackIndex}=await moduleOf("assembly");
const {layoutForVariant,nodePose,movingMass,preferredPartId,hiddenSubassemblies,cableForVariant}=await moduleOf("viewer");
const {approvedModelFor}=await moduleOf("model-assets");
const rules=read("planner-rules"),parts=read("parts-manifest").parts,cables=read("cables-manifest").cables;
const layout=read("layout-manifest"),content=read("assembly-profile-content"),templates=read("variants").variants,assets=read("model-assets").assets;
const master=templates.find(v=>v.id===read("variants").master_variant_id);
const rig=(ids,context="handheld",orientation="landscape")=>({schema_version:1,id:"rig-extensible-fixture",name:"Prueba sintética, no producto real",context,orientation,part_ids:ids,updated_at:"2026-10-07T00:00:00Z"});
let checks=0;
const test=(name,run)=>{run();checks++;console.log(`CORRECTO: ${name}`);};

// Remapear todos los IDs evita que una prueba pase porque todavía contiene FX3/RS 4 Pro.
const aliases=new Map([...parts.map(p=>p.id),...cables.map(c=>c.cable_id),...read("ports-manifest").ports.map(p=>p.id)].map((id,i)=>[id,`fixture-entity-${i}`]));
const remap=value=>typeof value==="string"?aliases.get(value)??value:Array.isArray(value)?value.map(remap):value&&typeof value==="object"?Object.fromEntries(Object.entries(value).map(([key,item])=>[aliases.get(key)??key,remap(item)])):value;
const fixtureRules=remap(rules),fixtureLayout=remap(layout),fixtureContent=remap(content),fixtureCables=remap(cables),fixtureParts=remap(parts),fixtureMaster=remap(master);
const names=id=>id;

test("Siete plantillas tienen contexto y ruta explícitos, sin modificar sus elecciones",()=>{
  const snapshot=JSON.stringify(templates);
  for(const template of templates){const input=newRig("Copia",template);assert.equal(input.context,template.viewer.rig_context);assert.deepEqual(input.part_ids,template.active_part_ids);assert(layout.monitor_mount_routes[template.viewer.monitor_mount_route]);}
  assert.equal(JSON.stringify(templates),snapshot);
});

test("Ecosistema sintético completo: selección, cables y montaje sin IDs del equipo real",()=>{
  assert(!JSON.stringify(fixtureRules).includes('"sony-fx3"'));
  for(const template of templates){
    const base=newRig("Referencia",template),synthetic=remap(base),before=JSON.stringify(synthetic);
    const reference=resolveRig(base,rules,cables,master,names),result=resolveRig(synthetic,fixtureRules,fixtureCables,fixtureMaster,names);
    assert.deepEqual(result.variant.active_part_ids,remap(reference.variant.active_part_ids));
    assert.deepEqual(result.variant.cable_profile_ids,remap(reference.variant.cable_profile_ids));
    assert.deepEqual(result.parked_ids,remap(reference.parked_ids));
    const timeline=assemblyTimeline(result.variant,fixtureRules,fixtureCables,fixtureContent),original=assemblyTimeline(reference.variant,rules,cables,content);
    assert.deepEqual(timeline.map(s=>s.number),original.map(s=>s.number));
    assert(timeline.length>0);let index=0;while(nextPlaybackIndex(timeline,index)!==-1)index=nextPlaybackIndex(timeline,index);
    assert(timeline[index].playable);assert.notEqual(timeline[index].number,fixtureRules.extraction_step);
    for(const step of timeline){const frame=assemblyFrame(result.variant,step.number,fixtureRules,fixtureCables);assert(frame.variant.active_part_ids.every(id=>synthetic.part_ids.includes(id)));}
    assert.equal(JSON.stringify(synthetic),before);
  }
});

test("Poses, masa y foco son genéricos para todas las plantillas sintéticas",()=>{
  const actualParts=Object.fromEntries(parts.map(p=>[p.id,p])),syntheticParts=Object.fromEntries(fixtureParts.map(p=>[p.id,p]));
  for(const template of templates){const variant=remap(template),a=layoutForVariant(template,layout),b=layoutForVariant(variant,fixtureLayout);
    assert.equal(movingMass(variant,fixtureLayout,syntheticParts).subtotal,movingMass(template,layout,actualParts).subtotal);
    for(let i=0;i<a.nodes.length;i++)assert.deepEqual(nodePose(b.nodes[i],variant.viewer.mode==="vertical"),nodePose(a.nodes[i],template.viewer.mode==="vertical"));
    assert.equal(preferredPartId([...variant.active_part_ids].reverse(),fixtureLayout),aliases.get("sony-fx3"));
  }
});

test("Completar una pieza usa sólo sus reglas y conserva la selección",()=>{
  for(const context of ["handheld","gimbal","static"]){const selected=["sony-fx3","smallrig-4770","smallhd-indie-7"],input=rig(remap(selected),context),before=JSON.stringify(input),reference=rig(selected,context);
    assert.deepEqual(completionIds(aliases.get("smallhd-indie-7"),input,fixtureRules,[]),remap(completionIds("smallhd-indie-7",reference,rules,[])));
    assert.equal(JSON.stringify(input),before);assert.equal(completionIds("pieza-sin-regla",input,fixtureRules,[]).length,0);
  }
});

test("Óptica sin cámara declarada no se instala ni recibe una guía ficticia",()=>{
  const input=rig([aliases.get("sony-fe-16-35-gm")]),result=resolveRig(input,fixtureRules,fixtureCables,fixtureMaster,names);
  assert.equal(result.variant.active_part_ids.length,0);assert.equal(assemblyTimeline(result.variant,fixtureRules,fixtureCables,fixtureContent).length,0);assert.deepEqual(result.parked_ids,input.part_ids);
});

test("Raíz o soporte desconocidos permanecen pendientes y no se sugieren",()=>{
  const input=rig(["fixture-unknown-root","fixture-unknown-accessory"]),custom=structuredClone(fixtureRules);
  custom.mount_dependencies["fixture-unknown-accessory"]=["fixture-unknown-root"];
  const snapshot=JSON.stringify(input),result=resolveRig(input,custom,[],fixtureMaster,names);
  assert.deepEqual(result.parked_ids,input.part_ids);assert(result.issues.every(issue=>issue.add_ids.length===0||!issue.add_ids.includes("fixture-unknown-root")));
  assert.equal(availableSupportIds(["fixture-unknown-accessory"],input,custom).length,0);assert.equal(JSON.stringify(input),snapshot);
});

test("Ciclo de soporte se bloquea sin colgar el planificador ni borrar elecciones",()=>{
  const custom=structuredClone(fixtureRules),input=rig(["fixture-cycle-a","fixture-cycle-b"]);
  custom.mount_dependencies["fixture-cycle-a"]=["fixture-cycle-b"];custom.mount_dependencies["fixture-cycle-b"]=["fixture-cycle-a"];
  assert.match(mountChainProblem("fixture-cycle-a",custom,input),/ciclo/);
  const result=resolveRig(input,custom,[],fixtureMaster,names);assert.deepEqual(result.parked_ids,input.part_ids);
  assert.equal(availableSupportIds(input.part_ids,input,custom).length,0);
});

test("Dos dependencias contextuales contradictorias no se resuelven por orden",()=>{
  const custom=structuredClone(fixtureRules),id=aliases.get("smallrig-2906b"),input=rig(remap(["sony-fx3","smallrig-4770","smallrig-2906b"]));
  custom.dynamic_mount_dependencies.push({part_id:id,condition:{},required_all:[aliases.get("sony-fx3")]});
  assert.match(mountChainProblem(id,custom,input),/contradictorias/);
  assert(resolveRig(input,custom,[],fixtureMaster,names).parked_ids.includes(id));
  custom.dynamic_mount_dependencies.reverse();assert(resolveRig(input,custom,[],fixtureMaster,names).parked_ids.includes(id));
});

test("Dos cuerpos contradictorios se conservan elegidos pero no se montan juntos",()=>{
  const custom=structuredClone(fixtureRules),first=aliases.get("sony-fx3"),second="fixture-second-body",input=rig([first,second,aliases.get("smallrig-4770")]);
  custom.planning_root_part_ids.push(second);custom.camera_part_ids.push(second);custom.exclusive_selection_groups.find(g=>g.id==="camera-body").part_ids.push(second);
  const result=resolveRig(input,custom,[],fixtureMaster,names);assert(!result.variant.active_part_ids.length);assert.deepEqual(result.parked_ids,input.part_ids);
  assert.equal(resolveRig(rig([second]),custom,[],fixtureMaster,names).variant.active_part_ids[0],second);
});

test("Dos ópticas se conservan sin instalarlas simultáneamente",()=>{
  const custom=structuredClone(fixtureRules),camera=aliases.get("sony-fx3"),first=aliases.get("sony-fe-16-35-gm"),second="fixture-second-lens";
  custom.mount_dependencies[second]=[camera];custom.exclusive_selection_groups.find(g=>g.id==="mounted-lens").part_ids.push(second);
  const result=resolveRig(rig([camera,first,second]),custom,[],fixtureMaster,names);assert.deepEqual(result.variant.active_part_ids,[camera]);assert.deepEqual(result.parked_ids,[first,second]);
});

test("Ruta visual ausente o ambigua no activa monitor ni alimentación ficticios",()=>{
  const input=rig(remap(["sony-fx3","smallrig-4770","smallrig-2906b","smallhd-indie-7","sony-np-f970-pro","kondor-blue-hdmi-aa"]));
  for(const viewer_routes of [[],[{id:"fixture-a",condition:{}},{id:"fixture-b",condition:{}}]]){const custom={...fixtureRules,viewer_routes},result=resolveRig(input,custom,fixtureCables,fixtureMaster,names);
    assert.equal(result.variant.viewer.monitor_mount_route,undefined);assert(result.parked_ids.includes(aliases.get("smallhd-indie-7")));assert(!result.variant.cable_profile_ids.includes(aliases.get("vid-fx3-to-smallhd")));
  }
});

test("Ocultación de subensambles procede del manifiesto, no de una marca en el visor",()=>{
  const node=fixtureLayout.nodes.find(n=>n.kind==="cage"),withHandle=remap(templates.find(v=>v.viewer.rig_context==="handheld"));
  assert.deepEqual(hiddenSubassemblies(node,withHandle),node.visual_subassemblies.map(rule=>rule.object_name));
  assert.deepEqual(hiddenSubassemblies(node,{...withHandle,active_part_ids:withHandle.active_part_ids.filter(id=>id!==aliases.get("sony-xlr-h1"))}),[]);
  for(const real of layout.nodes.filter(node=>node.visual_subassemblies?.length)){
    const asset=assets.find(asset=>asset.part_id===real.id&&asset.status==="approved");assert(asset,"Subensamble sin modelo auditado");
    const bytes=readFileSync(new URL(`../public${asset.artifact.path}`,import.meta.url)),json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString("utf8"));
    for(const rule of real.visual_subassemblies)assert(json.nodes.some(node=>node.name===rule.object_name),"Objeto de subensamble ausente en GLB auditado: "+rule.object_name);
  }
});

test("Pieza sintética no reutiliza la malla autorizada de otro producto",()=>{
  const node=fixtureLayout.nodes.find(n=>n.kind==="camera"),part=fixtureParts.find(p=>p.id===node.id);
  assert.equal(approvedModelFor(node,part,assets),null);
});

test("Cambiar ruta ilustrativa no cambia puertos ni señal de un cable",()=>{
  const variant=remap(master);
  for(const cable of fixtureCables){const derived=cableForVariant(cable,variant);assert.equal(derived.from_port_id,cable.from_port_id);assert.equal(derived.to_port_id,cable.to_port_id);assert.equal(derived.voltage_or_signal_standard,cable.voltage_or_signal_standard);}
});

test("Los controles principales no contienen decisiones codificadas por producto",()=>{
  for(const file of ["src/lib/planner.ts","src/lib/assembly.ts","src/lib/viewer.ts","src/components/RigBuilder.tsx","src/components/RigViewer.tsx","src/components/AssemblyWizard.tsx","src/views/RigPlannerPage.tsx"]){
    const source=readFileSync(new URL(`../${file}`,import.meta.url),"utf8");
    for(const part of parts)assert(!source.includes(`.includes("${part.id}")`)&&!source.includes(`.has("${part.id}")`)&&!source.includes(`id==="${part.id}"`),`Decisión por modelo en ${file}: ${part.id}`);
  }
});

console.log(`EXTENSIBILIDAD: ${checks} pruebas; ecosistema sintético aislado, no equipos verificados ni altas del catálogo.`);
