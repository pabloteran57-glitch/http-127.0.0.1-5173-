import { useEffect, useRef } from "react";
import { cablesData, plannerData, sourcesData, variantsData } from "../data";
import { attachmentCandidates } from "../lib/planner";
import type { CustomRig } from "../lib/types";
import { partName } from "../lib/ui";
import ProductVisual from "./ProductVisual";
import Icon from "./Icon";

export default function AttachmentPicker({anchorId,rig,onClose,onAdd,onCatalog}:{anchorId:string;rig:CustomRig;onClose:()=>void;onAdd:(optionId:string)=>void;onCatalog:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const master=variantsData.variants.find(variant=>variant.id===variantsData.master_variant_id)!;
  const candidates=attachmentCandidates(anchorId,rig,plannerData,cablesData.cables,master);
  useEffect(()=>{dialog.current?.showModal();},[]);
  return <dialog ref={dialog} className="attachment-dialog" aria-labelledby="attachment-title" onCancel={onClose} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">AÑADIR DESDE EL RIG</p><h2 id="attachment-title">Sobre {partName(anchorId)}</h2></div><button type="button" className="icon-button" aria-label="Cerrar accesorios compatibles" onClick={onClose}><Icon name="close"/></button></div>
    <div className="attachment-content"><p className="attachment-intro">Opciones con interfaces documentadas para este montaje. Revisa las piezas antes de añadirlas; el encaje físico sigue pendiente.</p>
      <div className="attachment-options">{candidates.map(({option,add_ids})=><article key={option.id} data-attachment-option={option.id}>
        <h3>{option.label}</h3><div className="attachment-pieces">{add_ids.map(id=><div key={id}><ProductVisual id={id}/><span>{partName(id)}</span></div>)}</div>
        <p>Se añadirán: {add_ids.map(partName).join(", ")}.</p>
        <details><summary>Cadena y comprobaciones</summary><p>{option.note}</p>{option.source_ids.map(id=>{const source=sourcesData.sources.find(source=>source.id===id);return source?<a key={id} href={source.url} target="_blank" rel="noreferrer">{source.brand}: fuente oficial</a>:null;})}</details>
        <button type="button" className="primary-button" onClick={()=>onAdd(option.id)} aria-label={`Añadir ${option.label}`}><Icon name="plus"/>Añadir al rig ({add_ids.length})</button>
      </article>)}</div>
      {!candidates.length&&<div className="empty-state"><h3>No hay accesorios pendientes de añadir aquí</h3><p>Las opciones documentadas ya están elegidas o no corresponden a este montaje. No se inventan adaptadores ni se cambia tu configuración.</p></div>}
      <p className="panel-footnote">No certifica compatibilidad universal. Añadir cambia tu borrador; pulsa Guardar rig para conservarlo en Mis rigs.</p>
      <button type="button" className="quiet-button" onClick={onCatalog}>Elegir otras piezas del catálogo<Icon name="arrow"/></button>
    </div>
  </dialog>;
}
