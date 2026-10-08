import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const load = async name => {
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8"), {
    compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const planner = await load("planner"), assembly = await load("assembly"), viewer = await load("viewer"), connections = await load("connections");
const rules = read("planner-rules"), cables = read("cables-manifest").cables, parts = read("parts-manifest").parts;
const layout = read("layout-manifest"), ports = read("ports-manifest").ports, sources = read("sources").sources;
const content = read("assembly-profile-content"), templates = read("variants"), reviews = read("connection-reviews");
const master = templates.variants.find(v => v.id === templates.master_variant_id);
const battery = "sony-np-fz100", dummy = "smallrig-4253b", native = "pwr-npfz100-to-fx3-contacts";
const rig = (ids = ["sony-fx3", battery], context = "handheld", orientation = "landscape") => ({
  schema_version: 1, id: "rig-native-power-fixture", name: "Fuente nativa de prueba", part_ids: [...ids], context, orientation, updated_at: "2026-10-07T00:00:00Z"
});
const resolve = input => planner.resolveRig(input, rules, cables, master, id => id);
const timeline = variant => assembly.assemblyTimeline(variant, rules, cables, content);
let count = 0;
const test = (name, run) => {run(); count++; console.log("CORRECTO: " + name);};

test("Pareja FX3 nativa funciona en cada contexto y orientación admitidos", () => {
  for (const context of ["gimbal", "handheld", "static"]) for (const orientation of ["landscape", "vertical"]) {
    const input = rig(undefined, context, orientation), result = resolve(input);
    assert.deepEqual(result.variant.active_part_ids, input.part_ids);
    assert.deepEqual(result.variant.cable_profile_ids, [native]);
    assert(!result.issues.some(issue => issue.id === "internal-battery"));
  }
});
test("Una batería sin cuerpo queda elegida pendiente, sin contacto activo", () => {
  const result = resolve(rig([battery]));
  assert.deepEqual(result.parked_ids, [battery]); assert.deepEqual(result.variant.cable_profile_ids, []);
});
test("Batería y adaptador nunca ocupan simultáneamente el compartimento", () => {
  const ids = [...master.active_part_ids, battery], input = rig(ids, "gimbal"), before = JSON.stringify(input), result = resolve(input);
  for (const id of [battery, dummy]) {assert(result.parked_ids.includes(id)); assert(!result.variant.active_part_ids.includes(id));}
  assert(!result.variant.cable_profile_ids.includes(native));
  assert(!result.variant.cable_profile_ids.includes("pwr-vmount-to-fx3-dummy"));
  assert.equal(JSON.stringify(input), before);
});
test("Resolver conflicto recupera cada fuente sin borrar otras elecciones", () => {
  const ids = [...master.active_part_ids, battery], nativeRig = resolve(rig(ids.filter(id => id !== dummy), "gimbal"));
  assert(nativeRig.variant.active_part_ids.includes(battery)); assert(nativeRig.variant.cable_profile_ids.includes(native));
  assert(!nativeRig.issues.some(issue => issue.id === "camera-power"));
  assert.deepEqual(resolve(rig(ids.filter(id => id !== battery), "gimbal")).variant.active_part_ids, master.active_part_ids);
});
test("Conflictos excluyentes no proponen una fuente ni soportes para instalarla", () => {
  const input = rig([...master.active_part_ids, battery], "gimbal");
  assert(planner.selectionConflictProblem(dummy, input, rules));
  assert(planner.selectionConflictProblem(battery, input, rules));
  assert.deepEqual(planner.availableSupportIds([battery], rig(master.active_part_ids, "gimbal"), rules), []);
  const builder = readFileSync(new URL("../src/components/RigBuilder.tsx", import.meta.url), "utf8");
  assert(builder.includes("selectionConflictProblem(id,rig,plannerData) ? [] : availableSupportIds"));
});
test("V-mount para monitor no impone adaptador de cámara con fuente nativa", () => {
  const result = resolve(rig([...master.active_part_ids.filter(id => id !== dummy), battery], "gimbal"));
  assert(result.variant.cable_profile_ids.includes("pwr-plate-to-smallhd"));
  assert(result.variant.cable_profile_ids.includes(native)); assert(!result.variant.active_part_ids.includes(dummy));
  assert(!result.issues.some(issue => ["internal-battery", "camera-power"].includes(issue.id)));
});
test("FX3 sin fuente la solicita explícitamente sin insertar batería", () => {
  const input = rig(["sony-fx3"]), result = resolve(input);
  assert(result.issues.some(issue => issue.id === "internal-battery"));
  assert.deepEqual(input.part_ids, ["sony-fx3"]); assert.deepEqual(result.variant.cable_profile_ids, []);
});
test("Añadir desde FX3 ofrece batería pero no si el adaptador ya está elegido", () => {
  const candidates = planner.attachmentCandidates("sony-fx3", rig(["sony-fx3"]), rules, cables, master);
  const option = candidates.find(c => c.option.id === "fx3-camera-native-battery");
  assert(option); assert.deepEqual(option.add_ids, [battery]);
  assert(!planner.attachmentCandidates("sony-fx3", rig(master.active_part_ids, "gimbal"), rules, cables, master).some(c => c.option.id === option.option.id));
});
test("Contacto FX3 tiene identidad propia, sin coordenadas ni curva externa", () => {
  const c = cables.find(c => c.cable_id === native); assert.equal(c.to_part_id, "sony-fx3");
  assert.equal(c.to_port_id, "fx3-native-battery"); assert.equal(c.display_kind, "contacts");
  assert.equal(c.route_control_offsets_mm, null);
  for (const id of [c.from_port_id, c.to_port_id]) assert.equal(ports.find(p => p.id === id).local_position_mm, null);
  assert.notEqual(c.to_port_id, cables.find(c => c.cable_id === "pwr-vmount-to-fx3-dummy").to_port_id);
});
test("Revisión FX3 no reutiliza evidencia FX30 ni aprueba retención física", () => {
  const c = cables.find(c => c.cable_id === native), review = reviews.reviews.find(r => r.cable_id === native);
  assert(review.binding.models.some(model => model.part_id === "sony-fx3"));
  assert(Object.values(review.citations).every(c => c.source_id.startsWith("src-sony-fx3-")));
  const result = connections.assessConnection(c, reviews, {catalog_revision: rules.catalog_revision, parts, ports, sources});
  assert(result.reviewed); assert.equal(result.state, "pending");
  assert(result.checks.some(c => c.id === "native-identity" && c.state === "documented"));
  assert(result.checks.some(c => c.id === "native-retention" && c.state === "pending"));
});
test("Pose FX3 es interior y aproximada sin cambiar la pose del piloto", () => {
  const adjusted = viewer.layoutForVariant(resolve(rig()).variant, layout).nodes.find(n => n.id === battery);
  assert.equal(adjusted.parent_id, "sony-fx3"); assert.equal(adjusted.internal, true);
  assert.equal(adjusted.pose_status, "approximate_visual_only_not_mechanical");
  assert.equal(layout.nodes.find(n => n.id === battery).parent_id, "sony-fx30");
});
test("Subtotal 713 g suma cuerpo solo 630 y batería 83 sin tarjeta implícita", () => {
  const result = viewer.movingMass(resolve(rig()).variant, layout, Object.fromEntries(parts.map(p => [p.id, p])));
  assert.equal(result.subtotal, 713); assert(result.approximate); assert.notEqual(result.subtotal, 715);
});
test("Montaje incorpora batería y contactos sólo si fueron elegidos", () => {
  const v = resolve(rig()).variant, frame = planner.assemblyFrame(v, 1, rules, cables);
  assert.deepEqual(frame.variant.active_part_ids, v.active_part_ids); assert.deepEqual(frame.variant.cable_profile_ids, [native]);
  assert(timeline(v).find(s => s.number === 1).blocks.some(b => b.part_ids.includes(battery)));
  assert(timeline(resolve(rig(["sony-fx3"])).variant).every(s => !s.part_ids.includes(battery) && s.blocks.every(b => !b.part_ids.includes(battery))));
});
test("Extracción conserva sólo batería ya elegida y nunca sustituye dummy", () => {
  const withNative = resolve(rig([...master.active_part_ids.filter(id => id !== dummy), battery], "gimbal")).variant;
  const frame = planner.assemblyFrame(withNative, 13, rules, cables);
  assert(frame.variant.active_part_ids.includes(battery)); assert(frame.variant.cable_profile_ids.includes(native));
  assert(!planner.assemblyFrame(master, 13, rules, cables).variant.active_part_ids.includes(battery));
});
test("Siete plantillas no reciben batería implícita ni nueva señal", () => {
  for (const template of templates.variants) {
    const result = resolve(planner.newRig("Regresión", template));
    assert.deepEqual(result.variant.active_part_ids, template.active_part_ids);
    assert.deepEqual(new Set(result.variant.cable_profile_ids), new Set(template.cable_profile_ids));
    assert(!result.variant.active_part_ids.includes(battery));
  }
});
test("Cambio de cuerpo elige el contacto propio sin extrapolar otros equipos", () => {
  assert.deepEqual(resolve(rig(["sony-fx30", battery])).variant.cable_profile_ids, ["pilot-pwr-npfz100-fx30"]);
  const conflict = resolve(rig(["sony-fx3", "sony-fx30", battery]));
  assert.deepEqual(conflict.variant.cable_profile_ids, []); assert(conflict.parked_ids.includes(battery));
});
test("Conservar revisión de biblioteca no reescribe planes guardados", () => {
  assert.equal(planner.CATALOG_REVISION, "fx3-rs4-2026-10-05");
  const old = planner.newRig("Original", master), raw = JSON.stringify({version: 2, catalog_revision: planner.CATALOG_REVISION, rigs: [old]});
  assert.deepEqual(planner.parseLibrary(raw, parts.map(p => p.id), 40).rigs, [old]);
});

console.log(`ENERGIA NATIVA: ${count} comprobaciones; retencion y conjunto fisico pendientes.`);
