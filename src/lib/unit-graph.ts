import { conditionMatches, mountDependencies, mountResourceStates, rigUnits } from "./planner";
import type { Cable, CustomRig, MountResource, PlannerRules, Port, RigUnit, Variant } from "./types";

export interface UnitEndpoint { unit_id:string|null; part_id:string|null; port_id:string }
export interface UnitLink { id:string; cable_id:string; source_unit_id:string; from:UnitEndpoint; to:UnitEndpoint; state:"candidate"|"blocked" }
export interface UnitResource {
  id:string; resource:MountResource; host_unit_id:string; selected_unit_ids:string[]; active_unit_ids:string[];
  state:"unused"|"occupied"|"pending"|"conflict"|"unavailable";
}
export interface UnitGraphIssue { id:string; cable_ids:string[]; message:string }
export interface UnitGraph {
  units:(RigUnit&{state:"candidate"|"pending"|"spare"})[];
  resources:UnitResource[];
  dependencies:{unit_id:string; support_unit_id:string; resource_instance_id:string|null}[];
  links:UnitLink[];
  issues:UnitGraphIssue[];
}

export function plannedUnit(rig:CustomRig,partId:string):RigUnit|undefined {
  const matches=rigUnits(rig).filter(unit=>unit.part_id===partId&&unit.role==="rig");
  return matches.length===1?matches[0]:undefined;
}

export function unitIdentities(rig:CustomRig):Record<string,{id:string;label:string}> {
  return Object.fromEntries(rig.part_ids.flatMap(id=>{const unit=plannedUnit(rig,id);return unit?[[id,{id:unit.id,label:unit.label}]]:[];}));
}

// Proyecta las cadenas ya resueltas; no descubre montajes ni crea coordenadas.
export function projectUnitGraph(rig:CustomRig,variant:Variant,rules:PlannerRules,cables:Cable[],ports:Port[]):UnitGraph {
  const units=rigUnits(rig),active=new Set(variant.active_part_ids),issues:UnitGraphIssue[]=[];
  const graph:UnitGraph={units:units.map(unit=>({...unit,state:unit.role==="spare"?"spare":active.has(unit.part_id)?"candidate":"pending"})),resources:[],dependencies:[],links:[],issues};
  const chosen=units.filter(unit=>unit.role==="rig"),byId=new Map(units.map(unit=>[unit.id,unit]));
  const unique=new Set(chosen.map(unit=>unit.part_id));
  if(byId.size!==units.length||unique.size!==chosen.length||chosen.length!==rig.part_ids.length||chosen.some(unit=>!rig.part_ids.includes(unit.part_id))||variant.active_part_ids.some(id=>!rig.part_ids.includes(id))){
    issues.push({id:"unit-identity",cable_ids:[],message:"La identidad de las unidades no coincide con la selección. No se asignan anclajes ni conexiones."});
    graph.units=graph.units.map(unit=>({...unit,state:unit.role==="spare"?"spare":"pending"}));return graph;
  }
  for(const host of chosen){
    for(const state of mountResourceStates(host.part_id,rig,variant,rules)){
      graph.resources.push({id:`${host.id}:${state.id}`,resource:state,host_unit_id:host.id,state:state.state,
        selected_unit_ids:state.selected_ids.flatMap(id=>{const unit=plannedUnit(rig,id);return unit?[unit.id]:[];}),
        active_unit_ids:state.active_ids.flatMap(id=>{const unit=plannedUnit(rig,id);return unit?[unit.id]:[];})});
    }
  }
  for(const unit of chosen.filter(unit=>active.has(unit.part_id))){
    for(const dependency of mountDependencies(unit.part_id,rules,rig)){
      const support=plannedUnit(rig,dependency);if(!support||!active.has(dependency))continue;
      const resources=graph.resources.filter(resource=>resource.host_unit_id===support.id&&resource.active_unit_ids.includes(unit.id));
      graph.dependencies.push({unit_id:unit.id,support_unit_id:support.id,resource_instance_id:resources.length===1?resources[0].id:null});
    }
  }
  const portById=new Map(ports.map(port=>[port.id,port]));
  const endpoint=(partId:string|null,portId:string):UnitEndpoint|undefined=>{
    const port=portById.get(portId);if(!port||port.part_id!==partId)return;
    if(partId===null)return {unit_id:null,part_id:null,port_id:portId};
    const unit=plannedUnit(rig,partId);return unit&&active.has(partId)?{unit_id:unit.id,part_id:partId,port_id:portId}:undefined;
  };
  for(const id of variant.cable_profile_ids){
    const cable=cables.find(cable=>cable.cable_id===id),source=cable&&plannedUnit(rig,cable.source_part_id);
    const from=cable&&endpoint(cable.from_part_id,cable.from_port_id),to=cable&&endpoint(cable.to_part_id,cable.to_port_id);
    if(!cable||cable.status!=="candidate"||!source||!active.has(source.part_id)||!from||!to){
      issues.push({id:`unit-circuit:${id}`,cable_ids:[id],message:"Circuito sin unidad activa, puerto del modelo correcto o alcance candidato. No se asigna a un repuesto."});continue;
    }
    graph.links.push({id:JSON.stringify([rig.id,id,source.id,from.unit_id,to.unit_id]),cable_id:id,source_unit_id:source.id,from,to,state:"candidate"});
  }
  const occupied=new Map<string,Set<string>>();
  for(const link of graph.links)for(const end of [link.from,link.to]){
    if(end.unit_id===null)continue;
    const key=JSON.stringify([end.unit_id,end.port_id]),ids=occupied.get(key)??new Set<string>();ids.add(link.cable_id);occupied.set(key,ids);
  }
  const block=(id:string,cableIds:string[],message:string)=>{
    issues.push({id,cable_ids:cableIds,message});for(const link of graph.links)if(cableIds.includes(link.cable_id))link.state="blocked";
  };
  for(const [key,ids] of occupied)if(ids.size>1)block(`unit-port:${key}`,[...ids],"Dos circuitos reclaman el mismo conector de la misma unidad. Se conservan bloqueados; no se inventa un distribuidor.");
  const carriers=new Map<string,string[]>();
  for(const link of graph.links){
    const cable=cables.find(cable=>cable.cable_id===link.cable_id)!;
    if(cable.display_kind!=="cable"||[cable.from_part_id,cable.to_part_id].includes(cable.source_part_id))continue;
    carriers.set(link.source_unit_id,[...(carriers.get(link.source_unit_id)??[]),link.cable_id]);
  }
  for(const [unitId,ids] of carriers)if(ids.length>1)block(`unit-carrier:${unitId}`,ids,"Una unidad de cable independiente está reclamada por varios circuitos. No se duplica físicamente ni se toma un repuesto automáticamente.");
  return graph;
}

export function assemblyReviewRevision(variant:Variant,chosenIds:string[],rig?:CustomRig):string {
  const identities=rig?rigUnits(rig).filter(unit=>unit.role==="rig").map(unit=>[unit.part_id,unit.id]).sort((a,b)=>a[0].localeCompare(b[0])):[];
  return JSON.stringify([variant.id,[...chosenIds].sort(),[...variant.active_part_ids].sort(),[...variant.cable_profile_ids].sort(),variant.viewer.mode,variant.viewer.rig_context,variant.viewer.monitor_mount_route??"template",variant.viewer.adjustments??null,identities]);
}

export function resourceCapacity(resource:MountResource,rig:CustomRig,rules:PlannerRules):number|null {
  const group=rules.exclusive_selection_groups?.find(group=>group.id===resource.exclusive_group_id);
  return group&&conditionMatches(group.condition??{},new Set(rig.part_ids),rig)?group.max_active:null;
}
