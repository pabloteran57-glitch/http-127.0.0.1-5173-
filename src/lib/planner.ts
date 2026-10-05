import type { Cable, CustomRig, PlannerRules, Variant } from "./types";

export interface RigIssue { id: string; part_id?: string; message: string; add_ids: string[] }
export interface RigResolution { variant: Variant; issues: RigIssue[]; parked_ids: string[] }
export const LIBRARY_KEY = "takegrid.rigs.v1";
export type RigLibrary = { version: 1; rigs: CustomRig[] };

export function newRig(name = "Mi nuevo rig", template?: Variant): CustomRig {
  return { schema_version: 1, id: `rig-${crypto.randomUUID()}`, name: name.slice(0,80), context: template && !template.active_part_ids.includes("dji-rs4-pro-combo") ? "handheld" : "gimbal", orientation: template?.viewer.mode === "vertical" ? "vertical" : "landscape", part_ids: template ? [...template.active_part_ids] : [], updated_at: new Date().toISOString() };
}

export function dependencyClosure(ids: string[], rules: PlannerRules): string[] {
  const result = new Set(ids);
  const visit = (id: string) => { for (const needed of rules.mount_dependencies[id] ?? []) if (!result.has(needed)) { result.add(needed); visit(needed); } };
  ids.forEach(visit);
  return [...result];
}

export function resolveRig(rig: CustomRig, rules: PlannerRules, cables: Cable[], master: Variant, nameOf: (id: string) => string): RigResolution {
  const selected = new Set(rig.part_ids);
  const active = new Set(rig.part_ids);
  const issues: RigIssue[] = [];
  const exclude = (id: string, message: string, add_ids: string[] = []) => { active.delete(id); issues.push({id: `part-${id}`, part_id: id, message, add_ids}); };
  for (const id of selected) {
    if (rules.parked_part_ids.includes(id)) exclude(id, `${nameOf(id)}: montaje o sistema pendiente. Se conserva en reserva, no se instala en el visor.`);
    else if (rig.context !== "gimbal" && rules.gimbal_only_part_ids.includes(id)) exclude(id, `${nameOf(id)}: la cadena documentada requiere un gimbal. No se inventa soporte a mano o estático.`);
    else if (rig.context === "gimbal" && rules.gimbal_excluded_part_ids.includes(id)) exclude(id, `${nameOf(id)}: reservado para cámara a mano o estática, no gimbal activo.`);
    else if (rig.context === "gimbal" && rig.orientation === "vertical" && rules.vertical_excluded_part_ids.includes(id)) exclude(id, `${nameOf(id)}: fuera de la configuración vertical documentada; pila, soporte y holguras pendientes.`);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of [...active]) {
      const missing = (rules.mount_dependencies[id] ?? []).filter(p => !active.has(p));
      if (missing.length) { exclude(id, `${nameOf(id)}: falta la cadena de soporte ${missing.map(nameOf).join(", ")}.`, dependencyClosure(missing, rules).filter(p => !selected.has(p))); changed = true; }
    }
  }
  const needs = (id: string, message: string, add_ids: string[]) => { if (add_ids.some(p => !active.has(p))) issues.push({id, message, add_ids: dependencyClosure(add_ids, rules).filter(p => !selected.has(p))}); };
  needs("camera", "Elige una cámara para iniciar el rig.", ["sony-fx3"]);
  if (active.has("sony-fx3")) needs("lens", "Falta una óptica para completar el núcleo de cámara.", ["sony-fe-16-35-gm"]);
  if (rig.context === "gimbal") needs("gimbal", "Este perfil necesita RS 4 Pro y BG70. La capacidad nominal no certifica equilibrio.", ["dji-rs4-pro-combo", "dji-rs-bg70"]);
  if (active.has("smallhd-indie-7")) {
    needs("monitor-video", "Monitor sin enlace de vídeo seleccionado.", ["kondor-blue-hdmi-aa"]);
    needs("monitor-power", "Falta la cadena documentada de alimentación del monitor; no se presupone batería interna.", ["smallhd-dtap-to-2mm-barrel", "smallrig-vb99-pro"]);
  }
  if (active.has("smallrig-vb99-pro") && active.has("sony-fx3")) needs("camera-power", "V-mount elegida sin adaptador regulado para la FX3.", ["smallrig-4253b"]);
  if (active.has("sony-fx3") && !active.has("smallrig-4253b")) issues.push({id:"internal-battery",message:"Planifica una NP-FZ100 interna cargada: disponibilidad y masa no incluidas en el catálogo actual.",add_ids:[]});
  if (active.has("dji-mic-2-kit")) issues.push({id:"rx-mount",message:"El receptor Mic 2 no tiene fijación confirmada. Audio documentado, montaje y masa del RX pendientes.",add_ids:[]});
  if (rig.context === "static") issues.push({id:"static-support",message:"Soporte estático real por seleccionar. No se representa un trípode ni se certifica estabilidad.",add_ids:[]});
  if (rig.orientation === "vertical" && rig.context !== "gimbal") issues.push({id:"vertical-support",message:"Montaje vertical fuera del RS 4 Pro no documentado. El visor conserva orientación horizontal.",add_ids:[]});
  const cableIds = cables.filter(c => c.status === "candidate" && active.has(c.source_part_id) && [c.from_part_id,c.to_part_id].every(p => p === null || active.has(p)) && !(c.cable_id === "audio-rx-to-fx3" && active.has("sony-xlr-h1"))).map(c => c.cable_id);
  const ids = rig.part_ids.filter(id => active.has(id));
  const parked = rig.part_ids.filter(id => !active.has(id));
  return {issues, parked_ids: parked, variant: {id:rig.id,label:rig.name,active_part_ids:ids,conditional_part_ids:parked,parts_added:ids.filter(id=>!master.active_part_ids.includes(id)),parts_removed:master.active_part_ids.filter(id=>!active.has(id)),cable_profile_ids:cableIds,cables_added:cableIds.filter(id=>!master.cable_profile_ids.includes(id)),cables_removed:master.cable_profile_ids.filter(id=>!cableIds.includes(id)),dependencies:issues.map(i=>i.message),operating_status:"Plan personalizado / comprobación física pendiente",balance_impact:"Pesar el conjunto completo y volver a equilibrar tras cambios. Las masas conocidas no certifican encaje ni par.",workflow_impact:"Configuración elegida por el usuario dentro del catálogo actual. Las piezas pendientes no se dibujan como instaladas.",budget_impact:"Sin precios cotizados. La selección no demuestra disponibilidad ni compras realizadas.",complexity_impact:`${ids.length} elementos activos; ${parked.length} en reserva.`,viewer:{mode:rig.orientation==="vertical"&&rig.context==="gimbal"?"vertical":"assembled",positions:{}}}};
}

export function assemblyFrame(variant: Variant, step: number, rules: PlannerRules, cables: Cable[]) {
  const frame = rules.assembly_frames[step-1];
  const introduced = new Set(rules.assembly_frames.filter(f=>f.step<=step).flatMap(f=>f.add_part_ids));
  let ids = variant.active_part_ids.filter(id=>introduced.has(id));
  if (step === 13) ids = ids.filter(id=>rules.extraction_keep_part_ids.includes(id));
  const contextIds = frame.context_part_ids.filter(id=>variant.active_part_ids.includes(id)&&!ids.includes(id));
  const visible = new Set([...ids,...contextIds]);
  const available = new Set(rules.assembly_frames.filter(f=>f.step<=step).flatMap(f=>f.add_cable_ids));
  const cableIds = variant.cable_profile_ids.filter(id=>available.has(id)&&cables.some(c=>c.cable_id===id&&[c.from_part_id,c.to_part_id].every(p=>p===null||ids.includes(p))));
  return {variant:{...variant,active_part_ids:[...visible],cable_profile_ids:cableIds,viewer:{...variant.viewer,mode:step===13?"assembled" as const:variant.viewer.mode}},new_ids:frame.add_part_ids.filter(id=>ids.includes(id)),context_ids:contextIds,note:frame.note};
}

export function parseRig(value: unknown, catalogIds: string[]): CustomRig {
  if (!value || typeof value !== "object") throw new Error("Formato de rig no válido.");
  const r = value as Record<string,unknown>;
  if (r.schema_version!==1||typeof r.id!=="string"||!/^rig-[\w-]{1,100}$/.test(r.id)||typeof r.name!=="string"||!r.name.trim()||r.name.length>80||!["gimbal","handheld","static"].includes(String(r.context))||!["landscape","vertical"].includes(String(r.orientation))||!Array.isArray(r.part_ids)||r.part_ids.length>catalogIds.length||r.part_ids.some(id=>typeof id!=="string"||!catalogIds.includes(id))||new Set(r.part_ids).size!==r.part_ids.length||typeof r.updated_at!=="string"||!Number.isFinite(Date.parse(r.updated_at))) throw new Error("Rig no válido o piezas fuera del catálogo actual. No se importaron datos.");
  return {schema_version:1,id:r.id,name:r.name.trim(),context:r.context as CustomRig["context"],orientation:r.orientation as CustomRig["orientation"],part_ids:[...r.part_ids] as string[],updated_at:r.updated_at};
}

export function parseLibrary(raw: string | null, catalogIds: string[], limit: number): RigLibrary {
  if (!raw) return {version:1,rigs:[]};
  const value=JSON.parse(raw);
  if(value.version!==1||!Array.isArray(value.rigs)||value.rigs.length>limit) throw new Error("Biblioteca no compatible. Los datos guardados no se han borrado.");
  const rigs=value.rigs.map((r:unknown)=>parseRig(r,catalogIds));
  if(new Set(rigs.map((r:CustomRig)=>r.id)).size!==rigs.length) throw new Error("Biblioteca con identificadores duplicados.");
  return {version:1,rigs};
}

export function writeLibrary(storage:Pick<Storage,"getItem"|"setItem">,expected:string|null,rigs:CustomRig[],catalogIds:string[],limit:number):string {
  if(rigs.length>limit)throw new Error(`Máximo ${limit} rigs guardados. Elimina uno que ya no necesites antes de continuar.`);
  const raw=storage.getItem(LIBRARY_KEY);
  if(raw!==expected)throw new Error("La biblioteca cambió en otra pestaña. Tu borrador sigue abierto; no se ha sobrescrito ningún rig. Revisa la biblioteca de esa pestaña antes de continuar.");
  const serialized=JSON.stringify({version:1,rigs});
  parseLibrary(serialized,catalogIds,limit);
  try{parseLibrary(raw,catalogIds,limit);}catch{if(raw)storage.setItem(`${LIBRARY_KEY}.backup`,raw);}
  storage.setItem(LIBRARY_KEY,serialized);
  return serialized;
}
