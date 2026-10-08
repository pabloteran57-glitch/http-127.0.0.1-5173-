import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { Box3, Group, Vector3 } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { authoredModel, authors } from "./lib/authored-models.mjs";
import { inspectGlb } from "./lib/inspect-glb.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const allNodes = read("layout-manifest").nodes, nodes=allNodes.filter(node=>node.model_authoring!=="pilot"), parts = read("parts-manifest").parts;
const registry = read("model-assets"), production = read("model-production");
const dispose = group => group.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
const source = node => { const group = new Group(); authors[node.kind](group, node); group.updateMatrixWorld(true); return group; };
const near = (a, b) => assert(Math.abs(a - b) < .02, `${a} != ${b}`);
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log("CORRECTO: " + name); };

test("El lote cubre los nodos, sin activar montajes implícitos", () => {
  assert.equal(nodes.length, 17); assert.equal(registry.assets.length, 20);
  assert.deepEqual(new Set(registry.assets.map(a => a.part_id)), new Set(allNodes.map(n => n.id)));
  assert(registry.assets.every(a => a.source.method === "manual" && a.review.mechanical_accuracy === "approximate"));
});
test("Las entradas tienen alcance explícito: malla, cable, reserva o software", () => {
  const ids = [...registry.assets.map(a => a.part_id), ...production.unmodeled.map(a => a.part_id)];
  assert.equal(ids.length, parts.length); assert.equal(new Set(ids).size, parts.length);
  assert.deepEqual(new Set(ids), new Set(parts.map(p => p.id)));
  assert.equal(production.unmodeled.filter(a => a.status === "software_no_mesh").length, 2);
});
test("Reconstruir no cambia puertos, masas, poses ni circuitos", () => {
  const before = JSON.stringify([nodes, parts, read("ports-manifest"), read("cables-manifest")]);
  for (const node of nodes) { const model = authoredModel(node); assert.equal(model.userData.canonical_ports_unchanged, true); dispose(model); }
  assert.equal(JSON.stringify([nodes, parts, read("ports-manifest"), read("cables-manifest")]), before);
});
test("Varillas huecas: diámetro 15 mm, largo 203.2 y centros 60 mm", () => {
  const group = source(nodes.find(n => n.kind === "rods")), tubes = group.children.filter(o => o.name.startsWith("Varilla hueca"));
  assert.equal(tubes.length, 2); near(tubes[1].position.x - tubes[0].position.x, 60);
  for (const tube of tubes) { const size = new Box3().setFromObject(tube).getSize(new Vector3()); near(size.x, 15); near(size.y, 15); near(size.z, 203.2); }
  dispose(group);
});
test("Abrazaderas se alinean con el plano canónico de varillas", () => {
  const rods = nodes.find(n => n.kind === "rods");
  for (const kind of ["baseplate", "batteryPlate"]) { const node = nodes.find(n => n.kind === kind), group = source(node), clamp = group.children.find(o => o.name.startsWith("Abrazadera doble")); near(clamp.position.y + node.position_mm[1], rods.position_mm[1]); dispose(group); }
});
test("Cabezal 3026B coincide visualmente con rosca inferior invertida", () => {
  const node = nodes.find(n => n.kind === "monitorMount"), monitor = nodes.find(n => n.kind === "monitor"), group = source(node);
  const screw = group.children.find(o => o.name === "Tornillo de monitor ilustrativo");
  near(screw.position.x + node.position_mm[0], monitor.position_mm[0]);
  near(screw.position.y + node.position_mm[1], monitor.position_mm[1] + 59.3);
  assert.equal(monitor.rotation_deg[2], 180); dispose(group);
});
test("Indie 7 no fusiona baterías NP-F no elegidas", () => {
  const group = source(nodes.find(n => n.kind === "monitor"));
  assert.equal(group.children.filter(o => o.name === "Fondo de alojamiento NP-F").length, 2);
  assert(!group.children.some(o => /Batería NP-F/.test(o.name))); dispose(group);
});
test("RS 4 Pro y Mic 2 mantienen alcance separado", () => {
  const gimbal = source(nodes.find(n => n.kind === "gimbal"));
  assert(!gimbal.children.some(o => /Cámara|Óptica|BG70|Trípode/.test(o.name))); dispose(gimbal);
  const receiver = registry.assets.find(a => a.part_id === "dji-mic-2-kit"); assert.equal(receiver.subcomponent_id, "receiver"); assert.equal(receiver.model_number, "DMR02");
});
test("BG70 separada no queda fusionada dentro de la unidad de control", () => {
  const gimbalNode = nodes.find(n => n.kind === "gimbal"), gripNode = nodes.find(n => n.kind === "grip"), group = source(gimbalNode);
  const control = group.children.find(o => o.name === "Unidad de control / sin BG30"), box = new Box3().setFromObject(control);
  near(box.min.y + gimbalNode.position_mm[1], gripNode.position_mm[1] + 82.5);
  dispose(group);
});
test("Sin fotografías o texturas incrustadas y siempre escala uniforme", () => {
  for (const asset of registry.assets) { const bytes = readFileSync(new URL("../public" + asset.artifact.path, import.meta.url)); const jsonLength = bytes.readUInt32LE(12), gltf = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString()); assert(!gltf.images?.length); assert(!gltf.textures?.length); assert.equal(asset.calibration.uniform_scale, 1); inspectGlb(bytes, asset.calibration); }
});

globalThis.FileReader = class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(bytes => { this.result = bytes; this.onloadend?.(); }); } };
for (const node of nodes) {
  const model = authoredModel(node), asset = registry.assets.find(a => a.part_id === node.id);
  const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true }));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.artifact.sha256, "Reconstrucción distinta de la revisión: " + node.id);
  dispose(model);
}
checks++;
console.log(`CORRECTO: exportación repetida de ${nodes.length} GLB coincide byte a byte con las huellas revisadas`);
console.log(`RECONSTRUCCIÓN: ${checks} comprobaciones de software, no certificación mecánica ni prueba física.`);
