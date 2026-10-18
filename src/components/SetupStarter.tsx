import support from "../../data/support-integration.json";
import {cablesData, plannerData, variantsData} from "../data";
import {resolveRig, setRigParts} from "../lib/planner";
import {partName} from "../lib/ui";
import type {CustomRig} from "../lib/types";

export default function SetupStarter({rig,onChange}:{rig:CustomRig;onChange:(rig:CustomRig)=>void}) {
  if(rig.context!==support.shoulder.context||rig.orientation!==support.shoulder.orientation)return null;
  const required=support.shoulder.required_part_ids,missing=required.filter(id=>!rig.part_ids.includes(id));
  if(!missing.length)return null;
  const proposal=setRigParts(rig,[...rig.part_ids,...missing]);
  const master=variantsData.variants.find(v=>v.id===variantsData.master_variant_id)!;
  const result=resolveRig(proposal,plannerData,cablesData.cables,master,partName);
  const blocked=required.find(id=>!result.variant.active_part_ids.includes(id));
  return <aside className="setup-starter" aria-label="Preparar núcleo al hombro">
    <strong>Primer rig al hombro</strong>
    <p>El kit 2896C ya incluye base, varillas y dos agarres. Para esta cadena faltan: {missing.map(partName).join(", ")}.</p>
    {blocked?<p>Revisa tus elecciones antes de completar: {result.issues.find(issue=>issue.part_id===blocked)?.message??"La cadena tiene una selección incompatible."}</p>:<button type="button" className="quiet-button" onClick={()=>onChange(proposal)}>Elegir estas {missing.length} piezas</button>}
    <small>No elimina elecciones. Monitor, audio y cables se eligen aparte; soporte y ergonomía requieren comprobación física.</small>
  </aside>;
}
