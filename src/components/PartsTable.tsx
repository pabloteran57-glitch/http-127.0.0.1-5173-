import { useDeferredValue, useState } from "react";
import { partsData, referenceById } from "../data";
import type { Variant } from "../lib/types";
import Icon from "./Icon";
import { partName } from "../lib/ui";
import { formatNumber } from "../lib/format";
import { publicDemo } from "../lib/publication";
export default function PartsTable({variant,selectedId,onSelect}:{variant:Variant;selectedId:string;onSelect:(id:string)=>void}) {
 const [query,setQuery]=useState(""); const [activeOnly,setActiveOnly]=useState(false);
 const normalize=(value:string)=>value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 const q=useDeferredValue(normalize(query).trim());
 const parts=partsData.parts.filter(p=>(!activeOnly||variant.active_part_ids.includes(p.id))&&normalize(`${p.exact_product_name} ${p.model_number} ${p.brand} ${partName(p.id)}`).includes(q));
 return <div className="bom-panel"><div className="bom-toolbar"><label className="search-field"><Icon name="search"/><input aria-label="Buscar pieza" placeholder="Nombre, marca o modelo..." value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Borrar búsqueda" onClick={()=>setQuery("")}><Icon name="close"/></button>}</label><label className="inline-check"><input type="checkbox" checked={activeOnly} onChange={e=>setActiveOnly(e.target.checked)}/>Sólo este perfil</label><span className="inventory-count" aria-live="polite">{parts.length} {parts.length===1?"pieza":"piezas"}</span></div>
 <div className="inventory-grid">{parts.map(p=><button className={selectedId===p.id?"inventory-item selected-row":"inventory-item"} key={p.id} onClick={()=>onSelect(p.id)}>
 <div className="inventory-thumb">{!publicDemo&&referenceById[p.id]?<img src={referenceById[p.id].display_image} alt="" loading="lazy"/>:<span>{p.category==="software"?"APLICACIÓN":p.model_number??p.brand}</span>}</div>
 <div><small>{p.brand} / {p.model_number??"Producto"}</small><strong>{partName(p.id)}</strong><span>{p.category==="software"?"Aplicación":p.verified_weight_g.value===null?"Peso pendiente":`${p.verified_weight_g.approximate?"~":""}${formatNumber(p.verified_weight_g.value)} g`}</span></div>
 <span className={variant.active_part_ids.includes(p.id)?"status active":"status parked"}>{variant.active_part_ids.includes(p.id)?"PERFIL":"RESERVA"}</span></button>)}</div>
 {parts.length===0&&<div className="empty-state"><Icon name="search"/><h3>No encontramos esa pieza</h3><p>Prueba otro nombre o consulta todo el inventario.</p><button className="quiet-button" onClick={()=>{setQuery("");setActiveOnly(false);}}>Ver todas las piezas</button></div>}<p className="table-caption">Selecciona una pieza para abrir su ficha y sus fuentes.</p></div>;
}


