import { useEffect, useRef, useState, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { Group, type Object3D } from "three";
import type { ModelAsset } from "../lib/model-assets";
import { disposeModel, loadAuditedModel, modelAppearance, type ModelLoadReport } from "../lib/model-runtime";

export default function ApprovedModel({ asset, selected, context, fallback, reportKey, onReport, removeTopRail=false }: { asset: ModelAsset; selected: boolean; context: boolean; fallback: ReactNode; reportKey: string; onReport: (report: ModelLoadReport) => void; removeTopRail?:boolean }) {
  const [model, setModel] = useState<Object3D | null>(null);
  const [state, setState] = useState<ModelLoadReport["state"]>("loading");
  const wrapper = useRef<Group>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    const controller = new AbortController(); let live = true, owned: Object3D | null = null;
    setModel(null); setState("loading");
    void (async () => {
      owned = await loadAuditedModel(asset, {
        fetch: (path, options) => fetch(path, options),
        digest: async bytes => [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(v => v.toString(16).padStart(2, "0")).join(""),
        parse: async bytes => {
          const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
          return (await new GLTFLoader().parseAsync(bytes, "")).scene;
        },
        dispose: disposeModel,
      }, controller.signal);
      if (!live) { disposeModel(owned); owned = null; return; }
      setModel(owned); setState("ready"); invalidate();
    })().catch(() => { if (live) { setModel(null); setState("failed"); invalidate(); } });
    return () => { live = false; controller.abort(); if (owned) disposeModel(owned); };
  }, [asset, invalidate]);
  const report = useRef(onReport);
  report.current = onReport;
  useEffect(() => { report.current({ key: reportKey, state }); }, [reportKey, state]);
  useEffect(() => {
    const restore = wrapper.current ? modelAppearance(wrapper.current, context, selected, model !== null) : () => {};
    invalidate(); return restore;
  }, [context, selected, model, invalidate]);
  const c = asset.calibration;
  useEffect(()=>{
    model?.traverse(object=>{if(object.name==="smallrig-4770/natoRail")object.visible=!removeTopRail;});
    invalidate();
  },[model,removeTopRail,invalidate]);
  return <group ref={wrapper}>{model ? <group position={c.offset_mm.map(v => v / 100) as [number, number, number]} rotation={c.rotation_deg.map(v => v * Math.PI / 180) as [number, number, number]} scale={c.uniform_scale * 10}><primitive object={model} dispose={null} /></group> : fallback}</group>;
}
