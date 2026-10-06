import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const manifest = read("connection-reviews"), cables = read("cables-manifest").cables;
const context = {catalog_revision: read("planner-rules").catalog_revision, parts: read("parts-manifest").parts, ports: read("ports-manifest").ports, sources: read("sources").sources};
const compiled = ts.transpileModule(readFileSync(new URL("../src/lib/connections.ts", import.meta.url), "utf8"), {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText;
const {assessConnection, compareVoltageRanges, comparePolarities} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const viewerCode = ts.transpileModule(readFileSync(new URL("../src/lib/viewer.ts", import.meta.url), "utf8"), {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022}}).outputText;
const {visibleCableIds} = await import(`data:text/javascript;base64,${Buffer.from(viewerCode).toString("base64")}`);
const assess = (id, m = manifest, c = context, link = cables.find(link => link.cable_id === id)) => assessConnection(link, m, c);
const check = (result, id) => result.checks.find(check => check.id === id);
const clone = value => structuredClone(value);
const monitor = "pwr-plate-to-smallhd", control = "ctrl-rs4-to-fx3-usbc", dummy = "pwr-vmount-to-fx3-dummy";
let count = 0;
function test(name, run) { run(); count++; console.log(`CORRECTO: ${name}`); }

test("Las tres revisiones mantienen pendientes y no autorizan uso", () => {
  for (const id of [monitor, control, dummy]) { const r = assess(id); assert(r.reviewed); assert.equal(r.state, "pending"); assert(r.checks.some(check => check.state === "documented")); assert(r.checks.some(check => check.state === "pending")); }
});
test("Catorce circuitos sin revisión ampliada no se presuponen compatibles", () => {
  const remainder = cables.filter(c => !manifest.reviews.some(r => r.cable_id === c.cable_id)); assert.equal(remainder.length, 14);
  for (const c of remainder) {const r = assess(c.cable_id); assert.equal(r.state, "pending"); assert.equal(r.reviewed, false);}
});
test("Control USB-C requiere evidencia del par, no identidad del conector", () => {
  assert.equal(check(assess(control), "control-pair").state, "documented");
  const m = clone(manifest); m.reviews[0].checks[0].pair[1] = "smallhd-indie-7";
  assert.equal(check(assess(control, m), "control-pair").state, "pending");
});
test("Firmware de la matriz no verifica el firmware instalado", () => {
  assert.equal(check(assess(control), "control-firmware").state, "pending");
  const m = clone(manifest); m.reviews[0].checks[0].tested_firmware = "";
  assert.equal(check(assess(control, m), "control-pair").state, "pending");
});
test("Rango completo contenido es distinto de solapamiento parcial", () => {
  assert.equal(compareVoltageRanges([11, 16.8], [10, 34]), "documented");
  assert.equal(compareVoltageRanges([10, 34], [10, 34]), "documented");
  for (const r of [[9, 16.8], [11, 35], [9, 35], [35, 40]]) assert.equal(compareVoltageRanges(r, [10, 34]), "blocked");
});
test("Tensión nominal, datos ausentes y rangos inválidos siguen pendientes", () => {
  for (const r of [14.8, null, undefined, [20, 10], [NaN, 20], [10, Infinity], [0, 20], [-1, 20], [10, 20, 30], ["10", 20]]) assert.equal(compareVoltageRanges(r, [10, 34]), "pending");
  assert.equal(check(assess(monitor), "monitor-voltage").state, "pending");
  assert.equal(check(assess(dummy), "dummy-input-range").state, "pending");
});
test("Polaridad documentada del cable no se hereda al monitor", () => {
  assert.equal(check(assess(monitor), "monitor-cable").state, "documented");
  assert.equal(check(assess(monitor), "monitor-polarity").state, "pending");
  assert.equal(comparePolarities("center_positive", null), "pending");
  assert.equal(comparePolarities("center_positive", "center_negative"), "blocked");
  assert.equal(comparePolarities("center_positive", "center_positive"), "documented");
  assert.equal(comparePolarities("unknown", "center_positive"), "pending");
});
test("Otra fuente oficial no demuestra el protocolo de este par", () => {
  const m = clone(manifest); const proof = m.reviews[0].citations.pair;
  proof.source_id = "src-smallhd-dtap-barrel"; proof.source_url = context.sources.find(s => s.id === proof.source_id).url;
  assert.equal(check(assess(control, m), "control-pair").state, "pending");
});
test("Una URL HTTPS sin alcance no equivale a evidencia", () => {
  const c = clone(context); delete c.sources.find(s => s.id === "src-dji-rs4-fx3-control-matrix").review_subject_part_ids;
  assert.equal(check(assess(control, manifest, c), "control-pair").state, "pending");
});
test("Fuente secundaria, retirada o trasladada no se acepta silenciosamente", () => {
  for (const mutation of [s => {s.type = "secondary";}, s => {s.url += "?otra=revision";}, s => {s.id = "retirada";}]) {
    const c = clone(context); mutation(c.sources.find(s => s.id === "src-dji-rs4-fx3-control-matrix"));
    assert.equal(check(assess(control, manifest, c), "control-pair").state, "pending");
  }
});
test("Sin localizador ni afirmación explícita no hay dato documentado", () => {
  for (const key of ["locator", "claim"]) { const m = clone(manifest); m.reviews[0].citations.pair[key] = ""; assert.equal(check(assess(control, m), "control-pair").state, "pending"); }
});
test("Modelo o nombre exacto distinto invalida la revisión", () => {
  for (const field of ["model_number", "exact_product_name"]) { const c = clone(context); c.parts.find(p => p.id === "sony-fx3")[field] = "Otra revisión"; assert.equal(assess(control, manifest, c).reviewed, false); }
});
test("Otro puerto USB-C no reutiliza la evidencia RSS", () => {
  const cable = clone(cables.find(c => c.cable_id === control)); cable.from_port_id = "rs4-focus";
  assert.equal(assess(control, manifest, context, cable).reviewed, false);
});
test("Conector, señal y revisión eléctrica vinculados", () => {
  for (const field of ["connector_a", "connector_b", "voltage_or_signal_standard"]) { const cable = clone(cables.find(c => c.cable_id === monitor)); cable[field] = "Otro dato"; assert.equal(assess(monitor, manifest, context, cable).reviewed, false); }
  const c = clone(context); c.ports.find(p => p.id === "indie7-dc").electrical.revision = "otra";
  assert.equal(assess(monitor, manifest, c).reviewed, false);
});
test("No se adopta el puerto de otra pieza por compartir conector", () => {
  const c = clone(context); c.ports.find(p => p.id === "fx3-usbc").part_id = "smallhd-indie-7";
  assert.equal(assess(control, manifest, c).reviewed, false);
});
test("Revisión ausente, catálogo diferente y registros duplicados se rechazan", () => {
  for (const mutation of [m => {m.revision = "";}, m => {m.catalog_revision = "otro";}, m => {m.reviews.push(clone(m.reviews[0]));}, m => {m.reviews[0].checks.push(clone(m.reviews[0].checks[0]));}]) {
    const m = clone(manifest); mutation(m); assert.equal(assess(control, m).reviewed, false);
  }
});
test("Comparación exige campo de rango, no nominal aunque tenga fuente", () => {
  const m = clone(manifest); m.reviews.find(r => r.cable_id === monitor).checks.find(c => c.id === "monitor-voltage").source.field = "output_nominal_v";
  assert.equal(check(assess(monitor, m), "monitor-voltage").state, "pending");
});
test("Incompatibilidad de rango sintetizada bloquea y pide no conectar", () => {
  const c = clone(context); const p = c.ports.find(p => p.id === "plate-dtap");
  p.electrical.output_range_v = [9, 35]; p.electrical.field_sources.output_range_v = "audit-doc-smallrig-3203b-manual";
  const r = assess(monitor, manifest, c); assert.equal(r.state, "blocked"); assert.match(r.action, /No conectar/);
});
test("Un dato sin fuente de campo no puede probar coincidencia", () => {
  const c = clone(context); c.ports.find(p => p.id === "indie7-dc").electrical.input_polarity = "center_positive";
  assert.equal(check(assess(monitor, manifest, c), "monitor-polarity").state, "pending");
});
test("Entrada 3203B y capacidad de batería no inventan una salida", () => {
  const port = context.ports.find(p => p.id === "plate-dtap");
  assert.equal(port.electrical.output_nominal_v, undefined);
  assert.equal(port.electrical.output_range_v, null);
  assert.equal(check(assess(monitor), "monitor-voltage").state, "pending");
});
test("Evaluar conexiones no modifica datos, selección ni evidencia", () => {
  const before = JSON.stringify({manifest, context, cables}); cables.forEach(c => assess(c.cable_id)); assert.equal(JSON.stringify({manifest, context, cables}), before);
});
test("La ruta seleccionada se ve aunque el cableado general esté oculto", () => {
  assert.deepEqual(visibleCableIds([control, monitor], false, monitor), [monitor]);
});
test("Todos los cables conserva los circuitos con geometría disponibles", () => {
  assert.deepEqual(visibleCableIds([control, monitor], true, monitor), [control, monitor]);
});
test("Una selección sin geometría no inventa una ruta visible", () => {
  assert.deepEqual(visibleCableIds([control], false, "pwr-ac-to-splitter"), []);
});
test("La vista sin selección respeta ocultar cableado", () => {
  assert.deepEqual(visibleCableIds([control, monitor], false, null), []);
});
test("Cambiar el cable resaltado no modifica ni añade circuitos", () => {
  const ids = [control, monitor], snapshot = [...ids];
  assert.deepEqual(visibleCableIds(ids, false, control), [control]);
  assert.deepEqual(ids, snapshot);
});
console.log(`CORRECTO: ${count} pruebas de evidencia y visibilidad. Los valores sintetizados sólo existen en pruebas, nunca en el catálogo.`);
