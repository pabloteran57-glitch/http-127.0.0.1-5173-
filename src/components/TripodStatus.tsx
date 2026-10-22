import profile from "../../data/static-support-integration.json";
import {cablesData,plannerData,variantsData} from "../data";
import {tripodPlan,type TripodProfile} from "../lib/tripod-plan";
import type {CustomRig} from "../lib/types";
import {partName} from "../lib/ui";

export default function TripodStatus({rig,onEdit}:{rig:CustomRig;onEdit:()=>void}) {
  if(!rig.part_ids.includes(profile.part_id))return null;
  const master=variantsData.variants.find(v=>v.id===variantsData.master_variant_id)!;
  const state=tripodPlan(rig,profile as TripodProfile,plannerData,cablesData.cables,master);
  return <aside className="tripod-status" aria-label="Estado del soporte de trípode" data-support-ready={state.support_ready}>
    <div><strong>{state.support_ready?"Trípode: soporte candidato preparado":"Trípode: montaje pendiente"}</strong>
      <p>{state.needs_context?"Cambia a Trípode / estática y horizontal. El kit elegido se conserva, sin desactivar el montaje actual.":state.support_ready?(state.missing_ids.length?`Para completar el conjunto de rodaje falta elegir: ${state.missing_ids.map(partName).join(", ")}. No falta otra placa.`:"Revisa los accesorios y comprueba retención, equilibrio y estabilidad con el equipo real."):"Revisa la jaula, la cámara y las piezas fuera del alcance documentado. No se añade una placa ficticia."}</p>
    </div><button type="button" className="quiet-button" onClick={onEdit}>Revisar montaje</button>
  </aside>;
}
