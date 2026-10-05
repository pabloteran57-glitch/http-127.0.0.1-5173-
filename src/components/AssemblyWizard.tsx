import { useRef, useState } from "react";
import { assemblySteps, referencesData } from "../data";
import { publicDemo } from "../lib/publication";
import type { Variant } from "../lib/types";
import Icon from "./Icon";
const titles=assemblySteps.map(step=>step.title);
export default function AssemblyWizard({variant}:{variant:Variant}) {
  const [index,setIndex]=useState(0); const [reviewed,setReviewed]=useState<Record<string,number[]>>({});
  const checks=new Set(reviewed[variant.id]??[]);
  const stepFocus=useRef<HTMLElement>(null);
  const goToStep=(next:number)=>{setIndex(next);requestAnimationFrame(()=>{stepFocus.current?.scrollIntoView({block:"start"});stepFocus.current?.focus({preventScroll:true});});};
  const step=assemblySteps[index];
  const applies=!step.applies_if_any_part_ids.length||step.applies_if_any_part_ids.some(id=>variant.active_part_ids.includes(id));
  return <div className="assembly-workspace"><aside className="step-navigation"><p className="eyebrow">{checks.size} / 13 REVISADOS EN ESTA SESIÓN</p>{titles.map((title,i)=><button key={title} aria-current={index===i?"step":undefined} onClick={()=>goToStep(i)}><span>{checks.has(i)?"✓":String(i+1).padStart(2,"0")}</span>{title}</button>)}</aside>
    <article ref={stepFocus} tabIndex={-1} className="step-focus"><div className="assembly-progress"><span>Paso {index+1} de 13</span><span>{checks.size} {checks.size===1?"revisado":"revisados"}</span><div role="progressbar" aria-label="Pasos revisados en este perfil" aria-valuemin={0} aria-valuemax={13} aria-valuenow={checks.size}><i style={{width:`${checks.size/13*100}%`}}/></div></div><h2>{titles[index]}</h2>{!applies&&<p className="step-profile-note">No aplica a tu perfil actual. Conservamos este paso de la configuración principal como referencia; no añadas estas piezas sólo por seguir la guía.</p>}<div className="step-location"><small>QUÉ MONTAR</small><strong>{step.mount}</strong><small>DÓNDE</small><p>{step.where}</p></div>
      <h3>Antes de continuar</h3><ul className="check-list">{step.verify.map(item=><li key={item}>{item}</li>)}</ul><p className="rebalance"><b>Equilibrio:</b> {step.rebalance}</p>
      {!publicDemo&&index===4&&<img className="assembly-reference" src="/references/3203b-diagram-5.png" alt="Montajes de abrazadera 3203B documentados: borde superior, cara trasera y borde inferior"/>}
      {!publicDemo&&index===5&&<img className="assembly-reference" src="/references/3026b-diagram-7.png" alt="Soporte 3026B: orientación del monitor y carga máxima publicada de 1.5 kg"/>}
      {publicDemo&&(index===4||index===5)&&<a className="assembly-source" href={referencesData.documents.find(d=>d.id===(index===4?"smallrig-3203b-manual":"smallrig-3026b-manual"))?.url} target="_blank" rel="noreferrer">Consultar ilustración en el manual oficial (página {index===4?"5":"7"})</a>}
      <label className="step-confirm"><input type="checkbox" checked={checks.has(index)} onChange={e=>{const checked=e.target.checked;setReviewed(previous=>{const next=new Set(previous[variant.id]??[]);checked?next.add(index):next.delete(index);return {...previous,[variant.id]:[...next]};});}}/><span>He revisado este paso<small>Revisión de lectura, no certificación física.</small></span></label>
      <div className="step-actions"><button className="quiet-button" disabled={index===0} onClick={()=>goToStep(index-1)}>Anterior</button><button className="primary-button" disabled={index===12} onClick={()=>goToStep(index+1)}>Siguiente<Icon name="arrow"/></button></div>
    </article>
  </div>;
}

