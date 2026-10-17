import { layoutData, partById } from "../data";
import { rigUnits, selectionPresentation, type RigResolution } from "../lib/planner";
import { partName } from "../lib/ui";
import ProductVisual from "./ProductVisual";
import type { CustomRig, Variant } from "../lib/types";
import Icon from "./Icon";

export default function RigSelection({chosenIds, variant, resolution, selectedId, onSelect, onEdit,rig,onInventory}: {
  chosenIds: string[]; variant: Variant; resolution: RigResolution; selectedId: string; onSelect: (id: string) => void; onEdit: () => void;rig:CustomRig;onInventory:()=>void;
}) {
  const rows = selectionPresentation(chosenIds, variant, layoutData.nodes.map(node => node.id));
  const labels = {visual:"En visor", list:"En tu lista", pending:"Montaje pendiente"};
  const spares=rigUnits(rig).filter(unit=>unit.role==="spare");
  return <section className="rig-selection" aria-label="Piezas elegidas para montar">
    <div className="selection-heading"><div><h2>Para el rig <span>{chosenIds.length}</span></h2><p>Unidades destinadas al montaje. Lo pendiente no se instala de forma ficticia.</p></div><button className="quiet-button" onClick={onEdit}><Icon name="plus"/>Editar piezas</button></div>
    {spares.length>0&&<div className="selection-spares"><p>{spares.length} {spares.length===1?"repuesto guardado fuera del montaje":"repuestos guardados fuera del montaje"}: {spares.map(unit=>`${partName(unit.part_id)} / ${unit.label}`).join("; ")}.</p><button className="quiet-button" onClick={onInventory}>Ver todas las unidades</button></div>}
    <div className="selection-grid">{rows.map(({id,state}) => <button key={id} className={`selection-piece ${selectedId===id?"selected":""} ${state}`} data-plan-part-id={id} data-plan-part-state={state} aria-pressed={selectedId===id} onClick={()=>onSelect(id)}><ProductVisual id={id} caption={false}/><span><strong>{partName(id)}</strong><small>{labels[state]}{state==="list"&&partById[id].category!=="software"?" · sin objeto 3D":""}</small></span><Icon name={state==="pending"?"info":"check"}/></button>)}</div>
    {resolution.parked_ids.length>0&&<p className="selection-pending-note"><Icon name="info"/>{resolution.parked_ids.length} piezas conservadas con montaje pendiente. Toca una para ver su ficha; revisa el soporte en Editar piezas.</p>}
  </section>;
}
