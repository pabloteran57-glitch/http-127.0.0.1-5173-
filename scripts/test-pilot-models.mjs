import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";
import sharp from "sharp";
import { inspectGlb } from "./lib/inspect-glb.mjs";
const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const load = async name => {
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const { pilotModelIssues } = await load("pilot-model-assets"), { modelIssues } = await load("model-assets");
const registry = read("pilot-model-assets"), intake = read("catalog-intake"), active = read("parts-manifest"), models = read("model-assets"), variants = read("variants");
const selected = read("catalog-pilot").viewer.model_ids;
let count = 0;
const test = (name, run) => { run(); count++; console.log("CORRECTO: " + name); };
test("Tres recursos de origen revisados, con promoción explícita al catálogo", () => {
  assert.equal(registry.scope, "research_preview_only"); assert.equal(registry.assets.length, 3);
  assert.deepEqual(registry.assets.map(asset => asset.id), selected);
  assert.equal(new Set(selected).size, 3);
  const later=read("catalog-promotions").promotions.flatMap(p=>p.part_ids);
  assert.equal(active.parts.length, 33+later.length); assert.equal(models.assets.length, 20+later.length); assert.equal(variants.variants.length, 7);
  registry.assets.forEach(asset => {
    const product = intake.products.find(item => item.id === asset.part_id);
    assert.deepEqual(pilotModelIssues(asset, product), []);
    assert(read("pilot-integration").promoted_part_ids.includes(asset.part_id));
    const canonical=models.assets.find(model=>model.id===asset.id);
    assert.equal(canonical.artifact.sha256,asset.artifact.sha256);
    assert.equal(canonical.review.ports_authority,"ports-manifest.json");
    assert(modelIssues(asset, undefined, undefined).length > 0);
  });
});
const reject = (mutate, pattern) => { const asset = structuredClone(registry.assets[0]); mutate(asset); assert(pilotModelIssues(asset, intake.products.find(item => item.id === asset.part_id)).some(issue => pattern.test(issue))); };
test("Rechaza identidad FX3 o producto activado", () => { reject(asset => { asset.model_number = "ILME-FX3"; }, /Identidad/); assert(pilotModelIssues(registry.assets[0], { ...intake.products.find(item => item.id === "sony-fx30"), release_status: "active" }).length); });
test("Rechaza recurso de tercero, CAD o precisión mecánica inventada", () => { reject(asset => { asset.source.method = "community"; }, /investigación/); reject(asset => { asset.review.mechanical_accuracy = "exact"; }, /investigación/); });
test("Rechaza referencias, revisiones y derechos ausentes", () => { reject(asset => { asset.references = []; }, /Procedencia/); reject(asset => { asset.review.views = false; }, /Revisión/); reject(asset => { asset.rights.redistribution = false; }, /Derechos/); });
test("No admite fotos de fabricante como recurso ni transformación IA", () => { reject(asset => { asset.image.path = "/references/sony.jpg"; }, /Ruta/); reject(asset => { asset.rights.source_images_authorized = true; }, /Derechos/); });
test("No aplica poses de conjunto ni escala arbitraria", () => { reject(asset => { asset.calibration.offset_mm = [0, 3, 0]; }, /Escala/); reject(asset => { asset.calibration.uniform_scale = 2; }, /Escala/); });
test("Rechaza huellas y presupuestos alterados", () => { reject(asset => { asset.artifact.sha256 = "no"; }, /Huella/); reject(asset => { asset.image.bytes = 16001; }, /Presupuesto/); });
for (const asset of registry.assets) {
  const bytes = readFileSync(new URL("../public" + asset.artifact.path, import.meta.url));
  test("GLB autocontenido, escala y huella: " + asset.model_number, () => {
    assert.equal(bytes.length, asset.artifact.bytes); assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.artifact.sha256);
    const checked = inspectGlb(bytes, asset.calibration); assert.equal(checked.triangles, asset.artifact.triangles);
    checked.bounds_mm.forEach((value, index) => assert(Math.abs(value - asset.calibration.bounds_mm[index]) < .001));
    const jsonLength = bytes.readUInt32LE(12), document = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
    assert(!(document.images?.length)); assert(!(document.textures?.length));
    assert(document.nodes.every(node => !node.name || node.name.startsWith(asset.part_id)));
  });
  const image = readFileSync(new URL("../public" + asset.image.path, import.meta.url)), metadata = await sharp(image).metadata();
  test("Miniatura propia vinculada: " + asset.model_number, () => { assert.equal(image.length, asset.image.bytes); assert.equal(createHash("sha256").update(image).digest("hex"), asset.image.sha256); assert.equal(metadata.width, 400); assert.equal(metadata.height, 280); assert.equal(metadata.format, "webp"); });
}
console.log(`${count} comprobaciones del piloto visual superadas; no ensayos físicos.`);
