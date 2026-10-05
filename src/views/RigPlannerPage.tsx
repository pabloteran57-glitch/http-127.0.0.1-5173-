import { lazy, Suspense, useRef, useState, type KeyboardEvent } from "react";
import { assemblySteps, cablesData, layoutData, partById, partsData, portsData, referencesData, sourcesData, variantsData } from "../data";
import { movingMass } from "../lib/viewer";
import type { Variant } from "../lib/types";
import type { ViewAngle } from "../components/RigViewer";
import PartsTable from "../components/PartsTable";
import PartInspector from "../components/PartInspector";
import ConnectionPanel, { SplitFeedDiagram, connectionName } from "../components/ConnectionPanel";
import AssemblyWizard from "../components/AssemblyWizard";
import Brand from "../components/Brand";
import brand from "../../data/brand.json";
import engineering from "../../data/engineering-manifest.json";
import ui from "../../data/ui-content.json";
import Icon from "../components/Icon";
import { partName } from "../lib/ui";
import { formatNumber } from "../lib/format";
const RigViewer=lazy(()=>import("../components/RigViewer"));
interface Props {
 exploded:boolean;onExplodedChange:(v:boolean)=>void;onShowCablesChange:(v:boolean)=>void;onShowLabelsChange:(v:boolean)=>void;onVariantChange:(v:string)=>void;showCables:boolean;showLabels:boolean;variant:Variant;
}
const names:Record<string,string>={"documentary-one-man-film":"Documental / solo","commercial-solo-gimbal":"Comercial","handheld-quick-release":"A mano","lower-budget-stripped-down":"Esencial","vertical-916-creator-mode":"Vertical 9:16","corporate-interview":"Entrevista","cinema-narrative":"Cine / narrativa"};
const tabs=[{id:"design",label:"Rig",icon:"design"},{id:"connect",label:"Conexiones",icon:"connect"},{id:"assemble",label:"Montaje",icon:"assemble"},{id:"inventory",label:"Piezas",icon:"inventory"}] as const;
type Tab=typeof tabs[number]["id"];
function exportBlueprint(variant:Variant){
 const payload={exported_on:new Date().toISOString(),language:"es",warning:"Sólo planificación; geometría, rutas de cableado y holguras NO certificadas",brand,engineering,selected_variant:variant,parts:partsData,layout:layoutData,cables:cablesData,ports:portsData,assembly:assemblySteps,sources:sourcesData,references:referencesData};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download=`${brand.slug}-${variant.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export default function RigPlannerPage({exploded,onExplodedChange,onShowCablesChange,onShowLabelsChange,onVariantChange,showCables,showLabels,variant}:Props){
 const [tab,setTab]=useState<Tab>("design");const [selectedId,setSelectedId]=useState("sony-fx3");const [angle,setAngle]=useState<ViewAngle>("iso");const [bench,setBench]=useState(false);const [cableId,setCableId]=useState("vid-fx3-to-smallhd");
 const [resetKey,setResetKey]=useState(0);
 const profileDialog=useRef<HTMLDialogElement>(null);
 const mass=movingMass(variant,layoutData,partById);
 const nodes=layoutData.nodes.filter(n=>variant.active_part_ids.includes(n.id));
 const ids=bench?cablesData.profiles.requested_dual_feed_bench:variant.cable_profile_ids;
 const selectedCable=ids.includes(cableId)?cableId:ids[0]??"";
 const switchVariant=(id:string)=>{onVariantChange(id);setSelectedId("sony-fx3");onExplodedChange(false);setBench(false);setResetKey(k=>k+1);};
 const switchTab=(id:Tab)=>{setTab(id);if(id==="connect"){onShowCablesChange(true);onShowLabelsChange(false);}if(id==="design"){setBench(false);onShowCablesChange(false);}if(window.matchMedia("(max-width:600px)").matches)requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"auto"}));};
 const tabKey=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?3:(index+(event.key==="ArrowRight"?1:3))%4;switchTab(tabs[next].id);document.getElementById(`tab-${tabs[next].id}`)?.focus();};
 const inspect=(id:string)=>{setSelectedId(id);switchTab("design");requestAnimationFrame(()=>document.getElementById("workspace")?.scrollIntoView({block:"start"}));};
 const profileHints:Record<string,string>=ui.profile_hints;
 return <main className="app-shell">
  <header className="app-header"><Brand onHome={()=>{switchTab("design");requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"auto"}));}}/><span className="project-name">EQUIPO <span>/</span> Sony FX3</span><button className="quiet-button export-button" onClick={()=>exportBlueprint(variant)}><Icon name="download"/>Exportar plan</button></header>
  <div className="project-bar"><div className="project-title"><p className="eyebrow">TU EQUIPO / SONY FX3</p><h1>Mi rig</h1><p className="profile-intent">{profileHints[variant.id]}</p></div><div className="build-controls"><label htmlFor="variant">Modo de rodaje</label><select id="variant" value={variant.id} onChange={e=>switchVariant(e.target.value)}>{variantsData.variants.map(v=><option value={v.id} key={v.id}>{names[v.id]}</option>)}</select><button className="profile-settings" onClick={()=>profileDialog.current?.showModal()}><Icon name="settings"/>Detalles del perfil</button></div></div>
  <div className="navigation-row"><nav className="app-navigation" role="tablist" aria-label="Tareas del rig">{tabs.map((t,i)=><button key={t.id} role="tab" id={`tab-${t.id}`} aria-controls="task-panel" aria-selected={tab===t.id} tabIndex={tab===t.id?0:-1} onKeyDown={e=>tabKey(e,i)} onClick={()=>switchTab(t.id)}><Icon name={t.icon}/><span>{t.label}</span></button>)}</nav><button className="planning-state" onClick={()=>profileDialog.current?.showModal()}><i/>Revisión física pendiente<Icon name="info"/></button></div>
  <p className="task-hint">{ui.task_hints[tab]}</p>
  <section id="task-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="task-panel">
  {(tab==="design"||tab==="connect")&&<div className="workspace" id="workspace">
    <div className="planner-toolbar"><div className="toolbar-primary"><div className="segmented">{tab==="connect"?<><button aria-pressed={!bench} onClick={()=>setBench(false)}>Mi rig</button><button aria-pressed={bench} onClick={()=>setBench(true)}>Doble HDMI <span>/ banco</span></button></>:<><button aria-pressed={!exploded} onClick={()=>onExplodedChange(false)}>Ensamble</button><button aria-pressed={exploded} onClick={()=>onExplodedChange(true)}>Despiece</button></>}</div>{tab==="design"&&<button className="connect-shortcut" aria-label="Ver conexiones" onClick={()=>switchTab("connect")}><Icon name="connect"/><span>Ver conexiones</span></button>}</div>
      {!bench&&<div className="view-tools"><select aria-label="Ángulo de vista" value={angle} onChange={e=>setAngle(e.target.value as ViewAngle)}><option value="iso">Vista 3/4</option><option value="side">Lateral</option><option value="front">Frontal</option></select><button className="icon-button" aria-label="Recentrar vista" title="Recentrar vista" onClick={()=>setResetKey(k=>k+1)}><Icon name="reset"/></button><details className="view-options"><summary aria-label="Opciones del visor"><Icon name="settings"/></summary><div className="view-options-menu"><label className="inline-check"><input type="checkbox" checked={showLabels} onChange={e=>onShowLabelsChange(e.target.checked)}/>Etiquetas</label><label className="inline-check"><input type="checkbox" checked={showCables} onChange={e=>onShowCablesChange(e.target.checked)}/>Cableado</label><button className="mobile-reset" onClick={()=>setResetKey(k=>k+1)}><Icon name="reset"/>Recentrar vista</button></div></details></div>}
    </div>
    {tab==="connect"&&<label className="mobile-connection-picker">Conexión<select value={selectedCable} onChange={e=>setCableId(e.target.value)}>{ids.map(id=><option key={id} value={id}>{connectionName(id)}</option>)}</select></label>}
    <div className="workspace-body"><div className="viewer-column">{tab==="connect"&&bench?<SplitFeedDiagram selectedId={selectedCable} onSelect={setCableId}/>:<Suspense fallback={<div className="viewer-fallback"><span className="loading-ring"/>Abriendo tu rig...</div>}><RigViewer variant={variant} exploded={exploded} showLabels={showLabels} showCables={showCables} selectedId={selectedId} onSelect={setSelectedId} angle={angle} selectedCableId={tab==="connect"?selectedCable:null} resetKey={resetKey}/></Suspense>}
      {tab==="design"&&<div className="part-strip" aria-label="Piezas del rig">{nodes.map(n=><button key={n.id} aria-pressed={selectedId===n.id} onClick={()=>setSelectedId(n.id)}>{n.label}</button>)}</div>}
      {tab==="design"&&<div className="mobile-part-focus"><span>{partName(selectedId)}</span><button onClick={()=>document.getElementById("part-inspector")?.scrollIntoView({block:"start"})}>Ver ficha<Icon name="arrow"/></button></div>}
      {bench?<div className="bench-context"><Icon name="info"/><p><strong>Circuito de referencia, independiente del perfil.</strong> Requiere las piezas y fuentes indicadas. No añade un soporte de distribuidor HDMI al rig ni modifica tu configuración.</p></div>:<div className="workspace-summary"><div><span>CARGA MÓVIL ESTIMADA</span><strong>~ {formatNumber(mass.subtotal/1000,2)} <small>kg</small></strong></div><p>Subtotal incompleto: faltan cables, fijaciones{variant.active_part_ids.includes("dji-mic-2-kit")?", RX":""}{!variant.active_part_ids.includes("smallrig-4253b")?" y NP-FZ100 interna":""}{mass.unknown?"; masas pendientes":""}. Monitor fuera de la carga móvil.</p><button onClick={()=>profileDialog.current?.showModal()}>Desglose<Icon name="arrow"/></button></div>}
    </div>{tab==="connect"?<ConnectionPanel variant={variant} bench={bench} selectedId={selectedCable} onSelect={setCableId}/>:<PartInspector selectedId={selectedId} variant={variant}/>}</div>
    <div className="workspace-notice"><Icon name="info"/><p>{bench?"Diagrama lógico. Comprueba señal, alimentación y conectores antes de encender.":"Modelo aproximado. Comprueba motores, manos y bucles antes de encender."}</p><button onClick={()=>profileDialog.current?.showModal()}>Ver comprobaciones</button></div>
  </div>}
  <div hidden={tab!=="assemble"}><AssemblyWizard variant={variant}/></div>
  {tab==="inventory"&&<div className="inventory-workspace"><div className="panel-heading"><h2>Tu equipo</h2><p>25 productos + 2 componentes del Combo</p></div><PartsTable variant={variant} selectedId={selectedId} onSelect={inspect}/></div>}
  </section>
  <footer className="app-footer"><span>{brand.name.toUpperCase()} / NOMBRE PROVISIONAL</span><p>Referencias de fabricante. Geometría de planificación, no CAD certificado.</p><button onClick={()=>profileDialog.current?.showModal()}>Ingeniería y plantillas</button></footer>
  <dialog ref={profileDialog} className="profile-dialog" aria-labelledby="profile-title"><div className="dialog-heading"><div><p className="eyebrow">TU PERFIL / CRITERIOS DE MONTAJE</p><h2 id="profile-title">{names[variant.id]}</h2></div><button className="icon-button" aria-label="Cerrar detalles del perfil" onClick={()=>profileDialog.current?.close()}><Icon name="close"/></button></div>
   <div className="dialog-content"><p className="dialog-intro">{variant.workflow_impact}</p><div className="profile-pills">{variantsData.variants.map(v=><button key={v.id} aria-pressed={v.id===variant.id} onClick={()=>switchVariant(v.id)}>{names[v.id]}</button>)}</div>
   <h3>Carga móvil modelada</h3><div className="mass-breakdown">{nodes.filter(n=>n.mass_domain==="moving").map(n=><div key={n.id}><span>{n.label}{partById[n.id].verified_weight_g.value===null?" / estimado":""}</span><b>{partById[n.id].planning_weight_g===null?"?":(partById[n.id].verified_weight_g.approximate?"~ ":"")+formatNumber(partById[n.id].planning_weight_g!)} g</b></div>)}</div><p className="panel-footnote">Suma de masas de planificación, incluye estimaciones. No incluye cables, RX, tarjetas ni tornillería adicional. BG70 sustituye a BG30. Centro de gravedad real no medido.</p>
   <details><summary>Distribución y límites publicados</summary><p><b>Centro ponderado de envolventes:</b> {mass.envelopeCentroid?.map(v=>Math.round(v)).join(" / ")} mm (X / Y / Z, origen cuerpo FX3). Es una aproximación de la distribución, no el centro de gravedad real ni un ajuste de equilibrio.</p><p><b>RS 4 Pro:</b> {formatNumber(engineering.limits.rs4_pro_tested_payload_g/1000)} kg nominales. No certifica holguras, inercia ni rig completo.</p><p><b>3026B:</b> carga publicada {formatNumber(engineering.limits["3026b_supported_load_g"]/1000)} kg. Indie 7: 737 g sin cables; carga estática nominal no demuestra rigidez ni seguridad dinámica.</p><p><b>Bloque trasero:</b> VB99 Pro 644 g + 3203B 351 g conservadores = 995 g bajo varillas; exige barrido de giro/inclinación. La carga admisible de esa pila no se ha verificado.</p><a href={engineering.limits["3026b_source_url"]} target="_blank" rel="noreferrer">Manual de soporte y límite de carga</a></details>
   <details><summary>Qué cambia en este perfil</summary><p><b>Equilibrio:</b> {variant.balance_impact}</p><p><b>Presupuesto:</b> {variant.budget_impact}</p><p><b>Complejidad:</b> {variant.complexity_impact}</p><p><b>Retirados:</b> {variant.parts_removed.map(partName).join(", ")||"Ninguno"}</p><p><b>Añadidos:</b> {variant.parts_added.map(partName).join(", ")||"Ninguno"}</p><p><b>Dependencias:</b> {variant.dependencies.join("; ")}</p></details>
   {variant.conditional_part_ids.length>0&&<details><summary>Accesorios en reserva</summary><p>{variant.conditional_part_ids.map(partName).join("; ")}</p></details>}
   <h3>Pruebas antes de producción</h3>{layoutData.clearance_gates.map(g=><details key={g.id}><summary>{g.title} <span>Pendiente</span></summary><p>{g.detail}</p></details>)}
   <details><summary>Cambios de conexiones frente a Comercial</summary><p><b>Retiradas:</b> {variant.cables_removed.map(connectionName).join("; ")||"Ninguna"}</p><p><b>Añadidas:</b> {variant.cables_added.map(connectionName).join("; ")||"Ninguna"}</p></details>
   <details><summary>Alternativa de menor presupuesto</summary><p>Perfil Esencial: sin monitor externo, V-mount, varillas ni parasol. Pantalla FX3 e interna NP-FZ100 confirmada. Monitor & Control es opcional con dispositivo/firmware compatibles; no se inventa soporte de teléfono.</p><button className="quiet-button" onClick={()=>switchVariant("lower-budget-stripped-down")}>Usar Esencial →</button></details>
   <details><summary>Referencias, CAD y licencias</summary><p>{referencesData.license_note}</p><p>Se encontró un escaneo comunitario de FX3, pero su descarga, escala y licencia no quedaron verificadas. No se importa como CAD mecánico.</p><a href="https://sketchfab.com/3d-models/sony-fx3-camera-scan-8eaae19fabce47daa5c0d031a1f0fc5e" target="_blank" rel="noreferrer">Consultar candidato comunitario</a></details>
   </div>
  </dialog>
 </main>;
}

