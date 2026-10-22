import { useEffect, useRef } from "react";
import { cablesData, plannerData, sourcesData, variantsData } from "../data";
import { attachmentDiagnostics,resolveRig,visibleAttachmentDiagnostics } from "../lib/planner";
import type { CustomRig } from "../lib/types";
import { partName } from "../lib/ui";
import ProductVisual from "./ProductVisual";
import Icon from "./Icon";
import MountResources from "./MountResources";

export default function AttachmentPicker({anchorId,rig,onClose,onAdd,onCatalog,onPrepareTripod}:{anchorId:string;rig:CustomRig;onClose:()=>void;onAdd:(optionId:string)=>void;onCatalog:()=>void;onPrepareTripod:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const master=variantsData.variants.find(variant=>variant.id===variantsData.master_variant_id)!;
  const diagnostics=visibleAttachmentDiagnostics(attachmentDiagnostics(anchorId,rig,plannerData,cablesData.cables,master,partName));
  const candidates=diagnostics.filter(item=>item.state==="ready"),other=diagnostics.filter(item=>item.state!=="ready");
  const variant=resolveRig(rig,plannerData,cablesData.cables,master,partName).variant;
  useEffect(()=>{if(dialog.current&&!dialog.current.open)dialog.current.showModal();},[]);
  return <dialog ref={dialog} className="attachment-dialog" aria-labelledby="attachment-title" onCancel={onClose} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">AÑADIR DESDE EL RIG</p><h2 id="attachment-title">Sobre {partName(anchorId)}</h2></div><button type="button" className="icon-button" aria-label="Cerrar accesorios compatibles" onClick={onClose}><Icon name="close"/></button></div>
    <div className="attachment-content"><p className="attachment-intro">Opciones con interfaces documentadas para este montaje. Revisa las piezas antes de añadirlas; el encaje físico sigue pendiente.</p>
      {["smallrig-4770","smallrig-1674"].includes(anchorId)&&rig.part_ids.includes("sony-fx3")&&(rig.context!=="static"||rig.orientation!=="landscape")&&<section className="setup-starter" aria-label="Cambiar a montaje con trípode"><strong>¿Quieres montar la FX3 y su jaula en trípode?</strong><p>Prepara cámara estática horizontal y elige el AD-01 con su placa incluida. Conserva todas tus unidades; la base 1674 ofrece la unión inferior cuando está elegida. No se añade óptica ni batería con este cambio.</p><button type="button" className="quiet-button" onClick={onPrepareTripod}>Preparar montaje en trípode</button></section>}
      <MountResources anchorId={anchorId} rig={rig} variant={variant} onReview={onCatalog}/>
      <div className="attachment-options">{candidates.map(({option,add_ids})=><article key={option.id} data-attachment-option={option.id}>
        <h3>{option.label}</h3><div className="attachment-pieces">{add_ids.map(id=><div key={id}><ProductVisual id={id}/><span>{partName(id)}</span></div>)}</div>
        <p>Se añadirán: {add_ids.map(partName).join(", ")}.</p>
        <details><summary>Cadena y comprobaciones</summary><p>{option.note}</p>{option.source_ids.map(id=>{const source=sourcesData.sources.find(source=>source.id===id);return source?<a key={id} href={source.url} target="_blank" rel="noreferrer">{source.brand}: fuente oficial</a>:null;})}</details>
        <button type="button" className="primary-button" onClick={()=>onAdd(option.id)} aria-label={`Añadir ${option.label}`}><Icon name="plus"/>Añadir al rig ({add_ids.length})</button>
      </article>)}</div>
      {!candidates.length&&<div className="empty-state"><h3>No hay opciones listas para añadir aquí</h3><p>{other.length?"Revisa abajo las opciones elegidas o bloqueadas y sus motivos.":"Aún no hay otra cadena documentada para esta pieza."} No se cambia tu configuración.</p></div>}
      {other.length>0&&<details className="attachment-diagnostics"><summary>Opciones elegidas o bloqueadas <span>{other.length}</span></summary><ul>{other.map(({option,state,reason})=><li key={option.id} data-attachment-state={state}><strong>{option.label}</strong><span className={`resource-state state-${state==="selected"?"occupied":"pending"}`}>{state==="selected"?"Ya elegida":"No disponible ahora"}</span><p>{reason}</p></li>)}</ul></details>}
      <p className="panel-footnote">No certifica compatibilidad universal. Añadir cambia tu borrador; pulsa Guardar rig para conservarlo en Mis rigs.</p>
      <button type="button" className="quiet-button" onClick={onCatalog}>Elegir otras piezas del catálogo<Icon name="arrow"/></button>
    </div>
  </dialog>;
}
