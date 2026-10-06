import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { cablesData, partsData, plannerData, variantsData } from "../data";
import RigPlannerPage from "../views/RigPlannerPage";
import RigBuilder from "../components/RigBuilder";
import RigLibrary from "../components/RigLibrary";
import { LIBRARY_KEY, LEGACY_LIBRARY_KEY, libraryFingerprint, newRig, parseLibrary, parseRig, resolveRig, writeLibrary } from "../lib/planner";
import { partName } from "../lib/ui";
import { DRAFT_PREFIX, clearConfirmedDraft, discardDraft, readDrafts, writeDraft, type RecoverableDraft } from "../lib/drafts";
import type { CustomRig, Variant } from "../lib/types";
const HelpCenter=lazy(()=>import("../components/HelpCenter"));

const catalogIds=partsData.parts.map(p=>p.id);
const master=variantsData.variants.find(v=>v.id===variantsData.master_variant_id)!;
function loadLibrary(){
 let raw:string|null=null;
 try{raw=localStorage.getItem(LIBRARY_KEY);const legacyRaw=localStorage.getItem(LEGACY_LIBRARY_KEY),library=parseLibrary(raw??legacyRaw,catalogIds,plannerData.max_saved_rigs),legacyChanged=!!raw&&JSON.parse(raw).legacy_fingerprint!==libraryFingerprint(legacyRaw);return {raw,legacyRaw,legacyChanged,rigs:library.rigs,history:library.history??{},warning:""};}
 catch{return {raw,legacyRaw:null as string|null,legacyChanged:false,rigs:[] as CustomRig[],history:{} as Record<string,CustomRig[]>,warning:"No se pudo leer la biblioteca local. No se ha borrado ningún dato. Comprueba los permisos y el almacenamiento del navegador."};}
}
export default function App(){
 const [initial]=useState(loadLibrary);
 const storedSnapshot=useRef(initial.raw);
 const legacySnapshot=useRef(initial.legacyRaw);
 const legacyChanged=useRef(initial.legacyChanged);
 const [saved,setSaved]=useState(initial.rigs);const [rigs,setRigs]=useState(initial.rigs);
 const [history,setHistory]=useState(initial.history);
 const [tabId]=useState(()=>crypto.randomUUID());
 const [recoverable,setRecoverable]=useState<RecoverableDraft[]>([]);
 const [draftStatus,setDraftStatus]=useState("");
 const draftSnapshot=useRef(new Map<string,string>());
 const saving=useRef(false);
 const [variantId,setVariantId]=useState(initial.rigs[initial.rigs.length-1]?.id??variantsData.master_variant_id);
 const [builderOpen,setBuilderOpen]=useState(false);const [libraryOpen,setLibraryOpen]=useState(false);
 const [helpOpen,setHelpOpen]=useState(false);
 const [message,setMessage]=useState(initial.warning||(initial.legacyChanged?"La biblioteca de una versión anterior cambió. Revisa cambios de otra pestaña en Mis rigs antes de guardar; no se sobrescribió ningún plan.":""));
 const [exploded,setExploded]=useState(false);const [showLabels,setShowLabels]=useState(false);const [showCables,setShowCables]=useState(false);
 const custom=rigs.find(r=>r.id===variantId);
 const resolution=custom?resolveRig(custom,plannerData,cablesData.cables,master,partName):null;
 const variant=resolution?.variant??variantsData.variants.find(v=>v.id===variantId)??master;
 const dirty=!!custom&&JSON.stringify(custom)!==JSON.stringify(saved.find(r=>r.id===custom.id));
 const anyDirty=rigs.some(r=>JSON.stringify(r)!==JSON.stringify(saved.find(s=>s.id===r.id)));
 const parser=(value:unknown)=>parseRig(value,catalogIds);
 const refreshDrafts=()=>{try{const result=readDrafts(localStorage,parser);setRecoverable(result.drafts.filter(d=>d.tab_id!==tabId));if(result.unreadable)setMessage(`${result.unreadable} borradores no se pudieron leer; se conservan sin borrar.`);}catch{setMessage("No se pudieron consultar los borradores recuperables. Ningún dato se ha borrado.");}};
 useEffect(()=>{refreshDrafts();},[]);
 useEffect(()=>{
  if(!anyDirty){setDraftStatus("");return;}
  setDraftStatus("Preparando recuperación local…");
  const flush=()=>{
    try{for(const rig of rigs){if(JSON.stringify(rig)===JSON.stringify(saved.find(s=>s.id===rig.id)))continue;const signature=JSON.stringify(rig);if(draftSnapshot.current.get(rig.id)===signature)continue;writeDraft(localStorage,tabId,rig,parser);draftSnapshot.current.set(rig.id,signature);}setDraftStatus("Borrador recuperable en este navegador");}
    catch{setDraftStatus("Recuperación no disponible. Guarda el rig antes de cerrar.");}
  };
  const timer=window.setTimeout(flush,350);
  const hidden=()=>{if(document.hidden)flush();};
  window.addEventListener("pagehide",flush);document.addEventListener("visibilitychange",hidden);
  return ()=>{window.clearTimeout(timer);window.removeEventListener("pagehide",flush);document.removeEventListener("visibilitychange",hidden);};
 },[rigs,saved,tabId,anyDirty]);
 useEffect(()=>{if(!anyDirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return ()=>window.removeEventListener("beforeunload",warn);},[anyDirty]);
 const persist=async(next:CustomRig[])=>{
  if(saving.current){setMessage("Hay un guardado en curso. Espera su confirmación antes de continuar.");return false;}
  saving.current=true;
  try{
   if(!navigator.locks)throw new Error("Este navegador no permite coordinar el guardado entre pestañas. Tu borrador sigue abierto y recuperable si el almacenamiento está disponible. Usa un navegador actualizado con HTTPS.");
   const expected=storedSnapshot.current;
   const serialized=await navigator.locks.request("takegrid-library-write",()=>{if(legacyChanged.current||localStorage.getItem(LEGACY_LIBRARY_KEY)!==legacySnapshot.current)throw new Error("La biblioteca de una versión anterior cambió. Revisa cambios de otra pestaña en Mis rigs; tus cambios siguen abiertos.");return writeLibrary(localStorage,expected,next,catalogIds,plannerData.max_saved_rigs);});storedSnapshot.current=serialized;setSaved(next);setHistory(parseLibrary(serialized,catalogIds,plannerData.max_saved_rigs).history??{});return true;
  }catch(e){setMessage(e instanceof Error&&/^(Máximo|La biblioteca|Este navegador)/.test(e.message)?e.message:"No se pudo guardar. Tu borrador sigue abierto. Comprueba permisos y espacio del navegador antes de cerrar la página.");return false;}
  finally{saving.current=false;}
 };
 const create=(template?:Variant)=>{const rig=newRig(template?`${template.label} / personal`:undefined,template);if(template?.id==="corporate-interview")rig.context="static";setRigs(previous=>[...previous,rig]);setVariantId(rig.id);setExploded(false);setLibraryOpen(false);setBuilderOpen(true);setMessage("");};
 const save=async()=>{const candidate=custom??newRig(`${variant.label} / personal`,variant);if(!custom&&variant.id==="corporate-interview")candidate.context="static";if(!candidate.name.trim()){setMessage("Escribe un nombre para guardar el rig.");setBuilderOpen(true);return;}const clean=parseRig({...candidate,name:candidate.name.trim()},catalogIds);if(await persist([...saved.filter(r=>r.id!==clean.id),clean])){setRigs(previous=>custom?previous.map(r=>r.id===clean.id?JSON.stringify(r)===JSON.stringify(candidate)?clean:r:r):[...previous,clean]);setVariantId(clean.id);try{if(clearConfirmedDraft(localStorage,tabId,candidate))draftSnapshot.current.delete(clean.id);}catch{/* El guardado confirmado permanece; sólo falla la limpieza del borrador. */}setMessage("Versión guardada con historial local. Si seguiste editando, esos cambios continúan como borrador.");}};
 const update=(rig:CustomRig)=>{setRigs(previous=>previous.map(r=>r.id===rig.id?{...rig,updated_at:new Date().toISOString()}:r));setMessage(previous=>previous.startsWith("Versión guardada")?"":previous);};
 const open=(id:string)=>{setVariantId(id);setExploded(false);setLibraryOpen(false);setMessage("");};
 const remove=async(id:string)=>{if(saved.some(r=>r.id===id)&&!await persist(saved.filter(r=>r.id!==id)))return;setRigs(previous=>previous.filter(r=>r.id!==id));try{localStorage.removeItem(`${DRAFT_PREFIX}${tabId}.${id}`);draftSnapshot.current.delete(id);}catch{setMessage("Rig retirado de la sesión; no se pudo limpiar su borrador local.");}if(variantId===id)setVariantId(master.id);};
 const duplicate=(rig:CustomRig)=>{const copy={...newRig(`${rig.name} / copia`),context:rig.context,orientation:rig.orientation,part_ids:[...rig.part_ids]};setRigs(previous=>[...previous,copy]);open(copy.id);setBuilderOpen(true);};
 const recover=(draft:RecoverableDraft)=>{const copy={...newRig(`${draft.rig.name||"Rig"} / recuperado`),context:draft.rig.context,orientation:draft.rig.orientation,part_ids:[...draft.rig.part_ids]};try{writeDraft(localStorage,tabId,copy,parser);}catch{setMessage("No se pudo asegurar una copia recuperable. El borrador original sigue intacto.");return;}setRigs(previous=>[...previous,copy]);setVariantId(copy.id);setBuilderOpen(true);setLibraryOpen(false);setMessage("Borrador abierto como copia. El original se conserva hasta que decidas descartarlo; guarda esta copia para confirmar el plan.");};
 const discard=(draft:RecoverableDraft)=>{try{discardDraft(localStorage,draft);refreshDrafts();}catch(e){setMessage(e instanceof Error?e.message:"No se pudo descartar el borrador.");}};
 const refreshLibrary=()=>{if(saving.current){setMessage("Espera a que termine el guardado antes de revisar la biblioteca.");return;}const loaded=loadLibrary();if(loaded.warning){setMessage(loaded.warning);return;}let legacyCopies:CustomRig[]=[];try{if(loaded.raw&&loaded.legacyChanged)legacyCopies=parseLibrary(loaded.legacyRaw,catalogIds,plannerData.max_saved_rigs).rigs.filter(r=>JSON.stringify(r)!==JSON.stringify(loaded.rigs.find(s=>s.id===r.id))).map(r=>({...newRig(`${r.name} / versión anterior`),context:r.context,orientation:r.orientation,part_ids:[...r.part_ids]}));}catch{setMessage("No se pudo leer la biblioteca anterior. Se conserva sin borrar; no se sustituyó la biblioteca actual.");return;}storedSnapshot.current=loaded.raw;legacySnapshot.current=loaded.legacyRaw;legacyChanged.current=false;setSaved(loaded.rigs);setHistory(loaded.history);setRigs(previous=>[...loaded.rigs,...legacyCopies,...previous.filter(r=>JSON.stringify(r)!==JSON.stringify(saved.find(s=>s.id===r.id))).map(r=>({...newRig(`${r.name} / cambios locales`),context:r.context,orientation:r.orientation,part_ids:[...r.part_ids]}))]);setVariantId(master.id);setMessage("Biblioteca actualizada. Los cambios locales y de versiones anteriores se conservaron como copias; guarda las que necesites.");refreshDrafts();};
 return <>
  <RigPlannerPage variant={variant} customRig={custom??null} resolution={resolution} savedRigs={rigs} dirty={dirty} message={message} recoveryStatus={dirty?draftStatus:""} viewerPaused={builderOpen||libraryOpen||helpOpen} onHelp={()=>setHelpOpen(true)} onDismissMessage={()=>setMessage("")} onNewRig={()=>create()} onLibrary={()=>{refreshDrafts();setLibraryOpen(true);}} onEditRig={()=>custom?setBuilderOpen(true):create(variant)} onSaveRig={save} exploded={exploded} onExplodedChange={setExploded} showLabels={showLabels} onShowLabelsChange={setShowLabels} onShowCablesChange={setShowCables} showCables={showCables} onVariantChange={open}/>
  <RigLibrary open={libraryOpen} onClose={()=>setLibraryOpen(false)} rigs={rigs} saved={saved} history={history} recoverable={recoverable} onRecover={recover} onDiscard={discard} onRefresh={refreshLibrary} onOpen={open} onCreate={()=>create()} onTemplate={create} onDuplicate={duplicate} onDelete={remove}/>
  {custom&&resolution&&<RigBuilder key={custom.id} open={builderOpen} onClose={()=>setBuilderOpen(false)} rig={custom} resolution={resolution} onChange={update} onSave={save} dirty={dirty} message={message}/>}
  {helpOpen&&<Suspense fallback={<div role="status" className="app-message">Abriendo ayuda…</div>}><HelpCenter onClose={()=>setHelpOpen(false)} onNew={()=>create()} onLibrary={()=>{refreshDrafts();setLibraryOpen(true);}}/></Suspense>}
 </>;
}
