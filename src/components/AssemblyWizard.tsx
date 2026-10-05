import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { assemblySteps, cablesData, layoutData, plannerData, referencesData } from "../data";
import { assemblyFrame } from "../lib/planner";
import { connectionName, partName } from "../lib/ui";
import type { ViewAngle } from "./RigViewer";
import { publicDemo } from "../lib/publication";
import type { Variant } from "../lib/types";
import Icon from "./Icon";
const titles=assemblySteps.map(step=>step.title);
const RigViewer=lazy(()=>import("./RigViewer"));
export default function AssemblyWizard({variant,active}:{variant:Variant;active:boolean}) {
  const [index,setIndex]=useState(0); const [reviewed,setReviewed]=useState<Record<string,number[]>>({});
  const revision=`${variant.id}|${variant.active_part_ids.join(",")}|${variant.cable_profile_ids.join(",")}|${variant.viewer.mode}`;
  const [playing,setPlaying]=useState(false);const [angle,setAngle]=useState<ViewAngle>("iso");const [resetKey,setResetKey]=useState(0);
  useEffect(()=>{setIndex(0);setPlaying(false);},[revision]);
  useEffect(()=>{if(!playing||!active)return;const timer=window.setInterval(()=>{if(document.visibilityState!=="visible")return;setIndex(Math.min(index+1,12));if(index>=11)setPlaying(false);},4500);return ()=>clearInterval(timer);},[playing,active,index]);
  useEffect(()=>{if(!active)setPlaying(false);},[active]);
  const checks=new Set(reviewed[revision]??[]);
  const stepFocus=useRef<HTMLElement>(null);
  const goToStep=(next:number)=>{setPlaying(false);setIndex(next);requestAnimationFrame(()=>{document.getElementById("assembly-visual")?.scrollIntoView({block:"start"});});};
  const step=assemblySteps[index];
  const frame=assemblyFrame(variant,index+1,plannerData,cablesData.cables);
  const visualCount=layoutData.nodes.filter(n=>frame.variant.active_part_ids.includes(n.id)&&!frame.context_ids.includes(n.id)).length;
  const applies=!step.applies_if_any_part_ids.length||step.applies_if_any_part_ids.some(id=>variant.active_part_ids.includes(id));
  return <div className="assembly-workspace visual-assembly"><aside className="step-navigation"><p className="eyebrow">{checks.size} / 13 REVISADOS EN ESTA SESIÓN</p>{titles.map((title,i)=><button key={title} aria-current={index===i?"step":undefined} onClick={()=>goToStep(i)}><span>{checks.has(i)?"✓":String(i+1).padStart(2,"0")}</span>{title}</button>)}</aside>
    <div className="assembly-main"><section id="assembly-visual" className="assembly-visual" aria-label="Ensamblaje visual por etapas"><div className="assembly-view-toolbar"><span><b>{String(index+1).padStart(2,"0")}</b> {titles[index]}</span><div><select aria-label="Vista del ensamblaje" value={angle} onChange={e=>setAngle(e.target.value as ViewAngle)}><option value="iso">Vista 3/4</option><option value="side">Lateral</option><option value="front">Frontal</option></select><button className="icon-button" aria-label="Recentrar ensamblaje" onClick={()=>setResetKey(k=>k+1)}><Icon name="reset"/></button></div></div>
      {active&&(visualCount>0?<Suspense fallback={<div className="viewer-fallback">Preparando el ensamblaje...</div>}><RigViewer variant={frame.variant} exploded={false} showLabels={false} showCables={true} selectedId={frame.new_ids[0]??""} onSelect={()=>{}} angle={angle} selectedCableId={null} resetKey={resetKey} highlightIds={frame.new_ids} contextIds={frame.context_ids} reveal/></Suspense>:<div className="rig-empty-canvas"><Icon name="design"/><h3>Sin piezas montables en esta etapa</h3><p>La guía no añade accesorios que no hayas seleccionado. Revisa las piezas y sus dependencias.</p></div>)}
      <div className="assembly-stage-note"><span className="new-parts-dot"/>Nuevas piezas resaltadas{frame.context_ids.length>0&&<span>· Soporte translúcido: referencia, no acople</span>}<small>{visualCount} piezas representadas · Aparición ilustrativa, no trayectoria de inserción</small></div>
      <div className="assembly-playback"><button className="quiet-button" disabled={index===0} onClick={()=>goToStep(index-1)}>Anterior</button><button className="quiet-button playback-button" aria-pressed={playing} onClick={()=>{if(index===12)setIndex(0);setPlaying(v=>!v);}}><Icon name={playing?"pause":"play"}/>{playing?"Pausar":"Reproducir etapas"}</button><button className="primary-button" disabled={index===12} onClick={()=>goToStep(index+1)}>Siguiente<Icon name="arrow"/></button></div>
    </section><article ref={stepFocus} tabIndex={-1} className="step-focus"><div className="assembly-progress"><span>Paso {index+1} de 13</span><span>{checks.size} {checks.size===1?"revisado":"revisados"}</span><div role="progressbar" aria-label="Pasos revisados en este perfil" aria-valuemin={0} aria-valuemax={13} aria-valuenow={checks.size}><i style={{width:`${checks.size/13*100}%`}}/></div></div><h2>{titles[index]}</h2>{!applies&&<p className="step-profile-note">No aplica a tu perfil actual. Conservamos este paso de la configuración principal como referencia; no añadas estas piezas sólo por seguir la guía.</p>}<p className="frame-note">{frame.note}</p><div className="step-part-chips">{frame.new_ids.map(id=><span key={id}>{partName(id)}</span>)}{plannerData.assembly_frames[index].add_cable_ids.filter(id=>frame.variant.cable_profile_ids.includes(id)).map(id=><span key={id} className="cable-chip">{connectionName(id)}</span>)}</div><details className="assembly-mount-details"><summary>Ubicación y montaje de referencia</summary><div className="step-location"><small>QUÉ MONTAR</small><strong>{step.mount}</strong><small>DÓNDE</small><p>{step.where}</p></div></details>
      <h3>Antes de continuar</h3><ul className="check-list">{step.verify.map(item=><li key={item}>{item}</li>)}</ul><p className="rebalance"><b>Equilibrio:</b> {step.rebalance}</p>
      {!publicDemo&&index===4&&<img className="assembly-reference" src="/references/3203b-diagram-5.png" alt="Montajes de abrazadera 3203B documentados: borde superior, cara trasera y borde inferior"/>}
      {!publicDemo&&index===5&&<img className="assembly-reference" src="/references/3026b-diagram-7.png" alt="Soporte 3026B: orientación del monitor y carga máxima publicada de 1.5 kg"/>}
      {publicDemo&&(index===4||index===5)&&<a className="assembly-source" href={referencesData.documents.find(d=>d.id===(index===4?"smallrig-3203b-manual":"smallrig-3026b-manual"))?.url} target="_blank" rel="noreferrer">Consultar ilustración en el manual oficial (página {index===4?"5":"7"})</a>}
      <label className="step-confirm"><input type="checkbox" checked={checks.has(index)} onChange={e=>{const checked=e.target.checked;setReviewed(previous=>{const next=new Set(previous[revision]??[]);checked?next.add(index):next.delete(index);return {...previous,[revision]:[...next]};});}}/><span>He revisado este paso<small>Revisión de lectura, no certificación física.</small></span></label>
    </article>
    </div>
  </div>;
}
