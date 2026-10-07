import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { pilotAuthors, pilotModel } from "./lib/pilot-models.mjs";
import { inspectGlb } from "./lib/inspect-glb.mjs";
import { renderProductVisual, VISUAL_SIZE } from "./lib/render-product-visual.mjs";

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(data => { this.result = data; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(data => { this.result = `data:${blob.type};base64,${Buffer.from(data).toString("base64")}`; this.onloadend?.(); }); }
};
for (const path of ["../public/models/", "../public/product-visuals/", "../research/model-incoming/"]) mkdirSync(new URL(path, import.meta.url), { recursive: true });
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const views = [["Perspectiva", [.75, .45, 1.4]], ["Frontal", [0, 0, 1]], ["Posterior", [0, 0, -1]], ["Lateral", [-1, 0, 0]], ["Superior", [0, 1, .001]]];
const report = [], panels = [];
for (const [row, partId] of Object.keys(pilotAuthors).entries()) {
  const model = pilotModel(partId), id = partId + "-pilot-v1";
  const bytes = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true }));
  const inspection = inspectGlb(bytes, { uniform_scale: 1, offset_mm: [0, 0, 0], rotation_deg: [0, 0, 0] });
  if (bytes.length > 1_500_000 || inspection.triangles > 50_000) throw new Error("Modelo excede presupuesto: " + id);
  writeFileSync(new URL("../public/models/" + id + ".glb", import.meta.url), bytes);
  const visual = renderProductVisual(model, { partId });
  const image = await sharp(Buffer.from(visual.svg)).webp({ quality: 82, effort: 6 }).toBuffer();
  writeFileSync(new URL("../public/product-visuals/" + id + ".webp", import.meta.url), image);
  for (const [column, [label, direction]] of views.entries()) {
    const rendered = renderProductVisual(model, { partId, viewDirection: direction });
    const title = `<svg width="400" height="310"><rect width="400" height="310" fill="#182228"/><text x="12" y="20" fill="#d8e6df" font-size="13">${partId} / ${label}</text></svg>`;
    panels.push({ input: await sharp(Buffer.from(title)).composite([{ input: Buffer.from(rendered.svg), top: 30, left: 0 }]).png().toBuffer(), top: row * 310, left: column * 400 });
  }
  report.push({ id, part_id: partId, artifact: { path: `/models/${id}.glb`, bytes: bytes.length, sha256: hash(bytes), triangles: inspection.triangles }, bounds_mm: inspection.bounds_mm, image: { path: `/product-visuals/${id}.webp`, bytes: image.length, sha256: hash(image), ...VISUAL_SIZE } });
  model.traverse(node => node.geometry?.dispose());
}
await sharp({ create: { width: 2000, height: 930, channels: 4, background: "#182228" } }).composite(panels).png().toFile(fileURLToPath(new URL("../research/model-incoming/pilot-contact-sheet.png", import.meta.url)));
writeFileSync(new URL("../research/model-incoming/pilot-models-report.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
console.log(`PILOTO: ${report.length} modelos candidatos, ${report.reduce((total, item) => total + item.artifact.bytes, 0)} bytes. Sin aprobacion automatica.`);
