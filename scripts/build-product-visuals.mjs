import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import sharp from "sharp";
import { renderProductVisual, VISUAL_SIZE } from "./lib/render-product-visual.mjs";

const registry = JSON.parse(readFileSync(new URL("../data/model-assets.json", import.meta.url), "utf8"));
const output = new URL("../public/product-visuals/", import.meta.url);
mkdirSync(output, { recursive: true });
const report = [];
for (const model of registry.assets.filter(asset => asset.status === "approved" && asset.source.method === "manual")) {
  assert(model.rights.redistribution && model.rights.modification, "Permiso de derivación ausente");
  const bytes = readFileSync(new URL("../public" + model.artifact.path, import.meta.url));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), model.artifact.sha256, "Malla cambiada después de revisión");
  const decoded = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "");
  let image;
  try {
    const rendered = renderProductVisual(decoded.scene, { partId: model.part_id });
    assert(rendered.faces > 0, "Miniatura vacía");
    image = await sharp(Buffer.from(rendered.svg)).webp({ quality: 82, effort: 6 }).toBuffer();
  } finally { decoded.scene.traverse(node => { node.geometry?.dispose(); if (node.material) for (const material of Array.isArray(node.material) ? node.material : [node.material]) material.dispose(); }); }
  assert(image.length <= 16_000, "Miniatura fuera del presupuesto");
  writeFileSync(new URL(model.id + ".webp", output), image);
  report.push({ id: model.id, part_id: model.part_id, subcomponent_id: model.subcomponent_id, model_sha256: model.artifact.sha256, status: "candidate", method: "rendered_approved_mesh", image: { path: `/product-visuals/${model.id}.webp`, sha256: createHash("sha256").update(image).digest("hex"), bytes: image.length, ...VISUAL_SIZE }, caption: model.subcomponent_id === "receiver" ? "Modelo aprox. · sólo RX" : "Modelo aproximado", reviewed_on: null });
}
mkdirSync(new URL("../research/model-incoming/", import.meta.url), { recursive: true });
writeFileSync(new URL("../research/model-incoming/product-visuals-report.json", import.meta.url), JSON.stringify({ version: 1, assets: report }, null, 2) + "\n");
console.log(`MINIATURAS: ${report.length} derivaciones propias, ${report.reduce((sum, item) => sum + item.image.bytes, 0)} bytes. El generador no aprueba el registro.`);
