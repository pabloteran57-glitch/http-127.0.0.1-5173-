import type { AttachmentOption, Cable, CompatibilityEvidence, CustomRig, PlannerRules, RigAdjustments, RuleCondition, Variant } from "./types";

export interface RigIssue { id: string; part_id?: string; message: string; add_ids: string[] }
export interface RigResolution { variant: Variant; issues: RigIssue[]; parked_ids: string[] }
export const LIBRARY_KEY = "takegrid.rigs.v2";
export const LEGACY_LIBRARY_KEY = "takegrid.rigs.v1";
export type RigLibrary = { version: 1; rigs: CustomRig[]; history?:Record<string,CustomRig[]> };
export const CATALOG_REVISION = "fx3-rs4-2026-10-05";
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
  return {...structuredClone(rig),...newRig(name),context:rig.context,orientation:rig.orientation,part_ids:[...rig.part_ids]};
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

export function attachmentCandidates(anchorId:string,rig:CustomRig,rules:PlannerRules,cables:Cable[],master:Variant):AttachmentCandidate[] {
  if(!rig.part_ids.includes(anchorId))return [];
  return (rules.attachment_options??[]).flatMap(option=>{
    if(option.anchor_part_id!==anchorId||!option.source_ids.length||!conditionMatches(option.condition,new Set(rig.part_ids),rig))return [];
    // Evaluar la cadena propuesta completa: un soporte nuevo puede cambiar dependencias.
    const intended={...rig,part_ids:[...new Set([...rig.part_ids,...option.add_part_ids])]};
    const closure=dependencyClosure(option.add_part_ids,rules,intended);
    const additions=closure.filter(id=>!rig.part_ids.includes(id));
    if(!additions.length)return [];
    const proposal={...rig,part_ids:[...rig.part_ids,...additions]};
    const result=resolveRig(proposal,rules,cables,master,id=>id);
    if(![anchorId,...closure].every(id=>result.variant.active_part_ids.includes(id)))return [];
    return [{option,add_ids:additions}];
  });
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
    issues.push({id:check.id,message:check.message,add_ids:dependencyClosure(missing,rules,rig).filter(id=>!selected.has(id))});
  }
  const cableIds = cables.filter(c => c.status === "candidate" && active.has(c.source_part_id) && [c.from_part_id,c.to_part_id].every(p => p === null || active.has(p)) && !rules.cable_exclusions.some(rule=>rule.cable_id===c.cable_id&&conditionMatches(rule.condition,active,rig))).map(c => c.cable_id);
  const ids = rig.part_ids.filter(id => active.has(id));
  const parked = rig.part_ids.filter(id => !active.has(id));
  return {issues, parked_ids: parked, variant: {id:rig.id,label:rig.name,active_part_ids:ids,conditional_part_ids:parked,parts_added:ids.filter(id=>!master.active_part_ids.includes(id)),parts_removed:master.active_part_ids.filter(id=>!active.has(id)),cable_profile_ids:cableIds,cables_added:cableIds.filter(id=>!master.cable_profile_ids.includes(id)),cables_removed:master.cable_profile_ids.filter(id=>!cableIds.includes(id)),dependencies:issues.map(i=>i.message),operating_status:"Plan personalizado / comprobación física pendiente",balance_impact:"Pesar el conjunto completo y volver a equilibrar tras cambios. Las masas conocidas no certifican encaje ni par.",workflow_impact:"Configuración elegida por el usuario dentro del catálogo actual. Las piezas pendientes no se dibujan como instaladas.",budget_impact:"Sin precios cotizados. La selección no demuestra disponibilidad ni compras realizadas.",complexity_impact:`${ids.length} elementos activos; ${parked.length} en reserva.`,viewer:{mode:rig.orientation==="vertical"&&rig.context==="gimbal"?"vertical":"assembled",positions:{},rig_context:rig.context,monitor_mount_route:route,...(rig.adjustments?{adjustments:rig.adjustments}:{})}}};
}

export function assemblyFrame(variant: Variant, step: number, rules: PlannerRules, cables: Cable[]) {
  const profile=rules.assembly_profiles?.find(profile=>variant.active_part_ids.includes(profile.camera_part_id));
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
  const cableIds = variant.cable_profile_ids.filter(id=>available.has(id)&&cables.some(c=>c.cable_id===id&&[c.from_part_id,c.to_part_id].every(p=>p===null||ids.includes(p))));
  return {variant:{...variant,active_part_ids:[...visible],cable_profile_ids:cableIds,viewer:{...variant.viewer,mode:extraction?"assembled" as const:variant.viewer.mode,rig_context:extraction?"handheld":variant.viewer.rig_context}},new_ids:frame.add_part_ids.filter(id=>ids.includes(id)),context_ids:contextIds,note:frame.note};
}

export function parseRig(value: unknown, catalogIds: string[]): CustomRig {
  if (!value || typeof value !== "object") throw new Error("Formato de rig no válido.");
  const r = value as Record<string,unknown>;
  if (r.schema_version!==1||typeof r.id!=="string"||!/^rig-[\w-]{1,100}$/.test(r.id)||typeof r.name!=="string"||!r.name.trim()||r.name.length>80||!["gimbal","handheld","static"].includes(String(r.context))||!["landscape","vertical"].includes(String(r.orientation))||!Array.isArray(r.part_ids)||r.part_ids.length>catalogIds.length||r.part_ids.some(id=>typeof id!=="string"||!catalogIds.includes(id))||new Set(r.part_ids).size!==r.part_ids.length||typeof r.updated_at!=="string"||!Number.isFinite(Date.parse(r.updated_at))) throw new Error("Rig no válido o piezas fuera del catálogo actual. No se importaron datos.");
  const adjustments=parseAdjustments(r.adjustments,catalogIds);
  return {schema_version:1,id:r.id,name:r.name.trim(),context:r.context as CustomRig["context"],orientation:r.orientation as CustomRig["orientation"],part_ids:[...r.part_ids] as string[],updated_at:r.updated_at,...(adjustments?{adjustments}:{})};
}

export function parseLibrary(raw: string | null, catalogIds: string[], limit: number): RigLibrary {
  if (!raw) return {version:1,rigs:[]};
  const value=JSON.parse(raw);
  if(![1,2].includes(value.version)||(value.version===2&&value.catalog_revision!==CATALOG_REVISION)||!Array.isArray(value.rigs)||value.rigs.length>limit) throw new Error("Biblioteca no compatible. Los datos guardados no se han borrado.");
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

export function writeLibrary(storage:Pick<Storage,"getItem"|"setItem">,expected:string|null,rigs:CustomRig[],catalogIds:string[],limit:number):string {
  if(rigs.length>limit)throw new Error(`Máximo ${limit} rigs guardados. Elimina uno que ya no necesites antes de continuar.`);
  const raw=storage.getItem(LIBRARY_KEY);
  if(raw!==expected)throw new Error("La biblioteca cambió en otra pestaña. Tu borrador sigue abierto; no se ha sobrescrito ningún rig. Revisa la biblioteca de esa pestaña antes de continuar.");
  let previous:RigLibrary={version:1,rigs:[]};
  try{previous=parseLibrary(raw,catalogIds,limit);}catch{if(raw)storage.setItem(`${LIBRARY_KEY}.backup`,raw);}
  const history:Record<string,CustomRig[]>={};
  for(const rig of rigs){
    const prior=previous.rigs.find(r=>r.id===rig.id);
    const entries=[...(previous.history?.[rig.id]??(prior?[prior]:[]))];
    if(JSON.stringify(entries.at(-1))!==JSON.stringify(rig))entries.push(rig);
    history[rig.id]=entries.slice(-5);
  }
  const serialized=JSON.stringify({version:2,catalog_revision:CATALOG_REVISION,legacy_fingerprint:libraryFingerprint(storage.getItem(LEGACY_LIBRARY_KEY)),rigs,history});
  parseLibrary(serialized,catalogIds,limit);
  storage.setItem(LIBRARY_KEY,serialized);
  if(storage.getItem(LIBRARY_KEY)!==serialized)throw new Error("No se pudo confirmar el guardado local. Tu borrador sigue abierto.");
  return serialized;
}
