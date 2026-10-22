import type {Cable, CustomRig, PlannerRules, Variant} from "./types";
import {applyAttachment, resolveRig, rigUnits, setRigParts, UNIT_LIMIT, UNITS_PER_PART_LIMIT, withRigUnits} from "./planner";

export interface TripodProfile {
  part_id:string;
  context:CustomRig["context"];
  orientation:CustomRig["orientation"];
  required_part_ids:string[];
  optional_part_ids:string[];
}

export function tripodPlan(rig:CustomRig,profile:TripodProfile,rules:PlannerRules,cables:Cable[],master:Variant) {
  const allowed=new Set([...profile.required_part_ids,...profile.optional_part_ids]);
  const outside_ids=rig.part_ids.filter(id=>!allowed.has(id));
  const missing_ids=profile.required_part_ids.filter(id=>!rig.part_ids.includes(id));
  const needs_context=rig.context!==profile.context||rig.orientation!==profile.orientation;
  const current=resolveRig(rig,rules,cables,master,id=>id);
  const candidate=setRigParts(rig,[...rig.part_ids,...missing_ids]);
  const resolved=resolveRig(candidate,rules,cables,master,id=>id);
  const units=rigUnits(candidate);
  const capacity=units.length<=UNIT_LIMIT&&missing_ids.every(id=>units.filter(unit=>unit.part_id===id).length<=UNITS_PER_PART_LIMIT);
  const can_complete=!needs_context&&!outside_ids.length&&!!missing_ids.length&&capacity
    &&profile.required_part_ids.every(id=>resolved.variant.active_part_ids.includes(id))
    &&current.variant.active_part_ids.every(id=>resolved.variant.active_part_ids.includes(id));
  return {
    needs_context,outside_ids,missing_ids,can_complete,capacity,
    core_ready:!needs_context&&profile.required_part_ids.every(id=>current.variant.active_part_ids.includes(id)),
    support_ready:!needs_context&&current.variant.active_part_ids.includes(profile.part_id),
    pending_ids:current.parked_ids,
  };
}

export function addTripodSupport(rig:CustomRig,profile:TripodProfile,rules:PlannerRules,cables:Cable[],master:Variant):CustomRig|null {
  const plan=tripodPlan(rig,profile,rules,cables,master);
  if(plan.needs_context||plan.outside_ids.length||rig.part_ids.includes(profile.part_id))return null;
  const options=(rules.attachment_options??[]).filter(option=>option.add_part_ids.includes(profile.part_id));
  if(options.length!==1)return null;
  const option=options[0],next=applyAttachment(option.id,option.anchor_part_id,rig,rules,cables,master);
  if(!next||next.part_ids.filter(id=>!rig.part_ids.includes(id)).some(id=>id!==profile.part_id))return null;
  const clean=setRigParts(rig,next.part_ids);
  return rigUnits(clean).length<=UNIT_LIMIT&&rigUnits(clean).filter(unit=>unit.part_id===profile.part_id).length<=UNITS_PER_PART_LIMIT?clean:null;
}

export function completeTripodCore(rig:CustomRig,profile:TripodProfile,rules:PlannerRules,cables:Cable[],master:Variant):CustomRig|null {
  const plan=tripodPlan(rig,profile,rules,cables,master);
  return plan.can_complete?setRigParts(rig,[...rig.part_ids,...plan.missing_ids]):null;
}

// La lista confirmada debe seguir siendo exacta; nunca retirar ni promover unidades por inferencia.
export function parkTripodExtras(rig:CustomRig,profile:TripodProfile,confirmedIds:string[]):CustomRig|null {
  const allowed=new Set([...profile.required_part_ids,...profile.optional_part_ids]);
  const outside=rig.part_ids.filter(id=>!allowed.has(id));
  if(!outside.length||outside.length!==confirmedIds.length||new Set(confirmedIds).size!==confirmedIds.length||outside.some(id=>!confirmedIds.includes(id)))return null;
  const ids=new Set(outside),next=withRigUnits(rig);
  return {...next,part_ids:next.part_ids.filter(id=>!ids.has(id)),units:next.units!.map(unit=>unit.role==="rig"&&ids.has(unit.part_id)?{...unit,role:"spare" as const}:unit)};
}
