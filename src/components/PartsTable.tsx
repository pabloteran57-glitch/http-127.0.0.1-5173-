import { useDeferredValue, useState } from "react";
import { layoutData, partsData } from "../data";
import type { CustomRig, RigUnit, Variant } from "../lib/types";
import { rigUnits } from "../lib/planner";
import Icon from "./Icon";
import { partName } from "../lib/ui";
import { formatNumber } from "../lib/format";
import ProductVisual from "./ProductVisual";
import { inventoryEntries, normalizeSearch } from "../lib/inventory";

export default function PartsTable({variant, chosenIds, selectedId, onSelect, onEdit,rig}: {
  variant: Variant; chosenIds: string[]; selectedId: string; onSelect: (id: string) => void; onEdit: () => void;rig?:CustomRig|null;
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"rig" | "catalog">("rig");
  const search = useDeferredValue(normalizeSearch(query));
  const units=rig?rigUnits(rig):[];
  const allIds=rig?[...new Set(units.map(unit=>unit.part_id))]:chosenIds;
  const products=inventoryEntries(partsData.parts,variant,allIds,scope,"",partName);
  const entries=products.flatMap<(typeof products)[number]&{unit:RigUnit|undefined}>(entry=>{
    const selected=units.filter(unit=>unit.part_id===entry.part.id);
    return scope==="rig"&&rig?selected.map(unit=>({...entry,unit})): [{...entry,unit:undefined}];
  }).filter(entry=>normalizeSearch(`${partName(entry.part.id)} ${entry.part.exact_product_name} ${entry.part.model_number??""} ${entry.part.brand} ${entry.unit?.label??""}`).includes(search));
  return <div className="bom-panel">
    <div className="inventory-scope segmented" aria-label="Ámbito del equipo">
      <button aria-pressed={scope === "rig"} onClick={() => {setScope("rig"); setQuery("");}}>Mi equipo <span>{rig?units.length:chosenIds.length}</span></button>
      <button aria-pressed={scope === "catalog"} onClick={() => {setScope("catalog"); setQuery("");}}>Catálogo <span>{partsData.parts.length}</span></button>
      <button className="inventory-edit" onClick={onEdit}><Icon name="plus"/>Añadir o editar piezas</button>
    </div>
    <p className="inventory-scope-note">{scope === "rig" ? "Cada unidad por separado. Los repuestos no se montan ni se suman a la carga; los pendientes requieren revisión." : "Referencias para consultar. Ver una pieza aquí no la añade a tu rig ni confirma compatibilidad."}</p>
    <div className="bom-toolbar">
      <label className="search-field"><Icon name="search"/><input aria-label="Buscar pieza" placeholder={scope === "rig" ? "Buscar en mi equipo..." : "Buscar en el catálogo..."} value={query} onChange={event => setQuery(event.target.value)}/>{query && <button aria-label="Borrar búsqueda" onClick={() => setQuery("")}><Icon name="close"/></button>}</label>
      <span className="inventory-count" aria-live="polite">{entries.length} {entries.length === 1 ? "elemento" : "elementos"}</span>
    </div>
    <div className="inventory-grid">{entries.map(({part,state,unit}) => <button key={unit?.id??part.id} data-part-id={part.id} data-unit-id={unit?.id} data-part-state={unit?.role==="spare"?"spare":state} className={selectedId === part.id&&unit?.role!=="spare" ? "inventory-item selected-row" : "inventory-item"} onClick={() => unit?.role==="spare"?onEdit():onSelect(part.id)}>
      <div className="inventory-thumb"><ProductVisual id={part.id}/></div>
      <div><small>{part.brand} / {part.model_number ?? "Producto"}</small><strong>{partName(part.id)}</strong>{unit&&<b className="inventory-unit-label">{unit.label}</b>}<span>{part.category === "software" ? "Aplicación" : part.verified_weight_g.value === null ? "Peso pendiente" : `${part.verified_weight_g.approximate ? "~" : ""}${formatNumber(part.verified_weight_g.value)} g · referencia por unidad`}</span>{unit?.role==="spare"?<small>Sin montaje ni cables · toca para gestionar</small>:state === "active" && !layoutData.nodes.some(node => node.id === part.id) && <small>Sin modelo 3D de montaje</small>}</div>
      <span className={`status ${unit?.role==="spare"?"unchosen":state === "active" ? "active" : state === "pending" ? "parked" : "unchosen"}`}>{unit?.role==="spare"?"REPUESTO":state === "active" ? "EN PLAN" : state === "pending" ? "PENDIENTE" : "NO ELEGIDO"}</span>
    </button>)}</div>
    {!entries.length && <div className="empty-state"><Icon name={query ? "search" : "inventory"}/><h3>{query ? "No hay coincidencias aquí" : "Aún no has elegido piezas"}</h3><p>{query ? "La búsqueda respeta el ámbito seleccionado." : "Añade productos para construir tu propio equipo."}</p><button className="quiet-button" onClick={() => query ? setQuery("") : onEdit()}>{query ? "Borrar búsqueda" : "Elegir piezas"}</button></div>}
    <p className="table-caption">Selecciona una pieza para consultar su ficha y fuentes. Las etiquetas no certifican el montaje físico.</p>
  </div>;
}
