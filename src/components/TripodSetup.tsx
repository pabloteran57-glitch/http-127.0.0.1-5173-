import {useState} from "react";
import profile from "../../data/static-support-integration.json";
import {cablesData,plannerData,variantsData} from "../data";
import {addTripodSupport,completeTripodCore,parkTripodExtras,tripodPlan,type TripodProfile} from "../lib/tripod-plan";
import type {CustomRig} from "../lib/types";
import {partName} from "../lib/ui";
import {BundleReminder} from "./DependencyNeeds";

const tripod=profile as TripodProfile;
const master=variantsData.variants.find(v=>v.id===variantsData.master_variant_id)!;

function ReserveChoice({rig,ids,onChange}:{rig:CustomRig;ids:string[];onChange:(rig:CustomRig)=>void}) {
  const [confirmed,setConfirmed]=useState(false);
  return <div className="tripod-reserve">
    <p><b>Fuera de esta combinación revisada:</b> {ids.map(partName).join(", ")}.</p>
    <p>No significa que sea físicamente imposible. No se ha documentado su montaje con este trípode en Takegrid.</p>
    <label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>Confirmo conservar el equipo de esta lista como repuesto, sin montarlo en este plan.</label>
    <button type="button" className="quiet-button" disabled={!confirmed} onClick={()=>{const next=parkTripodExtras(rig,tripod,ids);if(next)onChange(next);}}>Pasar a repuestos ({ids.length})</button>
    <small>No se borran unidades ni etiquetas. Puedes volver a usarlas desde Elegidas.</small>
  </div>;
}

export default function TripodSetup({rig,onChange}:{rig:CustomRig;onChange:(rig:CustomRig)=>void}) {
  const plan=tripodPlan(rig,tripod,plannerData,cablesData.cables,master);
  if(rig.context!==tripod.context&&!rig.part_ids.includes(tripod.part_id))return null;
  const names=plan.missing_ids.map(partName).join(", ");
  const supportChoice=addTripodSupport(rig,tripod,plannerData,cablesData.cables,master);
  return <section className="setup-starter tripod-setup" aria-label="Preparar rig con trípode" data-tripod-state={plan.core_ready?"candidate":"pending"}>
    <h3>{plan.support_ready?"Soporte de trípode preparado":"Prepara tu rig con trípode"}</h3>
    <p>AD-01 3751B incluye cabezal, placa y tornillos. No necesitas brazo de gimbal ni comprar otra placa para esta cadena.</p>
    {plan.needs_context?<div><p><b>Primero, el modo del plan:</b> esta combinación se ha revisado sólo en cámara estática horizontal. Cambiar conserva tus piezas; las no revisadas quedan pendientes.</p><button type="button" className="quiet-button" onClick={()=>onChange({...rig,context:tripod.context,orientation:tripod.orientation})}>Usar trípode · horizontal</button></div>:<>
      {plan.outside_ids.length>0&&<ReserveChoice key={`${rig.id}:${plan.outside_ids.join("|")}`} rig={rig} ids={plan.outside_ids} onChange={onChange}/>}
      {supportChoice&&<div><p>Ya tienes FX3 y jaula. {rig.part_ids.includes("smallrig-1674")?"La placa incluida se fija bajo 1674; se conservan las varillas y la V-mount elegidas.":"Puedes montar el soporte sin añadir aún óptica o alimentación."}</p><button type="button" className="quiet-button" onClick={()=>{const next=addTripodSupport(rig,tripod,plannerData,cablesData.cables,master);if(next)onChange(next);}}>Montar AD-01 con su placa incluida (1)</button></div>}
      {plan.support_ready&&!plan.core_ready&&<p className="tripod-ready">FX3, jaula y trípode tienen soporte candidato. Los avisos de óptica y alimentación son de preparación para rodar, no otra placa faltante.</p>}
      {plan.missing_ids.length>0&&<div className="tripod-core"><p><b>Para completar el conjunto de referencia:</b> {names}.</p><button type="button" className="quiet-button" disabled={!plan.can_complete} onClick={()=>{const next=completeTripodCore(rig,tripod,plannerData,cablesData.cables,master);if(next)onChange(next);}}>Elegir núcleo de trípode ({plan.missing_ids.length})</button>{plan.outside_ids.length>0&&<small>Resuelve primero las piezas de la lista anterior. No se sustituye tu cámara u óptica automáticamente.</small>}{!plan.capacity&&<small>La biblioteca alcanzó un límite de unidades. Revisa tus repuestos antes de añadir más.</small>}</div>}
      {plan.core_ready&&<p className="tripod-ready">Cámara, óptica, jaula, alimentación elegida y trípode tienen cadena candidata. {plan.pending_ids.length?"Aún hay accesorios pendientes; revisa sus fichas.":"Monitor, audio y sistema de varillas elegidos se conservan."}</p>}
    </>}
    <BundleReminder partId={tripod.part_id}/>
    <small>FX3 / 16-35 GM / HawkLock 4770; placa AD-01 directa o bajo base 1674. Alimentación nativa o 4253B con V-mount, nunca ambas en el mismo alojamiento. Carga, antitorsión y holgura batería/cabezal requieren prueba física.</small>
  </section>;
}
