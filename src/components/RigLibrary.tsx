import { useEffect, useRef, useState } from "react";
import { variantsData } from "../data";
import type { CustomRig, Variant } from "../lib/types";
import Icon from "./Icon";

interface Props {open:boolean;onClose:()=>void;rigs:CustomRig[];saved:CustomRig[];onOpen:(id:string)=>void;onCreate:()=>void;onTemplate:(v:Variant)=>void;onDuplicate:(r:CustomRig)=>void;onDelete:(id:string)=>void}
export default function RigLibrary({open,onClose,rigs,saved,onOpen,onCreate,onTemplate,onDuplicate,onDelete}:Props){
 const dialog=useRef<HTMLDialogElement>(null);const [deleteId,setDeleteId]=useState<string|null>(null);
 useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();if(!open&&dialog.current?.open)dialog.current.close();},[open]);
 return <dialog ref={dialog} className="library-dialog" aria-labelledby="library-title" onCancel={onClose} onClose={onClose}>
  <div className="dialog-heading"><div><p className="eyebrow">PREPARA TU PRÓXIMO RODAJE</p><h2 id="library-title">Mis rigs</h2></div><button className="icon-button" aria-label="Cerrar biblioteca" onClick={onClose}><Icon name="close"/></button></div>
  <div className="library-content"><div className="library-tools"><button className="primary-button" onClick={onCreate}><Icon name="plus"/>Crear rig desde cero</button></div><p className="library-note">Tus rigs guardados permanecen aquí al volver. Se guardan en este navegador, sin cuenta ni sincronización entre equipos. Los borradores sin guardar se pierden al cerrar la página.</p>
  {rigs.length===0?<div className="library-empty"><Icon name="design"/><h3>Un rig para cada rodaje</h3><p>Elige cada pieza desde cero o usa una plantilla como punto de partida.</p></div>:<div className="rig-card-grid">{rigs.map(r=>{
   const dirty=JSON.stringify(r)!==JSON.stringify(saved.find(s=>s.id===r.id));
   return <article className="saved-rig-card" key={r.id}><span className="saved-rig-symbol"><Icon name="design"/></span><span className={dirty?"draft-badge":"saved-badge"}>{dirty?"Borrador":"Guardado"}</span><h3>{r.name||"Sin nombre"}</h3><p>{r.part_ids.length} elementos · {r.context==="gimbal"?"Gimbal":r.context==="handheld"?"A mano":"Estático"} · {r.orientation==="vertical"?"9:16":"Horizontal"}</p><button className="rig-open" onClick={()=>onOpen(r.id)}>Abrir rig<Icon name="arrow"/></button><div className="rig-card-actions"><button onClick={()=>onDuplicate(r)}>Duplicar</button><button onClick={()=>setDeleteId(r.id)}>Eliminar</button></div>{deleteId===r.id&&<div className="delete-rig-confirm"><p>¿Eliminar este rig de la biblioteca local?</p><button onClick={()=>{onDelete(r.id);setDeleteId(null);}}>Sí, eliminar</button><button onClick={()=>setDeleteId(null)}>Cancelar</button></div>}</article>;
  })}</div>}
  <h3 className="library-section-title">Partir de una plantilla</h3><div className="template-grid">{variantsData.variants.map(v=><button key={v.id} onClick={()=>onTemplate(v)}><Icon name={v.id==="handheld-quick-release"?"design":"assemble"}/><span><strong>{v.label}</strong><small>{v.active_part_ids.length} elementos · Copia editable</small></span><Icon name="arrow"/></button>)}</div></div>
 </dialog>;
}
