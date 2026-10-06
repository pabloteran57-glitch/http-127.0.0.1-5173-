import assert from "node:assert/strict";
import { Box3, Euler, Matrix4, Quaternion, Vector3 } from "three";

const extensions = new Set(["KHR_materials_clearcoat", "KHR_materials_ior", "KHR_materials_specular", "KHR_materials_unlit", "KHR_texture_transform"]);

export function inspectGlb(bytes, calibration) {
  assert(bytes.length >= 28, "GLB truncado");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  assert.equal(view.getUint32(0, true), 0x46546c67, "Cabecera GLB inválida");
  assert.equal(view.getUint32(4, true), 2, "Sólo GLB 2");
  assert.equal(view.getUint32(8, true), bytes.length, "Longitud GLB distinta");
  let json, binary;
  for (let at = 12; at < bytes.length;) {
    assert(at + 8 <= bytes.length, "Chunk incompleto");
    const length = view.getUint32(at, true), type = view.getUint32(at + 4, true);
    assert(length % 4 === 0 && at + 8 + length <= bytes.length, "Chunk fuera de límites");
    const data = bytes.subarray(at + 8, at + 8 + length);
    if (type === 0x4e4f534a) { assert(!json && at === 12, "JSON duplicado/fuera de orden"); json = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data)); }
    else { assert(type === 0x004e4942 && json && !binary, "Chunk GLB no admitido"); binary = data; }
    at += 8 + length;
  }
  assert(json?.asset?.version === "2.0" && binary, "GLB sin documento o buffer");
  assert(json.buffers?.length === 1 && !json.buffers[0].uri && json.buffers[0].byteLength <= binary.length, "Buffer externo/no autocontenido");
  for (const image of json.images ?? []) assert(Number.isInteger(image.bufferView) && !image.uri && ["image/png", "image/jpeg"].includes(image.mimeType), "Textura externa o formato no admitido");
  for (const extension of [...(json.extensionsRequired ?? []), ...(json.extensionsUsed ?? [])]) assert(extensions.has(extension), "Extensión sin soporte auditado: " + extension);
  assert(!(json.animations?.length) && !(json.skins?.length), "El producto debe ser estático y separado");
  assert((json.nodes?.length ?? 0) <= 500, "Grafo demasiado complejo");
  const range = index => {
    const b = json.bufferViews?.[index];
    assert(b && b.buffer === 0 && Number.isInteger(b.byteLength) && b.byteLength > 0, "BufferView inválido");
    const start = b.byteOffset ?? 0;
    assert(Number.isInteger(start) && start >= 0 && start + b.byteLength <= json.buffers[0].byteLength, "BufferView fuera de límites");
    return { b, start };
  };
  for (let i = 0; i < (json.bufferViews?.length ?? 0); i++) range(i);
  for (const image of json.images ?? []) range(image.bufferView);
  const readIndices = (index, vertices) => {
    const a = json.accessors?.[index], width = { 5121: 1, 5123: 2, 5125: 4 }[a?.componentType];
    assert(width && a.type === "SCALAR" && !a.sparse && !a.normalized && Number.isInteger(a.count) && a.count > 0 && a.count <= 150_000, "Índices inválidos");
    const { b, start } = range(a.bufferView), offset = a.byteOffset ?? 0;
    assert(!b.byteStride && Number.isInteger(offset) && offset >= 0 && offset % width === 0 && offset + a.count * width <= b.byteLength, "Índices fuera de límites");
    const data = new DataView(binary.buffer, binary.byteOffset, binary.byteLength);
    const indices = [];
    for (let i = 0; i < a.count; i++) {
      const at = start + offset + i * width;
      const value = width === 1 ? data.getUint8(at) : width === 2 ? data.getUint16(at, true) : data.getUint32(at, true);
      assert(value < vertices, "Índice refiere vértice inexistente");
      indices.push(value);
    }
    return indices;
  };
  const positions = index => {
    const a = json.accessors?.[index];
    assert(a && a.componentType === 5126 && a.type === "VEC3" && !a.sparse && !a.normalized && Number.isInteger(a.count) && a.count > 0 && a.count <= 150_000, "POSITION debe ser FLOAT VEC3 explícito y acotado");
    const { b, start } = range(a.bufferView), offset = a.byteOffset ?? 0, stride = b.byteStride ?? 12;
    assert(Number.isInteger(offset) && offset >= 0 && Number.isInteger(stride) && stride >= 12 && stride <= 252 && stride % 4 === 0 && offset + (a.count - 1) * stride + 12 <= b.byteLength, "Accessor fuera de límites");
    const data = new DataView(binary.buffer, binary.byteOffset, binary.byteLength);
    return Array.from({ length: a.count }, (_, i) => {
      const point = [0, 1, 2].map(axis => data.getFloat32(start + offset + i * stride + axis * 4, true));
      assert(point.every(Number.isFinite), "Coordenada no finita"); return new Vector3(...point);
    });
  };
  const calibrated = new Matrix4().compose(new Vector3(...calibration.offset_mm).multiplyScalar(.001), new Quaternion().setFromEuler(new Euler(...calibration.rotation_deg.map(v => v * Math.PI / 180))), new Vector3().setScalar(calibration.uniform_scale));
  const box = new Box3(), seen = new Set(); let triangles = 0;
  const visit = (id, parent) => {
    assert(Number.isInteger(id) && json.nodes[id] && !seen.has(id), "Grafo con nodo repetido/ciclo"); seen.add(id);
    const n = json.nodes[id];
    const matrix = new Matrix4();
    if (n.matrix) { assert(n.matrix.length === 16 && n.matrix.every(Number.isFinite), "Matriz inválida"); matrix.fromArray(n.matrix); }
    else {
      for (const [v, length] of [[n.translation, 3], [n.rotation, 4], [n.scale, 3]]) assert(!v || v.length === length && v.every(Number.isFinite), "Transformación inválida");
      matrix.compose(new Vector3(...(n.translation ?? [0, 0, 0])), new Quaternion(...(n.rotation ?? [0, 0, 0, 1])), new Vector3(...(n.scale ?? [1, 1, 1])));
    }
    const world = parent.clone().multiply(matrix);
    if (n.mesh !== undefined) {
      const mesh = json.meshes?.[n.mesh]; assert(mesh?.primitives?.length, "Malla ausente");
      for (const p of mesh.primitives) {
        assert((p.mode ?? 4) === 4 && !p.targets && !p.extensions, "Sólo triángulos estáticos sin extensiones de malla");
        const pts = positions(p.attributes?.POSITION);
        const indices = p.indices === undefined ? pts.map((_, i) => i) : readIndices(p.indices, pts.length);
        const count = indices.length;
        assert(Number.isInteger(count) && count > 0 && count % 3 === 0, "Índices de triángulos inválidos");
        triangles += count / 3;
        for (const index of new Set(indices)) box.expandByPoint(pts[index].clone().applyMatrix4(world));
      }
    }
    for (const child of n.children ?? []) visit(child, world);
  };
  const scene = json.scenes?.[json.scene ?? 0]; assert(scene?.nodes?.length, "Escena vacía");
  for (const id of scene.nodes) visit(id, calibrated);
  assert(!box.isEmpty(), "Sin geometría visible");
  const bounds_mm = box.getSize(new Vector3()).multiplyScalar(1000).toArray();
  assert(bounds_mm.every(v => Number.isFinite(v) && v > 0), "Envolvente degenerada");
  return { triangles, bounds_mm, nodes: seen.size };
}
