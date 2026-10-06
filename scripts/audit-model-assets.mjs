import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";
import { inspectGlb } from "./lib/inspect-glb.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const registry = read("model-assets"), production = read("model-production");
const parts = read("parts-manifest").parts, nodes = read("layout-manifest").nodes;
const code = ts.transpileModule(readFileSync(new URL("../src/lib/model-assets.ts", import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { modelIssues } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
assert.equal(registry.version, 1); assert.equal(production.version, 1);
assert.equal(new Set(registry.assets.map(a => a.id)).size, registry.assets.length, "IDs de malla duplicados");
const approved = registry.assets.filter(a => a.status === "approved"), seen = new Set();
for (const job of production.priorities) {
  const p = parts.find(p => p.id === job.part_id); assert(p, "Trabajo ajeno al catálogo");
  assert(job.subcomponent_id === null || p.subcomponents?.some(c => c.id === job.subcomponent_id));
}
for (const asset of approved) {
  const part = parts.find(p => p.id === asset.part_id), node = nodes.find(n => n.id === asset.part_id);
  const issues = modelIssues(asset, part, node); assert.deepEqual(issues, [], asset.id + ": " + issues.join("; "));
  const key = `${asset.part_id}/${asset.subcomponent_id ?? "body"}`; assert(!seen.has(key), "Dos mallas activas para una pieza"); seen.add(key);
  const bytes = readFileSync(new URL("../public" + asset.artifact.path, import.meta.url));
  assert.equal(bytes.length, asset.artifact.bytes, "Tamaño de archivo distinto");
  assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.artifact.sha256, "Archivo cambiado después de revisión");
  const result = inspectGlb(bytes, asset.calibration);
  assert.equal(result.triangles, asset.artifact.triangles, "Polígonos declarados no corresponden al archivo");
  for (let i = 0; i < 3; i++) assert(Math.abs(result.bounds_mm[i] - asset.calibration.bounds_mm[i]) <= Math.max(.1, asset.calibration.bounds_mm[i] * .001), "Envolvente declarada no corresponde al GLB calibrado");
}
console.log(`MODELOS: ${approved.length} GLB autorizados y auditados. ${approved.length ? "Escala visual de referencia, no CAD certificado." : "Sin reemplazos ficticios: se mantienen proxies aproximados."}`);
