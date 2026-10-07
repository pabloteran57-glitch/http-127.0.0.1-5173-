import { useEffect, useRef, useState, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { Euler, Group, Matrix4, type Object3D } from "three";
import type { JointTransform } from "../lib/viewer";
import type { ModelAsset } from "../lib/model-assets";
import { disposeModel, loadAuditedModel, modelAppearance, modelObjectName, modelVisibility, type ModelLoadReport } from "../lib/model-runtime";

export default function ApprovedModel({ asset, selected, context, fallback, reportKey, onReport, hiddenObjectNames=[],objectTransforms={} }: { asset: ModelAsset; selected: boolean; context: boolean; fallback: ReactNode; reportKey: string; onReport: (report: ModelLoadReport) => void; hiddenObjectNames?:string[];objectTransforms?:Record<string,JointTransform[]> }) {
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
  const hiddenKey=JSON.stringify(hiddenObjectNames);
  useEffect(()=>{
    const restore=model?modelVisibility(model,JSON.parse(hiddenKey)):()=>{};
    invalidate();
    return restore;
  },[model,hiddenKey,invalidate]);
  const transformKey=JSON.stringify(objectTransforms);
  useEffect(()=>{
    const transforms=JSON.parse(transformKey) as Record<string,JointTransform[]>,restore:(()=>void)[]=[];
    model?.traverse(object=>{
      const originalName=modelObjectName(object);
      const rule=Object.entries(transforms).find(([prefix])=>originalName.startsWith(`${asset.part_id}/${prefix}/`))?.[1];
      if(!rule)return;
      const previous=object.matrix.clone(),auto=object.matrixAutoUpdate,composite=new Matrix4();
      for(const transform of rule){
        const pivot=transform.pivot_mm.map(v=>v/1000) as [number,number,number];
        const rotation=transform.rotation_deg.map(v=>v*Math.PI/180) as [number,number,number];
        const matrix=new Matrix4().makeTranslation(...pivot).multiply(new Matrix4().makeRotationFromEuler(new Euler(...rotation))).multiply(new Matrix4().makeTranslation(-pivot[0],-pivot[1],-pivot[2]));
        composite.premultiply(matrix);
      }
      object.matrixAutoUpdate=false;object.matrix.copy(composite).multiply(previous);object.matrixWorldNeedsUpdate=true;
      restore.push(()=>{object.matrix.copy(previous);object.matrixAutoUpdate=auto;object.matrixWorldNeedsUpdate=true;});
    });
    invalidate();return ()=>restore.forEach(reset=>reset());
  },[model,transformKey,asset.part_id,invalidate]);
  return <group ref={wrapper}>{model ? <group position={c.offset_mm.map(v => v / 100) as [number, number, number]} rotation={c.rotation_deg.map(v => v * Math.PI / 180) as [number, number, number]} scale={c.uniform_scale * 10}><primitive object={model} dispose={null} /></group> : fallback}</group>;
}
