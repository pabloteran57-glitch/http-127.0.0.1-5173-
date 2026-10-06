import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Texture } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ts from "typescript";

const code = ts.transpileModule(readFileSync(new URL("../src/lib/model-runtime.ts", import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { loadAuditedModel, modelReadiness, modelSessionKey, updateModelReports, modelResources, modelAppearance, disposeModel } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const digest = async bytes => createHash("sha256").update(new Uint8Array(bytes)).digest("hex");
const bytes = new Uint8Array([1, 2, 3, 4]);
const asset = { id: "runtime-test-only", artifact: { path: "/models/runtime-test-only.glb", bytes: bytes.length, sha256: await digest(bytes.buffer) } };
const adapters = patch => ({ fetch: async () => new Response(bytes), digest, parse: async () => ({ synthetic: true }), dispose: () => {}, ...patch });
const aborted = () => { const controller = new AbortController(); controller.abort(); return controller.signal; };
let checks = 0;
const test = async (name, run) => { await run(); checks++; console.log("CORRECTO: " + name); };

await test("Sin mallas no bloquea montaje ni exige red", () => {
  assert.deepEqual(modelReadiness([], {}), { loading: [], failed: [], settled: true });
});
await test("Una malla no reportada o cargando impide avanzar", () => {
  assert.equal(modelReadiness(["a", "b"], { a: "ready" }).settled, false);
  assert.equal(modelReadiness(["a"], { a: "loading" }).settled, false);
});
await test("Fallo comunicado termina espera usando respaldo; no anuncia malla lista", () => {
  assert.deepEqual(modelReadiness(["a", "b"], { a: "ready", b: "failed" }), { loading: [], failed: ["b"], settled: true });
});
await test("Reintento y nueva etapa no heredan estado listo anterior", () => {
  const key = modelSessionKey(asset, 0, "1:0"), retry = modelSessionKey(asset, 1, "1:0"), next = modelSessionKey(asset, 0, "2:0");
  assert.notEqual(key, retry); assert.notEqual(key, next);
  assert.equal(modelReadiness([retry], { [key]: "ready" }).settled, false);
});
await test("Respuestas obsoletas no alteran etapa ni conservan mapas antiguos", () => {
  const before = { old: "ready" };
  assert.equal(updateModelReports(before, ["new"], { key: "old", state: "failed" }), before);
  assert.deepEqual(updateModelReports(before, ["new"], { key: "new", state: "loading" }), { new: "loading" });
});
await test("Carga correcta verifica bytes y hash antes de decodificar", async () => {
  const order = [], model = { synthetic: true };
  const loaded = await loadAuditedModel(asset, adapters({ fetch: async (url, { signal }) => { assert.equal(url, asset.artifact.path); assert.equal(signal.aborted, false); order.push("fetch"); return new Response(bytes); }, digest: async b => { order.push("hash"); return digest(b); }, parse: async () => { order.push("parse"); return model; } }), new AbortController().signal);
  assert.equal(loaded, model); assert.deepEqual(order, ["fetch", "hash", "parse"]);
});
await test("HTTP fallido y red caída nunca ejecutan parse", async () => {
  for (const fetch of [async () => new Response("", { status: 404 }), async () => { throw Error("Red de prueba"); }]) {
    let parsed = false;
    await assert.rejects(loadAuditedModel(asset, adapters({ fetch, parse: async () => { parsed = true; } }), new AbortController().signal), e => e.code === "network");
    assert.equal(parsed, false);
  }
});
await test("Tamaño truncado, excesivo o anunciado mayor falla antes de parse", async () => {
  for (const response of [new Response(bytes.subarray(0, 2)), new Response(new Uint8Array(8)), new Response(bytes, { headers: { "Content-Length": "8" } })]) {
    let parsed = false;
    await assert.rejects(loadAuditedModel(asset, adapters({ fetch: async () => response, parse: async () => { parsed = true; } }), new AbortController().signal), e => e.code === "size");
    assert.equal(parsed, false);
  }
});
await test("Hash distinto no carga una malla ni cambia geometría", async () => {
  let parsed = false;
  await assert.rejects(loadAuditedModel(asset, adapters({ digest: async () => "f".repeat(64), parse: async () => { parsed = true; } }), new AbortController().signal), e => e.code === "hash");
  assert.equal(parsed, false);
});
await test("Decode fallido queda como fallo recuperable", async () => {
  await assert.rejects(loadAuditedModel(asset, adapters({ parse: async () => { throw Error("GLB de prueba inválido"); } }), new AbortController().signal), e => e.code === "parse");
});
await test("Cancelación previa no inicia peticiones", async () => {
  let fetched = false;
  await assert.rejects(loadAuditedModel(asset, adapters({ fetch: async () => { fetched = true; return new Response(bytes); } }), aborted()), e => e.code === "aborted");
  assert.equal(fetched, false);
});
await test("Red sin respuesta tiene límite de espera y aborta la petición", async () => {
  let requestSignal;
  await assert.rejects(loadAuditedModel(asset, adapters({ fetch: async (_, init) => { requestSignal = init.signal; return new Promise(() => {}); } }), new AbortController().signal, 10), e => e.code === "timeout");
  assert.equal(requestSignal.aborted, true);
});
await test("Cancelar durante decode libera resultado tardío y no lo publica", async () => {
  const controller = new AbortController(), owned = { synthetic: true }, disposed = [];
  let complete, parsing;
  const started = new Promise(resolve => { parsing = resolve; });
  const result = loadAuditedModel(asset, adapters({ parse: () => { parsing(); return new Promise(resolve => { complete = resolve; }); }, dispose: model => disposed.push(model) }), controller.signal);
  await started; controller.abort();
  await assert.rejects(result, e => e.code === "aborted");
  complete(owned); await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(disposed, [owned]);
});
await test("Decode bloqueado también termina por tiempo y libera al completar", async () => {
  const owned = { synthetic: true }, disposed = [];
  let complete;
  await assert.rejects(loadAuditedModel(asset, adapters({ parse: () => new Promise(resolve => { complete = resolve; }), dispose: model => disposed.push(model) }), new AbortController().signal, 10), e => e.code === "timeout");
  complete(owned); await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(disposed, [owned]);
});

const sharedScene = () => {
  const scene = new Group(), texture = new Texture(), geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ map: texture, alphaMap: texture, opacity: .8, emissive: "#302010", emissiveIntensity: .3 });
  scene.add(new Mesh(geometry, material), new Mesh(geometry, [material, material]));
  return { scene, texture, geometry, material };
};
await test("Recursos compartidos se identifican una vez por instancia", () => {
  const { scene } = sharedScene(), resources = modelResources(scene);
  assert.equal(resources.materials.size, 1); assert.equal(resources.geometries.size, 1); assert.equal(resources.textures.size, 1);
  disposeModel(scene);
});
await test("Contexto y selección se restauran sin acumular transparencia", () => {
  const { scene, material } = sharedScene(), color = material.emissive.getHex();
  for (let i = 0; i < 5; i++) {
    const restore = modelAppearance(scene, true, true, true);
    assert.equal(material.opacity, .8 * .18); assert.equal(material.transparent, true); assert.equal(material.depthWrite, false);
    assert.equal(material.emissiveIntensity, .16);
    restore(); assert.equal(material.opacity, .8); assert.equal(material.transparent, false); assert.equal(material.depthWrite, true);
    assert.equal(material.emissive.getHex(), color); assert.equal(material.emissiveIntensity, .3);
  }
  disposeModel(scene);
});
await test("Geometría de respaldo conserva su material de selección", () => {
  const { scene, material } = sharedScene(), color = material.emissive.getHex();
  const restore = modelAppearance(scene, false, true, false);
  assert.equal(material.emissive.getHex(), color); assert.equal(material.emissiveIntensity, .3);
  restore(); disposeModel(scene);
});
await test("Liberación de recursos compartidos emite una sola disposición", () => {
  const { scene, material, geometry, texture } = sharedScene(), counts = [0, 0, 0];
  [material, geometry, texture].forEach((value, index) => value.addEventListener("dispose", () => counts[index]++));
  disposeModel(scene); assert.deepEqual(counts, [1, 1, 1]);
});
await test("GLTFLoader decodifica GLB sintético por el mismo adaptador", async () => {
  const binary = Buffer.alloc(36); [0, 0, 0, .1, 0, 0, 0, .1, .1].forEach((v, i) => binary.writeFloatLE(v, i * 4));
  const description = { asset: { version: "2.0" }, scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }], meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }], buffers: [{ byteLength: 36 }], bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 36 }], accessors: [{ bufferView: 0, componentType: 5126, type: "VEC3", count: 3, min: [0, 0, 0], max: [.1, .1, .1] }] };
  const json = Buffer.from(JSON.stringify(description)), padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 32); json.copy(padded);
  const file = Buffer.alloc(28 + padded.length + binary.length);
  file.writeUInt32LE(0x46546c67, 0); file.writeUInt32LE(2, 4); file.writeUInt32LE(file.length, 8);
  file.writeUInt32LE(padded.length, 12); file.writeUInt32LE(0x4e4f534a, 16); padded.copy(file, 20);
  const at = 20 + padded.length; file.writeUInt32LE(binary.length, at); file.writeUInt32LE(0x004e4942, at + 4); binary.copy(file, at + 8);
  const synthetic = { ...asset, artifact: { ...asset.artifact, bytes: file.length, sha256: await digest(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)) } };
  const model = await loadAuditedModel(synthetic, adapters({ fetch: async () => new Response(file), parse: async data => (await new GLTFLoader().parseAsync(data, "")).scene, dispose: disposeModel }), new AbortController().signal);
  assert.equal(modelResources(model).geometries.size, 1); disposeModel(model);
});
console.log(`RUNTIME DE MODELOS: ${checks} pruebas de software con recursos sintéticos; no son productos, GPU ni ensayos físicos.`);
