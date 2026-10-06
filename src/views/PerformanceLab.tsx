import { useState } from "react";
import { variantsData } from "../data";
import type { PerformanceResult, PerformanceRun } from "../lib/performance";
import RigViewer from "../components/RigViewerLoader";

export default function PerformanceLab(){
  const [profile,setProfile]=useState("commercial-solo-gimbal");
  const [device,setDevice]=useState("");
  const [run,setRun]=useState<PerformanceRun|null>(null);
  const [results,setResults]=useState<(PerformanceResult&{profile:string;device:string;viewport:string})[]>([]);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const variant=variantsData.variants.find(v=>v.id===profile)!;
  const start=(policy:PerformanceRun["policy"],workload:PerformanceRun["workload"])=>setRun({id:crypto.randomUUID(),policy,workload,duration_ms:8000});
  return <main className="product-lab">
    <a href="/">Volver a Takegrid</a><p className="eyebrow">CONTROL DE CALIDAD / NO CERTIFICACIÓN</p><h1>Laboratorio del visor</h1>
    <p>Compara la misma versión y escena durante ocho segundos. Los intervalos son llamadas de renderizado en JavaScript, no tiempos de GPU ni fotogramas presentados en pantalla. Cambiar de pestaña invalida la muestra.</p>
    <div className="lab-controls"><label>Dispositivo de prueba<input value={device} onChange={e=>setDevice(e.target.value)} placeholder="Modelo / navegador / versión" disabled={!!run}/></label><label>Configuración<select value={profile} disabled={!!run} onChange={e=>{setProfile(e.target.value);setReady(false);}}>{variantsData.variants.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}</select></label></div>
    <div className="lab-viewer"><RigViewer loadingMessage="Preparando escena..." key={profile} variant={variant} exploded={false} showLabels={false} showCables selectedId="" onSelect={()=>{}} angle="iso" selectedCableId={null} resetKey={run?1:0} sceneKey={profile} onScenePreparing={()=>{setReady(false);setFailed(false);}} onSceneReady={()=>{setReady(true);setFailed(false);}} onUnavailable={()=>{setFailed(true);setRun(null);}} performanceRun={run??undefined} onPerformanceResult={result=>{setResults(old=>[...old,{...result,profile,device:device.trim()||"Dispositivo no identificado",viewport:`${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}; DPR ${devicePixelRatio}`}]);setRun(null);}}/></div>
    <div className="lab-controls" aria-label="Pruebas comparables">{(["idle","orbit"] as const).flatMap(workload=>(["demand","always"] as const).map(policy=><button key={`${workload}-${policy}`} className="secondary-button" disabled={!ready||failed||!!run} onClick={()=>start(policy,workload)}>{workload==="idle"?"Reposo":"Giro de vista"} / {policy==="demand"?"Bajo demanda":"Continuo"}</button>))}<button disabled={!run} onClick={()=>setRun(null)}>Cancelar</button></div>
    <p role="status">{failed?"WebGL no disponible; no se registró una medición válida.":run?"Midiendo. No interactúes ni cambies de pestaña.":ready?"Escena lista. Repite cada prueba al menos tres veces con el mismo tamaño de ventana.":"Esperando al visor."}</p>
    <div className="lab-results">{results.map(r=><article key={r.id}><h2>{r.workload==="idle"?"Reposo":"Giro"} / {r.policy==="demand"?"Bajo demanda":"Continuo"}</h2><p>{r.device} · {r.viewport} · {variantsData.variants.find(v=>v.id===r.profile)?.label}</p><dl><dt>Estado</dt><dd>{r.status==="completed"?"Completa":"Interrumpida / no comparable"}</dd><dt>Ventana observada</dt><dd>{r.elapsed_ms} ms</dd><dt>Llamadas de renderizado</dt><dd>{r.frames}</dd><dt>Mediana / p95 del intervalo</dt><dd>{r.median_interval_ms?.toFixed(1)??"Sin muestra"} / {r.p95_interval_ms?.toFixed(1)??"Sin muestra"} ms</dd><dt>Intervalos mayores de 33.3 ms</dt><dd>{r.intervals_over_33ms}</dd></dl></article>)}</div>
    <p>Resultados temporales, sin telemetría ni guardado en una cuenta. El reposo bajo demanda puede no producir intervalos: eso no significa cero FPS. No se extrapola una mejora de batería, equilibrio o seguridad física.</p>
  </main>;
}
