import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { inspectGlb } from "./lib/inspect-glb.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const parts = read("parts-manifest").parts, nodes = read("layout-manifest").nodes;
const code = ts.transpileModule(readFileSync(new URL("../src/lib/model-assets.ts", import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { modelIssues, approvedModelFor } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
// Valores sintéticos de auditoría, nunca registrados como producto ni recurso de la app.
const part = { ...parts[2], id: "audit-fixture", exact_product_name: "Pieza sintética de prueba", model_number: "TEST-ONLY" };
const node = { ...nodes.find(n => n.kind === "camera"), id: part.id };
const sample = () => ({
  id: "test-only", part_id: part.id, exact_product_name: part.exact_product_name, subcomponent_id: null, model_number: part.model_number, status: "approved",
  source: { method: "manual", url: "https://example.invalid/test-only", author: "Prueba sintética" },
  rights: { license: "CC0-1.0", evidence_url: "https://example.invalid/license", reviewed_on: "2026-10-06", commercial: true, redistribution: true, modification: true, source_images_authorized: false, source_images_evidence: "", attribution: "Sólo fixture sintético; no recurso publicado" },
  artifact: { path: "/models/test-only.glb", sha256: "a".repeat(64), bytes: 1024, triangles: 1 },
  calibration: { units: "metres", uniform_scale: 1, offset_mm: [0, 0, 0], rotation_deg: [0, 0, 0], bounds_mm: [100, 100, 100], reference_url: "https://example.invalid/reference", reference_basis: "Envolvente sintética, no producto real" },
  review: { identity: true, scale: true, views: true, interfaces: true, evidence: "Escenario artificial para prueba del contrato, no ensayo real", mechanical_accuracy: "approximate", ports_authority: "ports-manifest.json" }
});
const calibration = sample().calibration;
const glb = (edit = () => {}, points = [0, 0, 0, .1, 0, 0, 0, .1, .1]) => {
  const binary = Buffer.alloc(points.length * 4); points.forEach((v, i) => binary.writeFloatLE(v, i * 4));
  const json = { asset: { version: "2.0" }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }], meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }], buffers: [{ byteLength: binary.length }], bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: binary.length }], accessors: [{ bufferView: 0, componentType: 5126, type: "VEC3", count: 3 }] };
  edit(json);
  const raw = Buffer.from(JSON.stringify(json)), payload = Buffer.alloc(Math.ceil(raw.length / 4) * 4, 32); raw.copy(payload);
  const output = Buffer.alloc(12 + 8 + payload.length + 8 + binary.length);
  output.writeUInt32LE(0x46546c67, 0); output.writeUInt32LE(2, 4); output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(payload.length, 12); output.writeUInt32LE(0x4e4f534a, 16); payload.copy(output, 20);
  const at = 20 + payload.length; output.writeUInt32LE(binary.length, at); output.writeUInt32LE(0x004e4942, at + 4); binary.copy(output, at + 8);
  return output;
};
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log("CORRECTO: " + name); };
test("Registro vacío no activa mallas ni descargas", () => { assert.equal(approvedModelFor(node, part, []), null); });
test("Contrato válido sólo selecciona su pieza y no modifica manifiestos", () => { const a = sample(), before = JSON.stringify([a, node, part]); assert.deepEqual(modelIssues(a, part, node), []); assert.equal(approvedModelFor(node, part, [a]), a); assert.equal(JSON.stringify([a, node, part]), before); });
test("Cuarentena y dos revisiones activas no reemplazan el proxy", () => { const a = sample(); assert.equal(approvedModelFor(node, part, [{ ...a, status: "quarantine" }]), null); assert.equal(approvedModelFor(node, part, [a, { ...a, id: "duplicate" }]), null); });
test("Otro modelo, nombre o subcomponente no adopta geometría", () => { for (const patch of [{ model_number: "TEST-II" }, { exact_product_name: "Otra pieza" }, { subcomponent_id: "kit" }, { part_id: "otra-pieza" }]) assert(modelIssues({ ...sample(), ...patch }, part, node).length); });
test("RX requiere DMR02, no geometría del kit completo", () => { const p = parts.find(p => p.id === "dji-mic-2-kit"), n = nodes.find(n => n.id === p.id), a = { ...sample(), part_id: p.id, exact_product_name: p.exact_product_name, model_number: "DMR02", subcomponent_id: "receiver" }; assert.deepEqual(modelIssues(a, p, n), []); assert(modelIssues({ ...a, model_number: null, subcomponent_id: null }, p, n).length); });
test("No usar NC/ND ni permiso comercial sin redistribución/modificación", () => { for (const patch of [{ license: "CC-BY-NC-4.0" }, { license: "CC-BY-ND-4.0" }, { commercial: false }, { redistribution: false }, { modification: false }, { attribution: "" }, { evidence_url: "http://example.invalid/license" }]) assert(modelIssues({ ...sample(), rights: { ...sample().rights, ...patch } }, part, node).length); });
test("IA necesita derechos de fotografías aunque el resultado tenga licencia", () => { const a = sample(); a.source.method = "ai"; assert(modelIssues(a, part, node).length); a.rights.source_images_authorized = true; assert(modelIssues(a, part, node).length); a.rights.source_images_evidence = "Permiso sintético sólo para comprobar el contrato de prueba"; assert.deepEqual(modelIssues(a, part, node), []); });
test("No descargar rutas externas, traversal ni archivos sin hash", () => { for (const patch of [{ path: "https://example.invalid/model.glb" }, { path: "/models/../references/file.glb" }, { sha256: "" }, { bytes: 2000000 }, { triangles: 2500000 }]) assert(modelIssues({ ...sample(), artifact: { ...sample().artifact, ...patch } }, part, node).length); });
test("Escala no finita, deformación vectorial o base sin evidencia se rechazan", () => { for (const patch of [{ uniform_scale: [1, 2, 1] }, { uniform_scale: 0 }, { uniform_scale: NaN }, { units: "mm" }, { bounds_mm: [1, 0, 2] }, { reference_basis: "" }]) assert(modelIssues({ ...sample(), calibration: { ...calibration, ...patch } }, part, node).length); });
test("Malla nunca reclama CAD ni autoridad sobre puertos", () => { for (const patch of [{ mechanical_accuracy: "verified_exact" }, { ports_authority: "ai-model" }, { interfaces: false }, { views: false }]) assert(modelIssues({ ...sample(), review: { ...sample().review, ...patch } }, part, node).length); });
test("GLB sintético se inspecciona por vértices, no por bounds declarados", () => { const r = inspectGlb(glb(j => { j.accessors[0].min = [-99, -99, -99]; j.accessors[0].max = [99, 99, 99]; }), calibration); assert.equal(r.triangles, 1); assert(r.bounds_mm.every(v => Math.abs(v - 100) < .001)); });
test("Calibración uniforme y transformaciones de nodo cambian escala medida", () => { const r = inspectGlb(glb(j => { j.nodes[0].translation = [1, 2, 3]; j.nodes[0].scale = [2, 2, 2]; }), { ...calibration, uniform_scale: .5 }); assert(r.bounds_mm.every(v => Math.abs(v - 100) < .001)); });
test("GLB truncado, versión o longitud falsas fallan", () => { assert.throws(() => inspectGlb(Buffer.alloc(10), calibration)); const v = glb(); v.writeUInt32LE(1, 4); assert.throws(() => inspectGlb(v, calibration)); const b = glb(); b.writeUInt32LE(20, 8); assert.throws(() => inspectGlb(b, calibration)); });
test("Buffers/texturas externas no hacen peticiones de red", () => { for (const edit of [j => { j.buffers[0].uri = "https://example.invalid/buffer.bin"; }, j => { j.images = [{ uri: "https://example.invalid/photo.png" }]; }]) assert.throws(() => inspectGlb(glb(edit), calibration)); });
test("Draco sin soporte, animación y grafo cíclico se rechazan", () => { for (const edit of [j => { j.extensionsRequired = ["KHR_draco_mesh_compression"]; }, j => { j.animations = [{}]; }, j => { j.nodes[0].children = [0]; }]) assert.throws(() => inspectGlb(glb(edit), calibration)); });
test("Accessors fuera de buffer y puntos no finitos fallan", () => { assert.throws(() => inspectGlb(glb(j => { j.accessors[0].count = 300; }), calibration)); assert.throws(() => inspectGlb(glb(() => {}, [NaN, 0, 0, .1, 0, 0, 0, .1, .1]), calibration)); });
test("Índices inválidos no se aceptan por tener conteo plausible", () => { assert.throws(() => inspectGlb(glb(j => { j.accessors.push({ bufferView: 0, componentType: 5125, type: "SCALAR", count: 6 }); j.meshes[0].primitives[0].indices = 1; }), calibration)); });
test("GLB indexado ignora vértices no utilizados al medir su envolvente", () => { const r = inspectGlb(glb(j => { j.accessors[0].count = 4; j.accessors.push({ bufferView: 0, componentType: 5125, type: "SCALAR", count: 3 }); j.meshes[0].primitives[0].indices = 1; }, [0, 1.401298464324817e-45, 2.802596928649634e-45, .1, 0, 0, 0, .1, .1, 40, 40, 40]), calibration); assert.equal(r.triangles, 1); assert(r.bounds_mm.every(v => Math.abs(v - 100) < .001)); });
test("Jobs conservan catálogo y un candidato sin licencia no se activa", () => { const p = read("model-production"); for (const job of p.priorities) assert(parts.some(part => part.id === job.part_id)); for (const candidate of p.candidates.filter(c => c.license === null)) assert(!read("model-assets").assets.some(a => a.id === candidate.id && a.status === "approved")); assert.equal(parts.length, 27); });
test("FX3 usa 630 g de cuerpo oficial; 715 g no se suman como cuerpo", () => { const p = parts.find(p => p.id === "sony-fx3"); assert.equal(p.verified_weight_g.value, 630); assert.equal(p.planning_weight_g, 630); assert(p.verified_weight_g.source_url.includes("sony.com")); });
console.log(`MODELOS: ${checks} pruebas sintéticas de contrato y GLB. No son modelos reales, permisos concedidos ni ensayos físicos.`);
