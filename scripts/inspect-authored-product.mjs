import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import sharp from "sharp";
import { renderProductVisual, VISUAL_SIZE } from "./lib/render-product-visual.mjs";

const partId = process.argv[2];
assert(/^[a-z0-9-]+$/.test(partId ?? ""), "Indicar un ID canónico, no una ruta");
const report = JSON.parse(readFileSync(new URL("../research/model-incoming/authored-models-report.json", import.meta.url), "utf8"));
const asset = report.find(item => item.part_id === partId);
assert(asset, "Producto sin exportación propia");
const bytes = readFileSync(new URL("../public" + asset.path, import.meta.url));
assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
const model = (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), "")).scene;
const root = new URL("../research/model-incoming/", import.meta.url);
mkdirSync(root, { recursive: true });
const views = [["Perspectiva", [-.75, .45, 1.4]], ["Frontal", [0, 0, 1]], ["Posterior", [0, 0, -1]], ["Lateral", [-1, 0, 0]], ["Superior", [0, 1, .001]]];
const panels = [];
try {
  for (const [column, [label, viewDirection]] of views.entries()) {
    const visual = renderProductVisual(model, { partId, viewDirection });
    assert(visual.faces > 0, "Vista vacía");
    const background = `<svg width="400" height="310"><rect width="400" height="310" fill="#182228"/><text x="12" y="20" fill="#d8e6df" font-size="13">${partId} / ${label}</text></svg>`;
    panels.push({ input: await sharp(Buffer.from(background)).composite([{ input: Buffer.from(visual.svg), top: 30, left: 0 }]).png().toBuffer(), top: 0, left: column * 400 });
  }
  await sharp({ create: { width: 2000, height: 310, channels: 4, background: "#182228" } }).composite(panels).png().toFile(fileURLToPath(new URL(partId + "-contact-sheet.png", root)));
  const visual = renderProductVisual(model, { partId });
  const image = await sharp(Buffer.from(visual.svg)).webp({ quality: 82, effort: 6 }).toBuffer();
  assert(image.length <= 16_000, "Miniatura excede presupuesto");
  writeFileSync(new URL("../public/product-visuals/" + asset.id + ".webp", import.meta.url), image);
  writeFileSync(new URL(partId + "-visual-report.json", root), JSON.stringify({ ...asset, image: { path: "/product-visuals/" + asset.id + ".webp", bytes: image.length, sha256: createHash("sha256").update(image).digest("hex"), ...VISUAL_SIZE }, status: "candidate" }, null, 2) + "\n");
} finally {
  model.traverse(node => { node.geometry?.dispose(); for (const material of Array.isArray(node.material) ? node.material : node.material ? [node.material] : []) material.dispose(); });
}
console.log("INSPECCIÓN: cinco vistas y miniatura candidatas. El registro no se aprueba automáticamente.");
