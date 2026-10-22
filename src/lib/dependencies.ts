import type {Cable, CustomRig, PlannerRules, Variant} from "./types";
import {conditionMatches, dependencyClosure, mountDependencies, resolveRig, setRigParts} from "./planner";

export interface DependencyPolicy {
  check_subjects:Record<string,string[]>;
  check_suggestions:Record<string,string[]>;
  check_titles:Record<string,string>;
  bundle_reminders:string[];
  context_labels:Record<CustomRig["context"],string>;
}
export interface DependencyChoice {
  id:string; label:string; add_ids:string[]; ready:boolean; reason:string;
  context?:CustomRig["context"]; orientation?:CustomRig["orientation"];
}
export interface DependencyNeed {
  id:string; title:string; subject_ids:string[]; message:string;
  missing_ids:string[]; blocked_ids:string[]; alternative_ids?:string[]; choices:DependencyChoice[];
}
export interface DependencyReport {needs:DependencyNeed[];bundles:string[]}

export function dependencyReport(rig:CustomRig,rules:PlannerRules,cables:Cable[],master:Variant,policy:DependencyPolicy,nameOf:(id:string)=>string=id=>id):DependencyReport {
  const selected=new Set(rig.part_ids),resolution=resolveRig(rig,rules,cables,master,nameOf),active=new Set(resolution.variant.active_part_ids);
  const needs:DependencyNeed[]=[];
  const addition=(id:string,seeds:string[],label:string,allowCamera=false,subjectId?:string):DependencyChoice=>{
    const intended={...rig,part_ids:[...new Set([...rig.part_ids,...seeds])]},closure=dependencyClosure(seeds,rules,intended),add_ids=closure.filter(id=>!selected.has(id));
    const proposal={...rig,part_ids:[...rig.part_ids,...add_ids]},after=resolveRig(proposal,rules,cables,master,nameOf);
    const implicitCamera=!allowCamera&&add_ids.some(id=>rules.camera_part_ids.includes(id));
    const valid=(!subjectId||after.variant.active_part_ids.includes(subjectId))&&closure.every(id=>after.variant.active_part_ids.includes(id))&&resolution.variant.active_part_ids.every(id=>after.variant.active_part_ids.includes(id));
    const reason=implicitCamera?"Elige primero el cuerpo de cámara; no se añade uno implícito.":!add_ids.length?"Estas piezas ya están elegidas. Resuelve su soporte o conflicto, sin duplicarlas.":!valid?after.issues.find(issue=>issue.part_id&&closure.includes(issue.part_id))?.message??"Esta propuesta no tiene una cadena activa completa en tu configuración.":"Propuesta de planificación; comprobar montaje y conexiones reales.";
    return {id,label,add_ids,ready:!implicitCamera&&add_ids.length>0&&valid,reason};
  };
  for(const id of resolution.parked_ids){
    const missing=dependencyClosure(mountDependencies(id,rules,rig),rules,rig).filter(needed=>!selected.has(needed));
    const blocked=mountDependencies(id,rules,rig).filter(needed=>selected.has(needed)&&!active.has(needed));
    const issue=resolution.issues.find(issue=>issue.part_id===id);
    const choices=missing.length?[addition(`mount:${id}`,mountDependencies(id,rules,rig),"Completar cadena de soporte",false,id)]:[];
    for(const constraint of rules.part_context_constraints??[]){
      if(!constraint.part_ids.includes(id)||(constraint.contexts.includes(rig.context)&&constraint.orientations.includes(rig.orientation)))continue;
      for(const context of constraint.contexts)for(const orientation of constraint.orientations){
        if(context===rig.context&&orientation===rig.orientation)continue;
        choices.push({id:`context:${id}:${context}:${orientation}`,label:`Cambiar a ${policy.context_labels[context]} · ${orientation==="landscape"?"horizontal":"vertical"}`,add_ids:[],ready:true,reason:"Conserva todas tus elecciones. Las que no correspondan seguirán pendientes; no se cambian ni se añaden piezas.",context,orientation});
      }
    }
    needs.push({id:`part:${id}`,title:nameOf(id),subject_ids:[id],message:issue?.message??"Pieza elegida pendiente de montaje.",missing_ids:missing,blocked_ids:blocked,choices});
  }
  // Las necesidades siguen visibles aunque el soporte de su pieza todavía esté pendiente.
  for(const check of rules.selection_checks){
    if(check.review_kind==="physical"||!conditionMatches(check.condition,selected,rig))continue;
    const all=check.required_all??[],any=check.required_any??[];
    const unresolvedAll=all.filter(id=>!active.has(id)),unresolvedAny=any.length&&!any.some(id=>active.has(id));
    if((all.length||any.length)&&!unresolvedAll.length&&!unresolvedAny)continue;
    const subjects=policy.check_subjects[check.id]??[...new Set([...(check.condition.all??[]),...(check.condition.any??[]).filter(id=>selected.has(id))])];
    const missing_ids=unresolvedAll.filter(id=>!selected.has(id));
    const blocked_ids=[...new Set([...unresolvedAll,...(unresolvedAny?any:[])])].filter(id=>selected.has(id));
    const choices:DependencyChoice[]=[];
    if(unresolvedAll.length)choices.push(addition(`check:${check.id}:all`,unresolvedAll,"Elegir piezas faltantes"));
    if(unresolvedAny)for(const candidate of any)choices.push(addition(`check:${check.id}:${candidate}`,[candidate],`Elegir ${nameOf(candidate)}`,rules.camera_part_ids.includes(candidate)));
    if(!all.length&&!any.length)for(const candidate of policy.check_suggestions[check.id]??[])choices.push(addition(`check:${check.id}:${candidate}`,[candidate],`Elegir ${nameOf(candidate)}`));
    needs.push({id:`check:${check.id}`,title:policy.check_titles[check.id]??"Revisar selección",subject_ids:subjects,message:check.message,missing_ids,blocked_ids,...(unresolvedAny?{alternative_ids:[...any]}:{}),choices});
  }
  const cameraIds=rules.camera_part_ids.filter(id=>selected.has(id));
  for(const source of rig.part_ids){
    const circuits=cables.filter(c=>c.status==="candidate"&&c.source_part_id===source&&!([c.from_part_id,c.to_part_id].some(id=>id&&rules.camera_part_ids.includes(id)&&cameraIds.length&&!cameraIds.includes(id))));
    if(!circuits.length||resolution.variant.cable_profile_ids.some(id=>circuits.some(c=>c.cable_id===id)))continue;
    const endpoints=[...new Set(circuits.flatMap(c=>[c.from_part_id,c.to_part_id]).filter((id):id is string=>id!==null&&id!==source))];
    const missing_ids=circuits.length===1?endpoints.filter(id=>!selected.has(id)):[],blocked_ids=endpoints.filter(id=>selected.has(id)&&!active.has(id));
    needs.push({id:`circuit:${source}`,title:`Enlace de ${nameOf(source)}`,subject_ids:[source],message:`No hay un circuito activo para esta pieza. ${circuits.length>1?"Hay rutas alternativas según cuerpo y asa; no necesitas todas a la vez. ":""}Revisa extremos, soporte y contexto; un cable elegido no demuestra señal o alimentación reales.`,missing_ids,blocked_ids,choices:[]});
  }
  return {needs,bundles:policy.bundle_reminders.filter(id=>selected.has(id))};
}

export function applyDependencyChoice(rig:CustomRig,choiceId:string,rules:PlannerRules,cables:Cable[],master:Variant,policy:DependencyPolicy):CustomRig|null {
  const choice=dependencyReport(rig,rules,cables,master,policy).needs.flatMap(need=>need.choices).find(choice=>choice.id===choiceId&&choice.ready);
  if(!choice)return null;
  return {...setRigParts(rig,[...rig.part_ids,...choice.add_ids]),...(choice.context?{context:choice.context}:{}),...(choice.orientation?{orientation:choice.orientation}:{})};
}

export function needsForPart(report:DependencyReport,partId:string):DependencyNeed[] {
  return report.needs.filter(need=>need.subject_ids.includes(partId));
}
