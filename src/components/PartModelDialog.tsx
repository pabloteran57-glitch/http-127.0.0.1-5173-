import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import type { ModelAsset } from "../lib/model-assets";
import type { ModelLoadState } from "../lib/model-runtime";
import ApprovedModel from "./ApprovedModel";
import Icon from "./Icon";

type View = "iso" | "front" | "back" | "side" | "top";
const views: { id: View; label: string }[] = [{ id: "iso", label: "Perspectiva" }, { id: "front", label: "Frontal" }, { id: "back", label: "Posterior" }, { id: "side", label: "Lateral" }, { id: "top", label: "Superior" }];

function InspectionCamera({ view, distance, front }: { view: View; distance: number; front: number }) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    const positions: Record<View, [number, number, number]> = { iso: [-.8, .5, -1], front: [0, 0, front], back: [0, 0, -front], side: [-1, 0, 0], top: [0, 1, .001] };
    camera.position.set(...positions[view]).normalize().multiplyScalar(distance);
    camera.lookAt(0, 0, 0); invalidate();
  }, [view, distance, front, camera, invalidate]);
  return <OrbitControls key={view} target={[0, 0, 0]} enablePan={false} minDistance={distance * .35} maxDistance={distance * 2} />;
}

class InspectionBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? <div className="viewer-fallback">Visor no disponible. La ficha y tu rig no se han modificado.</div> : this.props.children; }
}

export default function PartModelDialog({ asset, label, onClose }: { asset: ModelAsset; label: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<View>("iso"), [state, setState] = useState<ModelLoadState>("loading"), [attempt, setAttempt] = useState(0);
  useEffect(() => { dialog.current?.showModal(); }, []);
  const bounds = asset.calibration.bounds_mm.map(v => v / 100) as [number, number, number];
  const distance = Math.max(...bounds) * 2.25;
  const retry = () => { setState("loading"); setAttempt(v => v + 1); };
  return <dialog ref={dialog} className="part-model-dialog" aria-labelledby="part-model-title" onCancel={onClose} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">RECONSTRUCCIÓN PROPIA / APROXIMADA</p><h2 id="part-model-title">{label}</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar detalle 3D"><Icon name="close" /></button></div>
    <div className="part-model-stage" aria-label={`Detalle 3D de ${label}, aproximado`} data-model-state={state}>
      <InspectionBoundary key={attempt} onFail={() => setState("failed")}><Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [-distance, distance / 2, -distance], fov: 34 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.8} /><directionalLight position={[-3, 7, -6]} intensity={4.5} /><directionalLight position={[5, 3, 5]} intensity={3} color="#aec3d8" />
        <Center cacheKey={state}><ApprovedModel asset={asset} selected={false} context={false} reportKey={`${asset.id}:detail:${attempt}`} onReport={report => setState(report.state)} fallback={<mesh><boxGeometry args={bounds} /><meshStandardMaterial color="#6f8b82" wireframe /></mesh>} /></Center>
        <InspectionCamera view={view} distance={distance} front={asset.part_id === "smallhd-indie-7" ? -1 : 1} />
      </Canvas></InspectionBoundary>
      <span className="part-model-instruction">Arrastra para girar · Acerca para revisar</span>
    </div>
    <div className="part-model-views" aria-label="Vista de la pieza">{views.map(v => <button key={v.id} className="quiet-button" aria-pressed={view === v.id} onClick={() => setView(v.id)}>{v.label}</button>)}</div>
    <div className="part-model-note"><p role="status">{state === "ready" ? "Malla cargada y huella verificada. No es un escaneo ni CAD del fabricante." : state === "failed" ? "No se cargó la malla. La envolvente de respaldo es aproximada." : "Cargando la malla; envolvente de respaldo visible."}</p>{state === "failed" && <button className="quiet-button" onClick={retry}>Reintentar modelo</button>}<details><summary>Precisión y procedencia</summary><p>{asset.calibration.reference_basis}</p><p>{asset.rights.attribution}</p><a href={asset.calibration.reference_url} target="_blank" rel="noreferrer">Referencia de medidas</a><a href={asset.rights.evidence_url} target="_blank" rel="noreferrer">Procedencia y permiso de uso</a></details></div>
  </dialog>;
}
