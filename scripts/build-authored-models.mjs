import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { authoredModel } from "./lib/authored-models.mjs";
import { inspectGlb } from "./lib/inspect-glb.mjs";

// Exportador sin texturas ni fotos: FileReader sólo convierte Blob del propio código.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(data => { this.result = data; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(data => { this.result = `data:${blob.type};base64,${Buffer.from(data).toString("base64")}`; this.onloadend?.(); }); }
};
const nodes = JSON.parse(readFileSync(new URL("../data/layout-manifest.json", import.meta.url), "utf8")).nodes;
const root = new URL("../public/models/", import.meta.url); mkdirSync(root, { recursive: true });
const report = [];
for (const node of nodes.filter(node => node.model_authoring !== "pilot")) {
  const model = authoredModel(node), id = `${node.id}-takegrid-v1`;
  const buffer = Buffer.from(await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true }));
  const calibration = { uniform_scale: 1, offset_mm: [0, 0, 0], rotation_deg: [0, 0, 0] };
  const inspection = inspectGlb(buffer, calibration);
  if (buffer.length > 1_500_000 || inspection.triangles > 50_000) throw new Error("Presupuesto excedido: " + id);
  writeFileSync(new URL(id + ".glb", root), buffer);
  report.push({ id, part_id: node.id, path: `/models/${id}.glb`, bytes: buffer.length, sha256: createHash("sha256").update(buffer).digest("hex"), ...inspection });
  model.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
}
mkdirSync(new URL("../research/model-incoming/", import.meta.url), { recursive: true });
writeFileSync(new URL("../research/model-incoming/authored-models-report.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
console.log(`MALLAS PROPIAS: ${report.length} GLB, ${(report.reduce((s, r) => s + r.bytes, 0) / 1_000_000).toFixed(2)} MB. Informe local regenerado; registro de revisiones no modificado.`);
