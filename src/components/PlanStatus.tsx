import type {RigIssue} from "../lib/planner";
import {planIssueGroups} from "../lib/plan-status";
import Icon from "./Icon";

export default function PlanStatus({issues,onEdit}:{issues:RigIssue[];onEdit:()=>void}) {
  const {selection,physical}=planIssueGroups(issues);
  return <details className={`plan-pending ${selection.length?"has-selection-pending":"selection-resolved"}`}>
    <summary><Icon name="info"/>{selection.length?`${selection.length} ${selection.length===1?"pendiente de selección":"pendientes de selección"}`:"Selección sin faltantes detectados"}<span>{physical.length?`${physical.length} ${physical.length===1?"comprobación física":"comprobaciones físicas"}`:'Ver revisión'}</span></summary>
    {selection.length>0&&<section><h3>Resolver en tu plan</h3><ul>{selection.map(issue=><li key={issue.id}>{issue.message}</li>)}</ul><button type="button" className="quiet-button" onClick={onEdit}>Revisar mis piezas</button></section>}
    {physical.length>0&&<section><h3>Comprobar con el equipo real</h3><ul>{physical.map(issue=><li key={issue.id}>{issue.message}</li>)}</ul></section>}
    <p>La revisión del plan no certifica montaje, alimentación, equilibrio ni seguridad. Puedes guardar un borrador incompleto.</p>
  </details>;
}
