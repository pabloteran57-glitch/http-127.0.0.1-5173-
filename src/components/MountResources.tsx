import {plannerData,sourcesData} from "../data";
import {mountResourceStates} from "../lib/planner";
import type {CustomRig,Variant} from "../lib/types";
import {partName} from "../lib/ui";
import "../styles/mount-resources.css";
import type {UnitGraph} from "../lib/unit-graph";

const labels={unused:"Sin uso en el plan",occupied:"Ocupado en el plan",pending:"Montaje pendiente",conflict:"Anclaje en conflicto",unavailable:"No disponible en este montaje"};
export default function MountResources({anchorId,rig,variant,onReview,unitGraph}:{anchorId:string;rig:CustomRig;variant:Variant;onReview?:()=>void;unitGraph?:UnitGraph}) {
  const rows=mountResourceStates(anchorId,rig,variant,plannerData);
  if(!rows.length)return null;
  const needsReview=rows.some(row=>row.state==="conflict"||row.state==="pending");
  return <details className="mount-resources"><summary>Anclajes de esta pieza <span>{needsReview?"Revisar":rows.length}</span></summary>
    <p className="mount-resource-disclaimer">Estado de tus elecciones, no prueba de asiento ni de espacio libre físico.</p>
    <ul>{rows.map(row=>{const instance=unitGraph?.resources.find(item=>item.resource.id===row.id),host=unitGraph?.units.find(unit=>unit.id===instance?.host_unit_id);return <li key={instance?.id??row.id} data-mount-resource={row.id} data-resource-instance={instance?.id} data-resource-state={row.state}>
      <div className="mount-resource-heading"><strong>{row.label}</strong><span className={`resource-state state-${row.state}`}>{labels[row.state]}</span></div>
      {host&&<p className="resource-unit-host">En {partName(host.part_id)} / {host.label}</p>}
      <p>{row.selected_ids.length?row.selected_ids.map(id=>{const unit=unitGraph?.units.find(unit=>unit.part_id===id&&unit.role==="rig");return `${partName(id)}${unit?` / ${unit.label}`:""}`;}).join(" · "):"Sin accesorio asignado por la cadena actual."}</p>
      <details><summary>Interfaz y evidencia</summary><p>{row.interface}. {row.note}</p>{row.source_ids.map(id=>{const source=sourcesData.sources.find(s=>s.id===id);return source?<a key={id} href={source.url} target="_blank" rel="noreferrer">{source.brand}: fuente oficial</a>:null;})}</details>
    </li>;})}</ul>
    {needsReview&&onReview&&<button type="button" className="quiet-button" onClick={onReview}>Revisar selección</button>}
  </details>;
}
