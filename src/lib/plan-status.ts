import type {CustomRig, LayoutManifest, RuleCondition, Variant} from "./types";
import type {RigIssue} from "./planner";

export function planIssueGroups(issues:RigIssue[]) {
  return {selection:issues.filter(issue=>issue.review_kind!=="physical"),physical:issues.filter(issue=>issue.review_kind==="physical")};
}

function applies(condition:RuleCondition,selected:Set<string>,context:CustomRig["context"],orientation:CustomRig["orientation"]) {
  return (condition.all??[]).every(id=>selected.has(id))&&(!condition.any?.length||condition.any.some(id=>selected.has(id)))&&!(condition.none??[]).some(id=>selected.has(id))&&(!condition.context||condition.context===context)&&(!condition.not_context||condition.not_context!==context)&&(!condition.orientation||condition.orientation===orientation);
}

export function applicableClearanceGates(variant:Variant,chosenIds:string[],gates:LayoutManifest["clearance_gates"]) {
  const selected=new Set(chosenIds),context=variant.viewer.rig_context??"handheld",orientation=variant.viewer.mode==="vertical"?"vertical":"landscape";
  // También conserva avisos de piezas elegidas en reserva; no se consideran instaladas.
  return gates.filter(gate=>applies(gate.condition??{},selected,context,orientation));
}
