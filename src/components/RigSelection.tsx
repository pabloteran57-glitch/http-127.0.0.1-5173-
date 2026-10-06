import { layoutData, partById } from "../data";
import { selectionPresentation, type RigResolution } from "../lib/planner";
import { partName } from "../lib/ui";
import ProductVisual from "./ProductVisual";
import type { Variant } from "../lib/types";
import Icon from "./Icon";

export default function RigSelection({chosenIds, variant, resolution, selectedId, onSelect, onEdit}: {
  chosenIds: string[]; variant: Variant; resolution: RigResolution; selectedId: string; onSelect: (id: string) => void; onEdit: () => void;
}) {
  const rows = selectionPresentation(chosenIds, variant, layoutData.nodes.map(node => node.id));
  const labels = {visual:"En visor", list:"En tu lista", pending:"Montaje pendiente"};
  return <section className="rig-selection" aria-label="Todas mis piezas elegidas">
    <div className="selection-heading"><div><h2>Tu selección <span>{chosenIds.length}</span></h2><p>Todo lo que elegiste. Lo pendiente no se monta de forma ficticia.</p></div><button className="quiet-button" onClick={onEdit}><Icon name="plus"/>Editar piezas</button></div>
    <div className="selection-grid">{rows.map(({id,state}) => <button key={id} className={`selection-piece ${selectedId===id?"selected":""} ${state}`} data-plan-part-id={id} data-plan-part-state={state} aria-pressed={selectedId===id} onClick={()=>onSelect(id)}><ProductVisual id={id} caption={false}/><span><strong>{partName(id)}</strong><small>{labels[state]}{state==="list"&&partById[id].category!=="software"?" · sin objeto 3D":""}</small></span><Icon name={state==="pending"?"info":"check"}/></button>)}</div>
    {resolution.parked_ids.length>0&&<p className="selection-pending-note"><Icon name="info"/>{resolution.parked_ids.length} piezas conservadas con montaje pendiente. Toca una para ver su ficha; revisa el soporte en Editar piezas.</p>}
  </section>;
}
