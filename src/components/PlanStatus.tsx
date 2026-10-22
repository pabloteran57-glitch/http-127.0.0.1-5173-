import type {RigIssue} from "../lib/planner";
import {planIssueGroups} from "../lib/plan-status";
import Icon from "./Icon";
import type {DependencyReport} from "../lib/dependencies";
import {DependencyContent} from "./DependencyNeeds";

export default function PlanStatus({issues,onEdit,report,onChoose}:{issues:RigIssue[];onEdit:()=>void;report?:DependencyReport;onChoose?:(id:string)=>void}) {
  const {selection,physical}=planIssueGroups(issues);
  const count=report?report.needs.length:selection.length;
  return <details className={`plan-pending ${count?"has-selection-pending":"selection-resolved"}`}>
    <summary><Icon name="info"/>{count?`${count} ${count===1?"pendiente de selección":"pendientes de selección"}`:"Selección sin faltantes detectados"}<span>{physical.length?`${physical.length} ${physical.length===1?"comprobación física":"comprobaciones físicas"}`:'Ver revisión'}</span></summary>
    {count>0&&<section><h3>Resolver en tu plan</h3>{report?<DependencyContent report={report} onChoose={onChoose}/>:<ul>{selection.map(issue=><li key={issue.id}>{issue.message}</li>)}</ul>}<button type="button" className="quiet-button" onClick={onEdit}>Revisar mis piezas</button></section>}
    {physical.length>0&&<section><h3>Comprobar con el equipo real</h3><ul>{physical.map(issue=><li key={issue.id}>{issue.message}</li>)}</ul></section>}
    <p>La revisión del plan no certifica montaje, alimentación, equilibrio ni seguridad. Puedes guardar un borrador incompleto.</p>
  </details>;
}
