import type { AttachmentOption, Cable, CompatibilityEvidence, CustomRig, MountResource, PlannerRules, RigAdjustments, RigUnit, RuleCondition, Variant } from "./types";

export interface RigIssue { id: string; part_id?: string; message: string; add_ids: string[]; review_kind?:"selection"|"physical" }
export interface RigResolution { variant: Variant; issues: RigIssue[]; parked_ids: string[] }
export const LIBRARY_KEY = "takegrid.rigs.v3";
export const PREVIOUS_LIBRARY_KEY = "takegrid.rigs.v2";
export const LEGACY_LIBRARY_KEY = "takegrid.rigs.v1";
export type RigLibrary = { version: 1; rigs: CustomRig[]; history?:Record<string,CustomRig[]> };
export const CATALOG_REVISION = "fx3-rs4-2026-10-05";
export const UNIT_LIMIT = 120;
export const UNITS_PER_PART_LIMIT = 20;

export function rigUnits(rig:CustomRig):RigUnit[] {
  return rig.units ?? rig.part_ids.map(part_id=>({id:`unit-${part_id}-1`,part_id,label:"Unidad 1",role:"rig" as const}));
}

export function withRigUnits(rig:CustomRig):CustomRig {
  const units=rigUnits(rig).filter(unit=>unit.role==="spare"||rig.part_ids.includes(unit.part_id));
  for(const part_id of rig.part_ids)if(!units.some(unit=>unit.part_id===part_id&&unit.role==="rig")){
    let index=1;while(units.some(unit=>unit.id===`unit-${part_id}-${index}`))index++;
    units.push({id:`unit-${part_id}-${index}`,part_id,label:`Unidad ${index}`,role:"rig"});
  }
  return {...rig,schema_version:2,units};
}

export function setRigParts(rig:CustomRig,part_ids:string[]):CustomRig {
  return withRigUnits({...rig,part_ids:[...part_ids]});
}

export function addSpareUnit(rig:CustomRig,partId:string):CustomRig {
  const next=withRigUnits(rig),units=next.units!;
  if(!units.some(unit=>unit.part_id===partId))throw new Error("Elige primero este producto para añadir un repuesto.");
  if(units.length>=UNIT_LIMIT||units.filter(unit=>unit.part_id===partId).length>=UNITS_PER_PART_LIMIT)throw new Error(`Límite de planificación: ${UNIT_LIMIT} unidades por proyecto y ${UNITS_PER_PART_LIMIT} por producto.`);
  let ordinal=1;while(units.some(unit=>unit.part_id===partId&&unit.label===`Unidad ${ordinal}`))ordinal++;
  return {...next,units:[...units,{id:`unit-${crypto.randomUUID()}`,part_id:partId,label:`Unidad ${ordinal}`,role:"spare"}]};
}

export function updateRigUnit(rig:CustomRig,unitId:string,change:{label?:string;role?:RigUnit["role"]}):CustomRig {
  const next=withRigUnits(rig),target=next.units!.find(unit=>unit.id===unitId);
  if(!target)throw new Error("Unidad no disponible en este proyecto.");
  if(change.label!==undefined&&(!change.label.trim()||change.label.length>40))throw new Error("Escribe una etiqueta de 1 a 40 caracteres.");
  const units=next.units!.map(unit=>unit.id===unitId?{...unit,...change}:change.role==="rig"&&unit.part_id===target.part_id?{...unit,role:"spare" as const}:unit);
  const inRig=new Set(units.filter(unit=>unit.role==="rig").map(unit=>unit.part_id));
  const part_ids=[...next.part_ids.filter(id=>inRig.has(id)),...inRig].filter((id,index,ids)=>ids.indexOf(id)===index);
  return {...next,units,part_ids};
}

export function removeRigUnit(rig:CustomRig,unitId:string):CustomRig {
  const next=withRigUnits(rig),units=next.units!.filter(unit=>unit.id!==unitId);
  return {...next,units,part_ids:next.part_ids.filter(id=>units.some(unit=>unit.part_id===id&&unit.role==="rig"))};
}

export function unitSummary(rig:CustomRig):string {
  const units=rigUnits(rig),spares=units.filter(unit=>unit.role==="spare").length;
  return `${units.length} ${units.length===1?"unidad":"unidades"}${spares?` · ${spares} ${spares===1?"repuesto":"repuestos"}`:""}`;
}
export function libraryFingerprint(raw:string|null):string {
  if(raw===null)return "none";
  let hash=2166136261;for(let i=0;i<raw.length;i++)hash=Math.imul(hash^raw.charCodeAt(i),16777619);
  return `${raw.length}:${hash>>>0}`;
}

export function conditionMatches(condition:RuleCondition,active:Set<string>,rig:Pick<CustomRig,"context"|"orientation">):boolean {
  return (condition.all??[]).every(id=>active.has(id)) && (!condition.any?.length||condition.any.some(id=>active.has(id))) && !(condition.none??[]).some(id=>active.has(id)) && (!condition.context||condition.context===rig.context) && (!condition.not_context||condition.not_context!==rig.context) && (!condition.orientation||condition.orientation===rig.orientation);
}

export function compatibilityDecision(evidence:CompatibilityEvidence):"candidate"|"blocked"|"unknown" {
  if(evidence.status==="incompatible")return "blocked";
  if(evidence.status!=="documented_candidate"||!evidence.revision||!evidence.source_urls.length||!evidence.source_urls.every(url=>/^https:\/\//.test(url)))return "unknown";
  return "candidate";
}

export function newRig(name = "Mi nuevo rig", template?: Variant, defaultContext:CustomRig["context"]="handheld"): CustomRig {
  return { schema_version: 1, id: `rig-${crypto.randomUUID()}`, name: name.slice(0,80), context: template?.viewer.rig_context ?? defaultContext, orientation: template?.viewer.mode === "vertical" ? "vertical" : "landscape", part_ids: template ? [...template.active_part_ids] : [], updated_at: new Date().toISOString(),...(template?.viewer.adjustments?{adjustments:structuredClone(template.viewer.adjustments)}:{}) };
}

export function copyRig(rig:CustomRig,name:string):CustomRig {
  const copy={...structuredClone(rig),...newRig(name),schema_version:rig.schema_version,context:rig.context,orientation:rig.orientation,part_ids:[...rig.part_ids]};
  return rig.units?{...copy,units:rig.units.map(unit=>({...unit,id:`unit-${crypto.randomUUID()}`}))}:copy;
}

function parseAdjustments(value:unknown,catalogIds:string[]):RigAdjustments|undefined {
  if(value===undefined)return undefined;
  if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Ajustes del rig no válidos.");
  const raw=value as Record<string,unknown>,result:RigAdjustments={};
  if(Object.keys(raw).some(key=>!["monitor","battery_plate"].includes(key)))throw new Error("Ajuste sin soporte documentado.");
  if(raw.monitor!==undefined){
    const m=raw.monitor as Record<string,unknown>;
    if(!m||typeof m!=="object"||Array.isArray(m)||typeof m.mount_id!=="string"||!catalogIds.includes(m.mount_id)||typeof m.tilt_deg!=="number"||!Number.isFinite(m.tilt_deg)||Math.abs(m.tilt_deg)>180||typeof m.swivel_deg!=="number"||!Number.isFinite(m.swivel_deg)||Math.abs(m.swivel_deg)>360)throw new Error("Orientación de monitor no válida.");
    result.monitor={mount_id:m.mount_id,tilt_deg:m.tilt_deg,swivel_deg:m.swivel_deg};
  }
  if(raw.battery_plate!==undefined){
    const b=raw.battery_plate as Record<string,unknown>;
    if(!b||typeof b!=="object"||Array.isArray(b)||[b.offset_mm,b.measured_back_mm,b.measured_forward_mm].some(v=>typeof v!=="number"||!Number.isFinite(v)||Math.abs(v)>1000)||Number(b.measured_back_mm)<0||Number(b.measured_forward_mm)<0||Number(b.offset_mm)<-Number(b.measured_back_mm)||Number(b.offset_mm)>Number(b.measured_forward_mm))throw new Error("Recorrido medido de placa no válido.");
    result.battery_plate={offset_mm:Number(b.offset_mm),measured_back_mm:Number(b.measured_back_mm),measured_forward_mm:Number(b.measured_forward_mm)};
  }
  return result;
}

export interface AttachmentCandidate { option:AttachmentOption; add_ids:string[] }
export interface AttachmentDiagnostic extends AttachmentCandidate {state:"ready"|"selected"|"blocked";reason:string}
export interface MountResourceState extends MountResource {state:"unused"|"occupied"|"pending"|"conflict"|"unavailable";selected_ids:string[];active_ids:string[]}

export function visibleAttachmentDiagnostics(items:AttachmentDiagnostic[]):AttachmentDiagnostic[] {
  const key=(item:AttachmentDiagnostic)=>JSON.stringify([...item.option.add_part_ids].sort());
  const selected=new Set(items.filter(item=>item.state==="selected").map(key));
  return items.filter(item=>item.state!=="blocked"||!selected.has(key(item)));
}

export function mountResourceStates(anchorId:string,rig:CustomRig,variant:Variant,rules:PlannerRules):MountResourceState[] {
  if(!rig.part_ids.includes(anchorId))return [];
  const chosen=new Set(rig.part_ids),active=new Set(variant.active_part_ids);
  return (rules.mount_resources??[]).filter(resource=>resource.host_part_id===anchorId).map(resource=>{
    const selected_ids=resource.candidate_part_ids.filter(id=>chosen.has(id)&&mountDependencies(id,rules,rig).includes(anchorId));
    const active_ids=selected_ids.filter(id=>active.has(id));
    const group=rules.exclusive_selection_groups?.find(group=>group.id===resource.exclusive_group_id);
    const conflict=group&&conditionMatches(group.condition??{},chosen,rig)&&selected_ids.filter(id=>group.part_ids.includes(id)).length>group.max_active;
    const state:MountResourceState["state"]=!active.has(anchorId)||!conditionMatches(resource.condition,chosen,rig)?"unavailable":conflict?"conflict":selected_ids.some(id=>!active.has(id))?"pending":active_ids.length?"occupied":"unused";
    return {...resource,state,selected_ids,active_ids};
  });
}

function attachmentConditionReason(condition:RuleCondition,rig:CustomRig,nameOf:(id:string)=>string):string {
  const missing=(condition.all??[]).filter(id=>!rig.part_ids.includes(id));
  if(missing.length)return `Requiere elegir: ${missing.map(nameOf).join(", ")}.`;
  if(condition.any?.length&&!condition.any.some(id=>rig.part_ids.includes(id)))return `Requiere una de estas piezas: ${condition.any.map(nameOf).join(", ")}.`;
  const excluded=(condition.none??[]).filter(id=>rig.part_ids.includes(id));
  if(excluded.length)return `Esta opción excluye: ${excluded.map(nameOf).join(", ")}. Tus elecciones se conservan.`;
  const contexts={gimbal:"con gimbal",handheld:"a mano",static:"con cámara estática",shoulder:"al hombro"};
  if(condition.context&&condition.context!==rig.context)return `Opción documentada sólo ${contexts[condition.context]}.`;
  if(condition.not_context===rig.context)return `No corresponde al montaje ${contexts[rig.context]}.`;
  if(condition.orientation&&condition.orientation!==rig.orientation)return `Requiere encuadre ${condition.orientation==="landscape"?"horizontal":"vertical"}.`;
  return "Esta cadena no está documentada para la selección actual.";
}

export function attachmentDiagnostics(anchorId:string,rig:CustomRig,rules:PlannerRules,cables:Cable[],master:Variant,nameOf:(id:string)=>string=id=>id):AttachmentDiagnostic[] {
  if(!rig.part_ids.includes(anchorId))return [];
  const current=resolveRig(rig,rules,cables,master,nameOf);
  return (rules.attachment_options??[]).filter(option=>option.anchor_part_id===anchorId).map(option=>{
    const blocked=(reason:string):AttachmentDiagnostic=>({option,add_ids:[],state:"blocked",reason});
    if(!option.source_ids.length)return blocked("La opción no tiene evidencia documental suficiente; no se ofrece un montaje.");
    if(!current.variant.active_part_ids.includes(anchorId))return blocked(current.issues.find(issue=>issue.part_id===anchorId)?.message??"El anclaje elegido no tiene una cadena activa. Revisa primero su soporte.");
    if(!conditionMatches(option.condition,new Set(rig.part_ids),rig))return blocked(attachmentConditionReason(option.condition,rig,nameOf));
    const intended={...rig,part_ids:[...new Set([...rig.part_ids,...option.add_part_ids])]};
    const closure=dependencyClosure(option.add_part_ids,rules,intended),additions=closure.filter(id=>!rig.part_ids.includes(id));
    const proposal={...rig,part_ids:[...rig.part_ids,...additions]},result=resolveRig(proposal,rules,cables,master,nameOf);
    if(![anchorId,...closure].every(id=>result.variant.active_part_ids.includes(id)))return blocked(result.issues.find(issue=>issue.part_id&&[anchorId,...closure].includes(issue.part_id))?.message??"La cadena propuesta deja piezas sin soporte activo. No se añaden automáticamente.");
    return {option,add_ids:additions,state:additions.length?"ready":"selected",reason:additions.length?"Cadena candidata documentada; requiere comprobación física.":"Las piezas de esta opción ya están elegidas y tienen una cadena activa."};
  });
}

export function attachmentCandidates(anchorId:string,rig:CustomRig,rules:PlannerRules,cables:Cable[],master:Variant):AttachmentCandidate[] {
  return attachmentDiagnostics(anchorId,rig,rules,cables,master).filter(item=>item.state==="ready").map(({option,add_ids})=>({option,add_ids}));
}

export function applyAttachment(optionId:string,anchorId:string,rig:CustomRig,rules:PlannerRules,cables:Cable[],master:Variant):CustomRig|null {
  const candidate=attachmentCandidates(anchorId,rig,rules,cables,master).find(item=>item.option.id===optionId);
  return candidate?{...rig,part_ids:[...rig.part_ids,...candidate.add_ids]}:null;
}

export function mountDependencies(id:string, rules:PlannerRules, rig?:CustomRig):string[] {
  const match=rig&&rules.dynamic_mount_dependencies?.find(rule=>rule.part_id===id&&conditionMatches(rule.condition,new Set(rig.part_ids),rig));
  return match ? match.required_all : rules.mount_dependencies[id]??[];
}

export function mountChainProblem(id:string,rules:PlannerRules,rig:CustomRig,seen:string[]=[]):string|null {
  if(seen.includes(id))return "La cadena de soporte contiene un ciclo.";
  if(rules.planning_root_part_ids.includes(id))return null;
  const choices=(rules.dynamic_mount_dependencies??[]).filter(rule=>rule.part_id===id&&conditionMatches(rule.condition,new Set(rig.part_ids),rig));
  if(new Set(choices.map(rule=>JSON.stringify([...rule.required_all].sort()))).size>1)return "Hay cadenas de soporte contradictorias para esta selección.";
  const dependencies=mountDependencies(id,rules,rig);
  if(!dependencies.length)return "La cadena de soporte aún no está documentada.";
  for(const dependency of dependencies){const problem=mountChainProblem(dependency,rules,rig,[...seen,id]);if(problem)return problem;}
  return null;
}

export function dependencyClosure(ids: string[], rules: PlannerRules, rig?:CustomRig): string[] {
  const result = new Set(ids);
  const visit = (id: string) => { for (const needed of mountDependencies(id,rules,rig)) if (!result.has(needed)) { result.add(needed); visit(needed); } };
  ids.forEach(visit);
  return [...result];
}

export function selectionPresentation(chosenIds: string[], variant: Variant, modeledIds: string[]) {
  const active = new Set(variant.active_part_ids), modeled = new Set(modeledIds);
  return chosenIds.map(id => ({id, state: !active.has(id) ? "pending" as const : modeled.has(id) ? "visual" as const : "list" as const}));
}

export function selectionScopeProblem(id:string,rig:CustomRig,rules:PlannerRules):string|null {
  const context = rules.part_context_constraints?.find(rule => rule.part_ids.includes(id) && (!rule.contexts.includes(rig.context) || !rule.orientations.includes(rig.orientation)));
  if(context)return context.message;
  const selected=new Set(rig.part_ids);
  return rules.selection_scopes?.find(scope=>conditionMatches(scope.condition,selected,rig)&&!scope.allowed_part_ids.includes(id))?.message??null;
}

export function selectionConflictProblem(id: string, rig: CustomRig, rules: PlannerRules): string | null {
  const selected = new Set([...rig.part_ids, id]);
  return rules.exclusive_selection_groups?.find(group => group.part_ids.includes(id)
    && conditionMatches(group.condition??{},selected,rig)
    && group.part_ids.filter(part => selected.has(part)).length > group.max_active)?.message ?? null;
}

export function availableSupportIds(ids: string[], rig: CustomRig, rules: PlannerRules): string[] {
  const allowed = (id: string) => !rules.parked_part_ids.includes(id)
    && !selectionScopeProblem(id,rig,rules)
    && !selectionConflictProblem(id,rig,rules)
    && !mountChainProblem(id,rules,rig)
    && !(rig.context !== "gimbal" && rules.gimbal_only_part_ids.includes(id))
    && !(rig.context === "gimbal" && rules.gimbal_excluded_part_ids.includes(id))
    && !(rig.context === "gimbal" && rig.orientation === "vertical" && rules.vertical_excluded_part_ids.includes(id));
  // No ofrecer una cadena a medias si uno de sus soportes no puede activarse en este contexto.
  return [...new Set(ids.filter(id => dependencyClosure([id], rules,rig).every(allowed)).flatMap(id => dependencyClosure([id], rules,rig)))].filter(id => !rig.part_ids.includes(id));
}

export function completionIds(id:string,rig:CustomRig,rules:PlannerRules,activeCableIds:string[]):string[] {
  const completion=rules.completion_rules?.[id];
  if(!completion||!rig.part_ids.includes(id)||selectionConflictProblem(id,rig,rules))return [];
  const power=completion.power_cable_ids.some(cable=>activeCableIds.includes(cable));
  return availableSupportIds([...mountDependencies(id,rules,rig),...completion.required_all,...(power?[]:completion.power_suggest_ids)],rig,rules);
}

export function resolveRig(rig: CustomRig, rules: PlannerRules, cables: Cable[], master: Variant, nameOf: (id: string) => string): RigResolution {
  const selected = new Set(rig.part_ids);
  const active = new Set(rig.part_ids);
  const issues: RigIssue[] = [];
  const exclude = (id: string, message: string, add_ids: string[] = []) => { active.delete(id); issues.push({id: `part-${id}`, part_id: id, message, add_ids}); };
  const routes=(rules.viewer_routes??[]).filter(route=>conditionMatches(route.condition,selected,rig));
  const route=routes.length===1?routes[0].id:undefined;
  for (const id of selected) {
    const scopeProblem=selectionScopeProblem(id,rig,rules);
    if(scopeProblem)exclude(id,`${nameOf(id)}: ${scopeProblem}`);
    else if (rules.parked_part_ids.includes(id)) exclude(id, `${nameOf(id)}: montaje o sistema pendiente. Se conserva en reserva, no se instala en el visor.`);
    else if (rig.context !== "gimbal" && rules.gimbal_only_part_ids.includes(id)) exclude(id, `${nameOf(id)}: la cadena documentada requiere un gimbal. No se inventa soporte a mano o estático.`);
    else if (rig.context === "gimbal" && rules.gimbal_excluded_part_ids.includes(id)) exclude(id, `${nameOf(id)}: reservado para cámara a mano o estática, no gimbal activo.`);
    else if (rig.context === "gimbal" && rig.orientation === "vertical" && rules.vertical_excluded_part_ids.includes(id)) exclude(id, `${nameOf(id)}: fuera de la configuración vertical documentada; pila, soporte y holguras pendientes.`);
    else {const problem=mountChainProblem(id,rules,rig);if(problem)exclude(id,`${nameOf(id)}: ${problem} Se conserva pendiente, sin montaje ficticio.`);}
  }
  for(const group of rules.exclusive_selection_groups??[]){
    if(!conditionMatches(group.condition??{},selected,rig))continue;
    const members=group.part_ids.filter(id=>selected.has(id));
    if(members.length>group.max_active)for(const id of members.filter(id=>active.has(id)))exclude(id,`${nameOf(id)}: ${group.message}`);
  }
  if(!route)for(const id of rules.viewer_route_part_ids??[])if(active.has(id))exclude(id,`${nameOf(id)}: distribución contextual desconocida o ambigua. Se conserva pendiente, sin inventar una posición.`);
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...active]) {
      const missing = mountDependencies(id,rules,rig).filter(p => !active.has(p));
      if (missing.length) { exclude(id, `${nameOf(id)}: falta la cadena de soporte ${missing.map(nameOf).join(", ")}.`, dependencyClosure(missing, rules,rig).filter(p => !selected.has(p))); changed = true; }
    }
  }
  for(const check of rules.selection_checks){
    if(!conditionMatches(check.condition,active,rig))continue;
    const all=check.required_all??[],any=check.required_any??[];
    const missing=all.filter(id=>!active.has(id));
    if(any.length&&!any.some(id=>active.has(id)))missing.push(...(check.suggest_ids??any.slice(0,1)));
    if((all.length||any.length)&&!missing.length)continue;
    issues.push({id:check.id,message:check.message,review_kind:missing.length?"selection":check.review_kind??"selection",add_ids:dependencyClosure(missing,rules,rig).filter(id=>!selected.has(id))});
  }
  const cableIds = cables.filter(c => c.status === "candidate" && active.has(c.source_part_id) && [c.from_part_id,c.to_part_id].every(p => p === null || active.has(p)) && !rules.cable_exclusions.some(rule=>rule.cable_id===c.cable_id&&conditionMatches(rule.condition,active,rig))).map(c => c.cable_id);
  const ids = rig.part_ids.filter(id => active.has(id));
  const parked = rig.part_ids.filter(id => !active.has(id));
  return {issues, parked_ids: parked, variant: {id:rig.id,label:rig.name,active_part_ids:ids,conditional_part_ids:parked,parts_added:ids.filter(id=>!master.active_part_ids.includes(id)),parts_removed:master.active_part_ids.filter(id=>!active.has(id)),cable_profile_ids:cableIds,cables_added:cableIds.filter(id=>!master.cable_profile_ids.includes(id)),cables_removed:master.cable_profile_ids.filter(id=>!cableIds.includes(id)),dependencies:issues.map(i=>i.message),operating_status:"Plan personalizado / comprobación física pendiente",balance_impact:"Pesar el conjunto completo y volver a equilibrar tras cambios. Las masas conocidas no certifican encaje ni par.",workflow_impact:"Configuración elegida por el usuario dentro del catálogo actual. Las piezas pendientes no se dibujan como instaladas.",budget_impact:"Sin precios cotizados. La selección no demuestra disponibilidad ni compras realizadas.",complexity_impact:`${ids.length} elementos activos; ${parked.length} en reserva.`,viewer:{mode:rig.orientation==="vertical"&&rig.context==="gimbal"?"vertical":"assembled",positions:{},rig_context:rig.context,monitor_mount_route:route,...(rig.adjustments?{adjustments:rig.adjustments}:{})}}};
}

export function assemblyFrame(variant: Variant, step: number, rules: PlannerRules, cables: Cable[]) {
  const profile=rules.assembly_profiles?.find(profile=>variant.active_part_ids.includes(profile.camera_part_id)&&(!profile.context||profile.context===variant.viewer.rig_context)&&(profile.require_all??[]).every(id=>variant.active_part_ids.includes(id)));
  const frames=profile?.frames??rules.assembly_frames;
  const frame = frames.find(frame=>frame.step===step);
  if(!frame)throw new Error("Etapa fuera del perfil de montaje seleccionado.");
  const extraction=!profile&&step===rules.extraction_step;
  const introduced = new Set(frames.filter(f=>f.step<=step).flatMap(f=>f.add_part_ids));
  let ids = variant.active_part_ids.filter(id=>introduced.has(id));
  if (extraction) ids = ids.filter(id=>rules.extraction_keep_part_ids.includes(id));
  const contextIds = frame.context_part_ids.filter(id=>variant.active_part_ids.includes(id)&&!ids.includes(id));
  const visible = new Set([...ids,...contextIds]);
  const available = new Set(frames.filter(f=>f.step<=step).flatMap(f=>f.add_cable_ids));
  const cableIds = variant.cable_profile_ids.filter(id=>available.has(id)&&cables.some(c=>c.cable_id===id&&[c.source_part_id,c.from_part_id,c.to_part_id].every(p=>p===null||ids.includes(p))));
  return {variant:{...variant,active_part_ids:[...visible],cable_profile_ids:cableIds,viewer:{...variant.viewer,mode:extraction?"assembled" as const:variant.viewer.mode,rig_context:extraction?"handheld":variant.viewer.rig_context}},new_ids:frame.add_part_ids.filter(id=>ids.includes(id)),context_ids:contextIds,note:frame.note};
}

export function parseRig(value: unknown, catalogIds: string[]): CustomRig {
  if (!value || typeof value !== "object") throw new Error("Formato de rig no válido.");
  const r = value as Record<string,unknown>;
  if (![1,2].includes(Number(r.schema_version))||typeof r.schema_version!=="number"||typeof r.id!=="string"||!/^rig-[\w-]{1,100}$/.test(r.id)||typeof r.name!=="string"||!r.name.trim()||r.name.length>80||!["gimbal","handheld","static","shoulder"].includes(String(r.context))||!["landscape","vertical"].includes(String(r.orientation))||!Array.isArray(r.part_ids)||r.part_ids.length>catalogIds.length||r.part_ids.some(id=>typeof id!=="string"||!catalogIds.includes(id))||new Set(r.part_ids).size!==r.part_ids.length||typeof r.updated_at!=="string"||!Number.isFinite(Date.parse(r.updated_at))) throw new Error("Rig no válido o piezas fuera del catálogo actual. No se importaron datos.");
  let units:RigUnit[]|undefined;
  if(r.schema_version===2){
    if(!Array.isArray(r.units)||r.units.length>UNIT_LIMIT)throw new Error("Lista de unidades no compatible. No se borraron datos.");
    units=r.units.map((value:unknown)=>{
      if(!value||typeof value!=="object"||Array.isArray(value))throw new Error("Unidad no válida.");
      const unit=value as Record<string,unknown>;
      if(Object.keys(unit).some(key=>!["id","part_id","label","role"].includes(key))||typeof unit.id!=="string"||!/^unit-[\w-]{1,120}$/.test(unit.id)||typeof unit.part_id!=="string"||!catalogIds.includes(unit.part_id)||typeof unit.label!=="string"||!unit.label.trim()||unit.label.length>40||typeof unit.role!=="string"||!["rig","spare"].includes(unit.role))throw new Error("Unidad no válida o montaje de unidad no documentado.");
      return {id:unit.id,part_id:unit.part_id,label:unit.label,role:unit.role as RigUnit["role"]};
    });
    const planned=units.filter(unit=>unit.role==="rig"),partIds=r.part_ids as string[];
    if(new Set(units.map(unit=>unit.id)).size!==units.length||planned.length!==partIds.length||new Set(planned.map(unit=>unit.part_id)).size!==planned.length||planned.some(unit=>!partIds.includes(unit.part_id))||units.some(unit=>units!.filter(other=>other.part_id===unit.part_id).length>UNITS_PER_PART_LIMIT))throw new Error("Unidades duplicadas o selección incoherente. No se asignó ningún montaje.");
  }else if(r.units!==undefined)throw new Error("Unidades en formato anterior no compatibles. No se borraron datos.");
  const adjustments=parseAdjustments(r.adjustments,catalogIds);
  return {schema_version:r.schema_version as 1|2,id:r.id,name:r.name.trim(),context:r.context as CustomRig["context"],orientation:r.orientation as CustomRig["orientation"],part_ids:[...r.part_ids] as string[],updated_at:r.updated_at,...(units?{units}:{}),...(adjustments?{adjustments}:{})};
}

export function parseLibrary(raw: string | null, catalogIds: string[], limit: number): RigLibrary {
  if (!raw) return {version:1,rigs:[]};
  const value=JSON.parse(raw);
  if(!value||![1,2,3].includes(value.version)||(value.version!==1&&value.catalog_revision!==CATALOG_REVISION)||!Array.isArray(value.rigs)||value.rigs.length>limit) throw new Error("Biblioteca no compatible. Los datos guardados no se han borrado.");
  if(value.version!==3&&value.rigs.some((rig:CustomRig)=>rig.schema_version!==1))throw new Error("Las unidades requieren la biblioteca nueva. El original se conserva.");
  const rigs=value.rigs.map((r:unknown)=>parseRig(r,catalogIds));
  if(new Set(rigs.map((r:CustomRig)=>r.id)).size!==rigs.length) throw new Error("Biblioteca con identificadores duplicados.");
  let history:Record<string,CustomRig[]>|undefined;
  if(value.history!==undefined){
    if(!value.history||typeof value.history!=="object"||Array.isArray(value.history)||Object.keys(value.history).length>limit)throw new Error("Historial local no compatible. No se borraron datos.");
    history={};
    for(const [id,entries] of Object.entries(value.history)){
      if(!rigs.some((r:CustomRig)=>r.id===id)||!Array.isArray(entries)||entries.length>5)throw new Error("Historial local no compatible. No se borraron datos.");
      history[id]=entries.map(entry=>parseRig(entry,catalogIds));
      if(history[id].some(r=>r.id!==id))throw new Error("Historial con un identificador diferente.");
    }
  }
  return {version:1,rigs,...(history?{history}:{})};
}

export function loadRigLibrary(storage:Pick<Storage,"getItem">,catalogIds:string[],limit:number){
  const raw=storage.getItem(LIBRARY_KEY),previousRaw=storage.getItem(PREVIOUS_LIBRARY_KEY),legacyRaw=storage.getItem(LEGACY_LIBRARY_KEY);
  const library=parseLibrary(raw??previousRaw??legacyRaw,catalogIds,limit);
  const source=raw??previousRaw,record=source?JSON.parse(source):null;
  const legacyChanged=!!record&&(record.legacy_fingerprint!==libraryFingerprint(legacyRaw)||(!!raw&&record.previous_fingerprint!==libraryFingerprint(previousRaw)));
  return {raw,previousRaw,legacyRaw,legacyChanged,rigs:library.rigs.map(withRigUnits),history:Object.fromEntries(Object.entries(library.history??{}).map(([id,entries])=>[id,entries.map(withRigUnits)]))};
}

export function writeLibrary(storage:Pick<Storage,"getItem"|"setItem">,expected:string|null,rigs:CustomRig[],catalogIds:string[],limit:number):string {
  if(rigs.length>limit)throw new Error(`Máximo ${limit} rigs guardados. Elimina uno que ya no necesites antes de continuar.`);
  const raw=storage.getItem(LIBRARY_KEY);
  if(raw!==expected)throw new Error("La biblioteca cambió en otra pestaña. Tu borrador sigue abierto; no se ha sobrescrito ningún rig. Revisa la biblioteca de esa pestaña antes de continuar.");
  let previous:RigLibrary={version:1,rigs:[]};
  try{previous=parseLibrary(raw??storage.getItem(PREVIOUS_LIBRARY_KEY)??storage.getItem(LEGACY_LIBRARY_KEY),catalogIds,limit);}catch{if(raw)storage.setItem(`${LIBRARY_KEY}.backup`,raw);else throw new Error("La biblioteca anterior no se pudo leer; se conserva sin reemplazar.");}
  const history:Record<string,CustomRig[]>={};
  for(const rig of rigs){
    const prior=previous.rigs.find(r=>r.id===rig.id);
    const entries=[...(previous.history?.[rig.id]??(prior?[prior]:[]))];
    if(JSON.stringify(entries.at(-1))!==JSON.stringify(rig))entries.push(rig);
    history[rig.id]=entries.slice(-5);
  }
  const serialized=JSON.stringify({version:3,catalog_revision:CATALOG_REVISION,legacy_fingerprint:libraryFingerprint(storage.getItem(LEGACY_LIBRARY_KEY)),previous_fingerprint:libraryFingerprint(storage.getItem(PREVIOUS_LIBRARY_KEY)),rigs,history});
  parseLibrary(serialized,catalogIds,limit);
  storage.setItem(LIBRARY_KEY,serialized);
  if(storage.getItem(LIBRARY_KEY)!==serialized)throw new Error("No se pudo confirmar el guardado local. Tu borrador sigue abierto.");
  return serialized;
}
