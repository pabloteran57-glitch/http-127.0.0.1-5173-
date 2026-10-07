import {useEffect,useRef,useState} from "react";
import {layoutData} from "../data";
import {monitorJoint,monitorPose} from "../lib/viewer";
import type {RigAdjustments,Variant} from "../lib/types";
import Icon from "./Icon";

export function adjustablePart(id:string,variant:Variant) {
  if(!variant.active_part_ids.includes(id))return false;
  const joint=monitorJoint(variant,layoutData);
  const slide=layoutData.battery_plate_slide;
  return !!joint&&[joint.mount_id,joint.monitor_id,...joint.attached_part_ids].includes(id)
    ||!!slide&&[slide.plate_id,...slide.attached_part_ids].includes(id)&&[slide.plate_id,slide.rod_id].every(part=>variant.active_part_ids.includes(part));
}

export default function PartAdjustments({partId,variant,onChange,onClose}:{partId:string;variant:Variant;onChange:(adjustments:RigAdjustments)=>void;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null),joint=monitorJoint(variant,layoutData),pose=monitorPose(variant,layoutData);
  const slideRule=layoutData.battery_plate_slide,plate=!!slideRule&&[slideRule.plate_id,...slideRule.attached_part_ids].includes(partId),adjustments=variant.viewer.adjustments??{},slide=adjustments.battery_plate;
  const [measuring,setMeasuring]=useState(!slide),[back,setBack]=useState(String(slide?.measured_back_mm??0)),[forward,setForward]=useState(String(slide?.measured_forward_mm??0)),[confirmed,setConfirmed]=useState(false),[error,setError]=useState("");
  const rodLength=layoutData.nodes.find(n=>n.id===slideRule?.rod_id)?.size_xyz_mm[2]??0;
  useEffect(()=>{if(!dialog.current?.open)dialog.current?.showModal();},[]);
  const monitor=(key:"tilt_deg"|"swivel_deg",value:number)=>{if(joint)onChange({...adjustments,monitor:{mount_id:joint.mount_id,...pose,[key]:value}});};
  const measure=()=>{
    const b=Number(back),f=Number(forward);
    if(!confirmed||!back.trim()||!forward.trim()||![b,f].every(v=>Number.isFinite(v)&&v>=0&&v<=rodLength)||b+f===0){setError("Indica ambos recorridos medidos y confirma el asiento de las abrazaderas.");return;}
    onChange({...adjustments,battery_plate:{offset_mm:Math.max(-b,Math.min(f,slide?.offset_mm??0)),measured_back_mm:b,measured_forward_mm:f}});setMeasuring(false);setError("");
  };
  const reset=()=>{
    if(plate&&slide)onChange({...adjustments,battery_plate:{...slide,offset_mm:0}});
    else if(joint)onChange({...adjustments,monitor:{mount_id:joint.mount_id,tilt_deg:0,swivel_deg:0}});
  };
  return <dialog ref={dialog} className="adjustment-dialog" aria-labelledby="adjustment-title" onCancel={onClose} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">AJUSTE DE PLANIFICACIÓN</p><h2 id="adjustment-title">{plate?"Placa y V-mount":"Orientar monitor"}</h2></div><button className="icon-button" aria-label="Cerrar ajustes" onClick={onClose}><Icon name="close"/></button></div>
    <div className="adjustment-content">
    {plate?<>
      <p className="adjustment-note">La 3203B no tiene bisagra. Placa y batería se desplazan juntas sobre las varillas tras aflojar y volver a fijar sus abrazaderas.</p>
      {measuring?<div className="measured-travel"><p>Indica cuánto puedes desplazarla desde la pose de referencia con las abrazaderas completamente asentadas, sin tocar motores ni manos.</p><div className="travel-fields"><label>Hacia atrás (mm)<input aria-label="Recorrido medido hacia atrás" type="number" inputMode="decimal" min="0" max={rodLength} step="0.5" value={back} onChange={e=>setBack(e.target.value)}/></label><label>Hacia delante (mm)<input aria-label="Recorrido medido hacia delante" type="number" inputMode="decimal" min="0" max={rodLength} step="0.5" value={forward} onChange={e=>setForward(e.target.value)}/></label></div><label className="inline-check"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>He medido el recorrido y el asiento en mi rig real.</label>{error&&<p role="alert">{error}</p>}<button className="primary-button" onClick={measure}>Usar recorrido medido</button></div>:slide&&<><label className="adjustment-slider">Desplazamiento <output>{slide.offset_mm} mm</output><input aria-label="Desplazamiento de placa V-mount" type="range" min={-slide.measured_back_mm} max={slide.measured_forward_mm} step="0.5" value={slide.offset_mm} onChange={e=>onChange({...adjustments,battery_plate:{...slide,offset_mm:Number(e.target.value)}})}/><span>Atrás / delante sobre varillas</span></label><button className="quiet-button" onClick={()=>{setMeasuring(true);setConfirmed(false);}}>Cambiar recorrido medido</button></>}
      <details><summary>Fuente y límites</summary><p>{slideRule?.source_locator}</p><p>{slideRule?.note}</p><a href={slideRule?.source_url} target="_blank" rel="noreferrer">Manual oficial 3203B</a></details>
    </>:joint&&<>
      <label className="adjustment-slider">Inclinación <output>{pose.tilt_deg}°</output><input aria-label="Inclinación del monitor" type="range" min={joint.tilt_range_deg[0]} max={joint.tilt_range_deg[1]} step="1" value={pose.tilt_deg} onChange={e=>monitor("tilt_deg",Number(e.target.value))}/><span>{joint.tilt_range_deg[1]-joint.tilt_range_deg[0]}° totales publicados en el soporte</span></label>
      {joint.swivel_range_deg[0]!==joint.swivel_range_deg[1]&&<label className="adjustment-slider">Giro <output>{pose.swivel_deg}°</output><input aria-label="Giro del monitor" type="range" min={joint.swivel_range_deg[0]} max={joint.swivel_range_deg[1]} step="1" value={pose.swivel_deg} onChange={e=>monitor("swivel_deg",Number(e.target.value))}/><span>Giro del 2906B: requiere ajustar la fijación con llave Allen.</span></label>}
      <p className="adjustment-note">Pantalla, batería y conectores se mueven juntos. Comprueba holgura de cables, manos y motores antes de replicarlo.</p>
      <details><summary>Fuente y límites</summary><p>{joint.source_locator}</p><p>{joint.geometry_note}</p><p>El rango del soporte no certifica el recorrido del rig completo ni su carga dinámica.</p><a href={joint.source_url} target="_blank" rel="noreferrer">Manual oficial del soporte</a></details>
    </>}
    </div><div className="adjustment-footer"><button className="quiet-button" onClick={reset} disabled={plate&&measuring}><Icon name="reset"/>Pose inicial</button><button className="primary-button" onClick={onClose}>Listo</button></div><p className="panel-footnote">Pose aproximada. Cambios en borrador; pulsa Guardar rig al terminar.</p>
  </dialog>;
}
