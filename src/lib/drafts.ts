import type { CustomRig } from "./types";
export const DRAFT_PREFIX="takegrid.drafts.v1.";
type DraftStorage=Pick<Storage,"getItem"|"setItem"|"removeItem"|"key"|"length">;
export interface RecoverableDraft {key:string;raw:string;rig:CustomRig;tab_id:string;recorded_at:string}
type RigParser=(value:unknown)=>CustomRig;

export function readDrafts(storage:DraftStorage,parse:RigParser):{drafts:RecoverableDraft[];unreadable:number}{
  const drafts:RecoverableDraft[]=[];let unreadable=0;
  for(let i=0;i<storage.length;i++){
    const key=storage.key(i);if(!key?.startsWith(DRAFT_PREFIX))continue;
    const raw=storage.getItem(key);if(!raw)continue;
    try{
      const value=JSON.parse(raw);
      if(value.version!==1||typeof value.tab_id!=="string"||typeof value.recorded_at!=="string"||!Number.isFinite(Date.parse(value.recorded_at))||typeof value.rig?.name!=="string"||value.rig.name.length>80)throw new Error("Formato de borrador no compatible.");
      const rig={...parse({...value.rig,name:value.rig.name.trim()||"Rig sin nombre"}),name:value.rig.name};
      if(key!==`${DRAFT_PREFIX}${value.tab_id}.${rig.id}`)throw new Error("Identidad de borrador no compatible.");
      drafts.push({key,raw,rig,tab_id:value.tab_id,recorded_at:value.recorded_at});
    }catch{unreadable++;}
  }
  drafts.sort((a,b)=>Date.parse(b.recorded_at)-Date.parse(a.recorded_at));
  return {drafts,unreadable};
}
export function writeDraft(storage:DraftStorage,tabId:string,rig:CustomRig,parse:RigParser):string {
  parse({...rig,name:rig.name.trim()||"Rig sin nombre"});
  const key=`${DRAFT_PREFIX}${tabId}.${rig.id}`;
  if(storage.length>200&&!storage.getItem(key))throw new Error("Hay demasiados registros locales. Revisa los borradores antes de continuar.");
  const raw=JSON.stringify({version:1,tab_id:tabId,recorded_at:new Date().toISOString(),rig});
  storage.setItem(key,raw);
  if(storage.getItem(key)!==raw)throw new Error("No se pudo confirmar la recuperación local.");
  return raw;
}
export function discardDraft(storage:DraftStorage,draft:Pick<RecoverableDraft,"key"|"raw">):void {
  if(storage.getItem(draft.key)!==draft.raw)throw new Error("Este borrador cambió en otra pestaña. No se eliminó.");
  storage.removeItem(draft.key);
  if(storage.getItem(draft.key)!==null)throw new Error("No se pudo eliminar el borrador.");
}
export function clearConfirmedDraft(storage:DraftStorage,tabId:string,rig:CustomRig):boolean {
  const key=`${DRAFT_PREFIX}${tabId}.${rig.id}`,raw=storage.getItem(key);
  if(!raw)return false;
  let value:unknown;
  try{value=JSON.parse(raw);}catch{return false;}
  const record=value as {version?:number;tab_id?:string;rig?:unknown}|null;
  // Un guardado asíncrono no debe retirar cambios posteriores del borrador.
  if(record?.version!==1||record.tab_id!==tabId||JSON.stringify(record.rig)!==JSON.stringify(rig))return false;
  discardDraft(storage,{key,raw});
  return true;
}
