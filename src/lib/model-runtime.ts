import type { BufferGeometry, Material, Mesh, MeshStandardMaterial, Object3D, Texture } from "three";
import type { ModelAsset } from "./model-assets";

export type ModelLoadState = "loading" | "ready" | "failed";
export interface ModelLoadReport { key: string; state: ModelLoadState }
export type ModelReports = Record<string, ModelLoadState>;
export const MODEL_LOAD_TIMEOUT_MS = 15_000;

export function modelSessionKey(asset: ModelAsset, attempt: number, scene: string) {
  return `${asset.id}:${asset.artifact.sha256}:${attempt}:${scene}`;
}

export function updateModelReports(previous: ModelReports, keys: string[], report: ModelLoadReport): ModelReports {
  if (!keys.includes(report.key)) return previous;
  const next = Object.fromEntries(keys.filter(key => previous[key]).map(key => [key, previous[key]]));
  next[report.key] = report.state;
  return next;
}

export function modelReadiness(keys: string[], reports: ModelReports) {
  const loading = keys.filter(key => !reports[key] || reports[key] === "loading");
  const failed = keys.filter(key => reports[key] === "failed");
  return { loading, failed, settled: loading.length === 0 };
}

export function modelResources(root: Object3D) {
  const geometries = new Set<BufferGeometry>(), materials = new Set<Material>(), textures = new Set<Texture>();
  root.traverse(object => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    geometries.add(mesh.geometry);
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value as Texture);
    }
  });
  return { geometries, materials, textures };
}

export function disposeModel(root: Object3D) {
  const resources = modelResources(root);
  resources.geometries.forEach(value => value.dispose());
  resources.materials.forEach(value => value.dispose());
  resources.textures.forEach(value => value.dispose());
}

export function modelAppearance(root: Object3D, context: boolean, selected: boolean, highlight: boolean) {
  const restore: (() => void)[] = [];
  for (const material of modelResources(root).materials) {
    const opacity = material.opacity, transparent = material.transparent, depthWrite = material.depthWrite;
    if (context) { material.opacity *= .18; material.transparent = true; material.depthWrite = false; material.needsUpdate = true; }
    restore.push(() => { material.opacity = opacity; material.transparent = transparent; material.depthWrite = depthWrite; material.needsUpdate = true; });
    if (highlight && "emissive" in material && "emissiveIntensity" in material) {
      const m = material as MeshStandardMaterial, color = m.emissive.clone(), intensity = m.emissiveIntensity;
      if (selected) { m.emissive.set("#62958d"); m.emissiveIntensity = .16; }
      restore.push(() => { m.emissive.copy(color); m.emissiveIntensity = intensity; });
    }
  }
  return () => restore.forEach(reset => reset());
}

export class ModelLoadError extends Error {
  constructor(public readonly code: "network" | "size" | "hash" | "parse" | "timeout" | "aborted") {
    super(`Carga de malla: ${code}`);
    this.name = "ModelLoadError";
  }
}

interface Loader<T> {
  fetch: (url: string, init: { signal: AbortSignal }) => Promise<Response>;
  digest: (bytes: ArrayBuffer) => Promise<string>;
  parse: (bytes: ArrayBuffer) => Promise<T>;
  dispose: (model: T) => void;
}

// Una carga abandonada puede terminar de decodificar: liberar su resultado, nunca publicarlo.
export async function loadAuditedModel<T>(asset: ModelAsset, loader: Loader<T>, signal: AbortSignal, timeoutMs = MODEL_LOAD_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  let accepting = true;
  let abortCode: "timeout" | "aborted" = "aborted";
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) abort();
  const timer = setTimeout(() => { abortCode = "timeout"; abort(); }, timeoutMs);
  let rejectAbort: () => void = () => {};
  const interrupted = new Promise<never>((_, reject) => {
    rejectAbort = () => reject(new ModelLoadError(abortCode));
    if (controller.signal.aborted) rejectAbort();
    else controller.signal.addEventListener("abort", rejectAbort, { once: true });
  });
  const check = () => { if (!accepting || controller.signal.aborted) throw new ModelLoadError(abortCode); };
  const operation = (async () => {
    check();
    let response: Response;
    try { response = await loader.fetch(asset.artifact.path, { signal: controller.signal }); }
    catch { check(); throw new ModelLoadError("network"); }
    check();
    if (!response.ok) throw new ModelLoadError("network");
    const declared = response.headers.get("Content-Length");
    if (declared !== null && Number(declared) > asset.artifact.bytes) throw new ModelLoadError("size");
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      if (reader) {
        while (true) {
          const chunk = await reader.read();
          check();
          if (chunk.done) break;
          length += chunk.value.byteLength;
          if (length > asset.artifact.bytes) throw new ModelLoadError("size");
          chunks.push(chunk.value);
        }
      } else {
        const buffer = await response.arrayBuffer();
        check(); length = buffer.byteLength; chunks.push(new Uint8Array(buffer));
      }
    } finally {
      if (reader) { if (length !== asset.artifact.bytes || controller.signal.aborted) await reader.cancel().catch(() => {}); reader.releaseLock(); }
    }
    if (length !== asset.artifact.bytes) throw new ModelLoadError("size");
    const bytes = new ArrayBuffer(length), output = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
    const hash = await loader.digest(bytes);
    check();
    if (hash !== asset.artifact.sha256) throw new ModelLoadError("hash");
    let model: T;
    try { model = await loader.parse(bytes); }
    catch { check(); throw new ModelLoadError("parse"); }
    if (!accepting || controller.signal.aborted) { loader.dispose(model); check(); }
    return model;
  })();
  try { return await Promise.race([operation, interrupted]); }
  finally {
    accepting = false;
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
    controller.signal.removeEventListener("abort", rejectAbort);
    controller.abort();
  }
}
