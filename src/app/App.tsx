import { useEffect, useRef, useState } from "react";
import { cablesData, partsData, plannerData, variantsData } from "../data";
import RigPlannerPage from "../views/RigPlannerPage";
import RigBuilder from "../components/RigBuilder";
import RigLibrary from "../components/RigLibrary";
import { LIBRARY_KEY, newRig, parseLibrary, parseRig, resolveRig, writeLibrary } from "../lib/planner";
import { partName } from "../lib/ui";
import type { CustomRig, Variant } from "../lib/types";

const catalogIds=partsData.parts.map(p=>p.id);
const master=variantsData.variants.find(v=>v.id===variantsData.master_variant_id)!;
function loadLibrary(){
 let raw:string|null=null;
 try{raw=localStorage.getItem(LIBRARY_KEY);return {raw,rigs:parseLibrary(raw,catalogIds,plannerData.max_saved_rigs).rigs,warning:""};}
 catch{return {raw,rigs:[] as CustomRig[],warning:"No se pudo leer la biblioteca local. No se ha borrado ningún dato. Comprueba los permisos y el almacenamiento del navegador."};}
}
export default function App(){
 const [initial]=useState(loadLibrary);
 const storedSnapshot=useRef(initial.raw);
 const [saved,setSaved]=useState(initial.rigs);const [rigs,setRigs]=useState(initial.rigs);
 const [variantId,setVariantId]=useState(initial.rigs[initial.rigs.length-1]?.id??variantsData.master_variant_id);
 const [builderOpen,setBuilderOpen]=useState(false);const [libraryOpen,setLibraryOpen]=useState(false);
 const [message,setMessage]=useState(initial.warning);
 const [exploded,setExploded]=useState(false);const [showLabels,setShowLabels]=useState(false);const [showCables,setShowCables]=useState(false);
 const custom=rigs.find(r=>r.id===variantId);
 const resolution=custom?resolveRig(custom,plannerData,cablesData.cables,master,partName):null;
 const variant=resolution?.variant??variantsData.variants.find(v=>v.id===variantId)??master;
 const dirty=!!custom&&JSON.stringify(custom)!==JSON.stringify(saved.find(r=>r.id===custom.id));
 const anyDirty=rigs.some(r=>JSON.stringify(r)!==JSON.stringify(saved.find(s=>s.id===r.id)));
 useEffect(()=>{if(!anyDirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return ()=>window.removeEventListener("beforeunload",warn);},[anyDirty]);
 const persist=(next:CustomRig[])=>{
  try{
   const serialized=writeLibrary(localStorage,storedSnapshot.current,next,catalogIds,plannerData.max_saved_rigs);storedSnapshot.current=serialized;setSaved(next);return true;
  }catch(e){setMessage(e instanceof Error&&/^(Máximo|La biblioteca)/.test(e.message)?e.message:"No se pudo guardar. Tu borrador sigue abierto. Comprueba permisos y espacio del navegador antes de cerrar la página.");return false;}
 };
 const create=(template?:Variant)=>{const rig=newRig(template?`${template.label} / personal`:undefined,template);if(template?.id==="corporate-interview")rig.context="static";setRigs(previous=>[...previous,rig]);setVariantId(rig.id);setExploded(false);setLibraryOpen(false);setBuilderOpen(true);setMessage("");};
 const save=()=>{const candidate=custom??newRig(`${variant.label} / personal`,variant);if(!custom&&variant.id==="corporate-interview")candidate.context="static";if(!candidate.name.trim()){setMessage("Escribe un nombre para guardar el rig.");setBuilderOpen(true);return;}const clean=parseRig({...candidate,name:candidate.name.trim()},catalogIds);if(persist([...saved.filter(r=>r.id!==clean.id),clean])){setRigs(previous=>custom?previous.map(r=>r.id===clean.id?clean:r):[...previous,clean]);setVariantId(clean.id);setMessage("Rig guardado. Lo encontrarás en Mis rigs, en este navegador.");}};
 const update=(rig:CustomRig)=>setRigs(previous=>previous.map(r=>r.id===rig.id?{...rig,updated_at:new Date().toISOString()}:r));
 const open=(id:string)=>{setVariantId(id);setExploded(false);setLibraryOpen(false);setMessage("");};
 const remove=(id:string)=>{if(saved.some(r=>r.id===id)&&!persist(saved.filter(r=>r.id!==id)))return;setRigs(previous=>previous.filter(r=>r.id!==id));if(variantId===id)setVariantId(master.id);};
 const duplicate=(rig:CustomRig)=>{const copy={...newRig(`${rig.name} / copia`),context:rig.context,orientation:rig.orientation,part_ids:[...rig.part_ids]};setRigs(previous=>[...previous,copy]);open(copy.id);setBuilderOpen(true);};
 return <>
  <RigPlannerPage variant={variant} customRig={custom??null} resolution={resolution} savedRigs={rigs} dirty={dirty} message={message} onDismissMessage={()=>setMessage("")} onNewRig={()=>create()} onLibrary={()=>setLibraryOpen(true)} onEditRig={()=>custom?setBuilderOpen(true):create(variant)} onSaveRig={save} exploded={exploded} onExplodedChange={setExploded} showLabels={showLabels} onShowLabelsChange={setShowLabels} showCables={showCables} onShowCablesChange={setShowCables} onVariantChange={open}/>
  <RigLibrary open={libraryOpen} onClose={()=>setLibraryOpen(false)} rigs={rigs} saved={saved} onOpen={open} onCreate={()=>create()} onTemplate={create} onDuplicate={duplicate} onDelete={remove}/>
  {custom&&resolution&&<RigBuilder open={builderOpen} onClose={()=>setBuilderOpen(false)} rig={custom} resolution={resolution} onChange={update} onSave={save} dirty={dirty} message={message}/>}
 </>;
}
