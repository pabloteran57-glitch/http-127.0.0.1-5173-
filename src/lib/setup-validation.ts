import type {AssemblyProfileContent, Cable, CustomRig, LayoutManifest, PlannerRules, Port, Variant} from "./types";
import type {DependencyReport} from "./dependencies";
import type {ConnectionAssessment} from "./connections";
import {assemblyFrame, mountChainProblem, mountDependencies} from "./planner";
import {assemblyTimeline} from "./assembly";
import {projectUnitGraph} from "./unit-graph";
import {layoutForVariant, nodePose} from "./viewer";

export interface SetupCheck {id:string;state:"coherent"|"attention"|"pending";details:string[]}
export interface SetupValidation {checks:SetupCheck[];attention:number;pending:number;physical_status:"pending"}

export function validateSetup(rig:CustomRig,variant:Variant,dependencies:DependencyReport,rules:PlannerRules,cables:Cable[],ports:Port[],layout:LayoutManifest,content:AssemblyProfileContent,assessments:Record<string,ConnectionAssessment>):SetupValidation {
  const active=new Set(variant.active_part_ids),checks:SetupCheck[]=[];
  checks.push({id:"selection",state:dependencies.needs.length?"attention":"coherent",details:dependencies.needs.map(need=>need.title)});
  const mountErrors=variant.active_part_ids.flatMap(id=>{
    const missing=mountDependencies(id,rules,rig).filter(parent=>!active.has(parent)),problem=mountChainProblem(id,rules,rig);
    return [...(missing.length?[`Soporte incompleto: ${id}.`]:[]),...(problem?[`${id}: ${problem}`]:[])];
  });
  checks.push({id:"mounts",state:mountErrors.length?"attention":"coherent",details:mountErrors});
  const graph=projectUnitGraph(rig,variant,rules,cables,ports);
  checks.push({id:"ports",state:graph.issues.length?"attention":"coherent",details:graph.issues.map(issue=>issue.message)});
  const invalidReviews=variant.cable_profile_ids.filter(id=>!assessments[id]?.reviewed||assessments[id].state==="blocked");
  const pendingReviews=variant.cable_profile_ids.filter(id=>assessments[id]?.state==="pending");
  checks.push({id:"reviews",state:invalidReviews.length?"attention":pendingReviews.length?"pending":"coherent",details:[...invalidReviews.map(id=>`Circuito sin revisión vigente o bloqueado: ${id}.`),...(pendingReviews.length?[`${pendingReviews.length} enlaces requieren comprobación operativa con el equipo real.`]:[])]});
  const timeline=assemblyTimeline(variant,rules,cables,content),assemblyErrors:string[]=[];
  for(const step of timeline){
    const frame=assemblyFrame(variant,step.number,rules,cables).variant;
    if(frame.active_part_ids.some(id=>!active.has(id))||step.part_ids.some(id=>!active.has(id)))assemblyErrors.push(`Etapa ${step.number}: pieza ajena al plan.`);
    for(const id of frame.cable_profile_ids){const c=cables.find(c=>c.cable_id===id);if(!c||[c.from_part_id,c.to_part_id,c.source_part_id].some(id=>id!==null&&!frame.active_part_ids.includes(id)))assemblyErrors.push(`Etapa ${step.number}: enlace sin extremo o referencia elegida.`);}
  }
  const nodes=layoutForVariant(variant,layout).nodes.filter(node=>active.has(node.id)),last=timeline.filter(step=>step.playable).at(-1);
  const finalFrame=last?assemblyFrame(variant,last.number,rules,cables).variant:undefined;
  const finalIds=finalFrame?.active_part_ids??[];
  if(nodes.length&&!last)assemblyErrors.push("No existe una etapa de montaje para las piezas representadas.");
  for(const node of nodes)if(!finalIds.includes(node.id))assemblyErrors.push(`Pieza sin etapa final: ${node.id}.`);
  for(const id of variant.cable_profile_ids)if(!finalFrame?.cable_profile_ids.includes(id))assemblyErrors.push(`Circuito sin etapa final completa: ${id}.`);
  checks.push({id:"assembly",state:assemblyErrors.length?"attention":"coherent",details:assemblyErrors});
  const geometryErrors=nodes.flatMap(node=>{
    const poses=[false,true].map(exploded=>nodePose(node,variant.viewer.mode==="vertical",exploded));
    return node.size_xyz_mm.some(value=>!Number.isFinite(value)||value<=0)||poses.some(pose=>[...pose.position_mm,...pose.rotation_deg].some(value=>!Number.isFinite(value)))?[`Envolvente ilustrativa no válida: ${node.id}.`]:[];
  });
  checks.push({id:"geometry",state:geometryErrors.length?"attention":"coherent",details:geometryErrors});
  return {checks,attention:checks.filter(check=>check.state==="attention").length,pending:checks.filter(check=>check.state==="pending").length,physical_status:"pending"};
}
