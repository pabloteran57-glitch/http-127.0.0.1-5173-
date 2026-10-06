import { useEffect, useRef, useState, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { Group, Mesh, Texture, type Object3D } from "three";
import type { ModelAsset } from "../lib/model-assets";

function disposeModel(model: Object3D) {
  model.traverse(object => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      for (const value of Object.values(material)) if (value instanceof Texture) value.dispose();
      material.dispose();
    }
  });
}

export default function ApprovedModel({ asset, selected, context, fallback }: { asset: ModelAsset; selected: boolean; context: boolean; fallback: ReactNode }) {
  const [model, setModel] = useState<Object3D | null>(null);
  const wrapper = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    const controller = new AbortController(); let live = true, owned: Object3D | null = null;
    setModel(null);
    void (async () => {
      const response = await fetch(asset.artifact.path, { signal: controller.signal });
      if (!response.ok) throw new Error("Malla no disponible");
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength !== asset.artifact.bytes) throw new Error("Tamaño de malla distinto del auditado");
      const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(v => v.toString(16).padStart(2, "0")).join("");
      if (hash !== asset.artifact.sha256) throw new Error("Malla distinta de la auditada");
      if (!live) return;
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const gltf = await new GLTFLoader().parseAsync(bytes, "");
      owned = gltf.scene;
      if (!live) { disposeModel(owned); owned = null; return; }
      setModel(owned); invalidate();
    })().catch(() => { if (live) { setModel(null); invalidate(); } });
    return () => { live = false; controller.abort(); if (owned) disposeModel(owned); };
  }, [asset, invalidate]);
  useEffect(() => {
    const restore: (() => void)[] = [];
    wrapper.current?.traverse(object => {
      if (!(object instanceof Mesh)) return;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        const opacity = material.opacity, transparent = material.transparent, depthWrite = material.depthWrite;
        if (context) { material.opacity *= .18; material.transparent = true; material.depthWrite = false; }
        restore.push(() => { material.opacity = opacity; material.transparent = transparent; material.depthWrite = depthWrite; });
        if (model && "emissive" in material && "emissiveIntensity" in material) {
          const m = material as import("three").MeshStandardMaterial, color = m.emissive.clone(), intensity = m.emissiveIntensity;
          if (selected) { m.emissive.set("#62958d"); m.emissiveIntensity = .16; }
          restore.push(() => { m.emissive.copy(color); m.emissiveIntensity = intensity; });
        }
      }
    });
    invalidate(); return () => restore.forEach(reset => reset());
  }, [context, selected, model, invalidate]);
  const c = asset.calibration;
  return <group ref={wrapper}>{model ? <group position={c.offset_mm.map(v => v / 100) as [number, number, number]} rotation={c.rotation_deg.map(v => v * Math.PI / 180) as [number, number, number]} scale={c.uniform_scale * 10}><primitive object={model} dispose={null} /></group> : fallback}</group>;
}
