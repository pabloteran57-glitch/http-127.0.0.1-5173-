import { useRef, useState } from "react";
import { variantsData } from "../data";
import RigViewer from "../components/RigViewerLoader";

export default function ViewerRecoveryLab() {
  const calls = useRef(0);
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const [load] = useState(() => async () => {
    calls.current++;
    if (calls.current === 1) throw new Error("Fallo de carga sintético para prueba local");
    return import("../components/RigViewer");
  });
  const variant = variantsData.variants.find(v => v.id === "handheld-quick-release")!;
  return <main className="product-lab"><a href="/">Volver a Takegrid</a><p className="eyebrow">PRUEBA LOCAL / NO ES UN PRODUCTO NUEVO</p><h1>Recuperación del visor</h1><p>Primer intento rechazado deliberadamente; el reintento carga el visor real. No modifica la biblioteca ni registra usuarios, GPU o pruebas físicas. Este laboratorio no forma parte de la compilación pública.</p><div className="lab-viewer"><RigViewer load={load} variant={variant} exploded={false} showCables={false} showLabels={false} selectedId="" onSelect={() => {}} angle="iso" selectedCableId={null} resetKey={0} onUnavailable={() => setFailed(true)} onScenePreparing={() => { setFailed(false); setReady(false); }} onSceneReady={() => setReady(true)}/></div><p role="status">{failed ? "Fallo simulado contenido: la página sigue operativa." : ready ? "Visor recuperado sin recargar la página." : "Preparando prueba."} Intentos: {calls.current}.</p><p>La selección de plantilla se conserva: {variant.active_part_ids.length} piezas. No se añade ningún modelo sintético al catálogo.</p></main>;
}
