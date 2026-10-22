import support from "../../data/support-integration.json";
import staticSupport from "../../data/static-support-integration.json";
import {cablesData, plannerData, variantsData} from "../data";
import {resolveRig, setRigParts} from "../lib/planner";
import {partName} from "../lib/ui";
import type {CustomRig} from "../lib/types";

export default function SetupStarter({rig,onChange}:{rig:CustomRig;onChange:(rig:CustomRig)=>void}) {
  const profile=rig.context==="static"?staticSupport:support.shoulder;
  if(rig.context!==profile.context||rig.orientation!==profile.orientation)return null;
  const required=profile.required_part_ids,missing=required.filter(id=>!rig.part_ids.includes(id));
  if(!missing.length)return null;
  const proposal=setRigParts(rig,[...rig.part_ids,...missing]);
  const master=variantsData.variants.find(v=>v.id===variantsData.master_variant_id)!;
  const result=resolveRig(proposal,plannerData,cablesData.cables,master,partName);
  const blocked=required.find(id=>!result.variant.active_part_ids.includes(id));
  return <aside className="setup-starter" aria-label={rig.context==="static"?"Preparar núcleo estático":"Preparar núcleo al hombro"}>
    <strong>{rig.context==="static"?"Primer rig con trípode":"Primer rig al hombro"}</strong>
    <p>{rig.context==="static"?"El AD-01 3751B incluye cabezal, placa y tornillo; no necesita brazo de gimbal.":"El kit 2896C ya incluye base, varillas y dos agarres."} Para esta cadena faltan: {missing.map(partName).join(", ")}.</p>
    {blocked?<p>Revisa tus elecciones antes de completar: {result.issues.find(issue=>issue.part_id===blocked)?.message??"La cadena tiene una selección incompatible."}</p>:<button type="button" className="quiet-button" onClick={()=>onChange(proposal)}>Elegir estas {missing.length} piezas</button>}
    <small>No elimina elecciones. Monitor, audio y cables se eligen aparte; soporte y ergonomía requieren comprobación física.</small>
  </aside>;
}
