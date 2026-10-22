import {partById} from "../data";
import type {DependencyReport} from "../lib/dependencies";
import {needsForPart} from "../lib/dependencies";
import {partName} from "../lib/ui";

export function DependencyContent({report,partId,onChoose}:{report:DependencyReport;partId?:string;onChoose?:(id:string)=>void}) {
  const needs=partId?needsForPart(report,partId):report.needs;
  return <div className="dependency-content">{needs.map(need=><article key={need.id} data-dependency-id={need.id}>
    <h4>{need.title}</h4><p>{need.message}</p>
    {need.missing_ids.length>0&&<p className="dependency-missing"><b>Falta elegir:</b> {need.missing_ids.map(partName).join(", ")}.</p>}
    {!!need.alternative_ids?.length&&<p><b>Elige una alternativa:</b> {need.alternative_ids.map(partName).join(" / ")}.</p>}
    {need.blocked_ids.length>0&&<p><b>Ya elegido, pero pendiente:</b> {need.blocked_ids.map(partName).join(", ")}. No necesitas duplicarlo.</p>}
    {need.choices.map(choice=><div className="dependency-choice" key={choice.id}>
      {choice.add_ids.length>0&&<p><b>Esta propuesta añade:</b> {choice.add_ids.map(partName).join(", ")}.</p>}
      {choice.context&&<p>{choice.reason}</p>}
      {choice.ready&&onChoose?<button type="button" className="quiet-button" onClick={()=>onChoose(choice.id)}>{choice.label}{choice.add_ids.length>0?` (${choice.add_ids.length})`:""}</button>:<p className="dependency-unavailable">{!choice.context&&choice.reason}</p>}
    </div>)}
  </article>)}</div>;
}

export function BundleReminder({partId}:{partId:string}) {
  const part=partById[partId];
  return part?.bundle_includes?.length?<details className="bundle-reminder"><summary>Ya incluido en {partName(partId)}</summary><ul>{part.bundle_includes.map(item=><li key={item}>{item}</li>)}</ul><p>No se añade otra unidad, placa o tornillo por esta lista. Verifica el contenido de tu ejemplar.</p></details>:null;
}

export default function DependencyNeeds({report,partId,onChoose}:{report:DependencyReport;partId:string;onChoose?:(id:string)=>void}) {
  const needs=needsForPart(report,partId);
  return <>{report.bundles.includes(partId)&&<BundleReminder partId={partId}/>}{needs.length>0&&<details className="piece-dependencies"><summary>Qué falta para esta pieza <span>{needs.length}</span></summary><DependencyContent report={report} partId={partId} onChoose={onChoose}/></details>}</>;
}
