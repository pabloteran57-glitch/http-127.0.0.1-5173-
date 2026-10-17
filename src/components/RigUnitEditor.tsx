import { useEffect, useState } from "react";
import { addSpareUnit, removeRigUnit, rigUnits, UNIT_LIMIT, UNITS_PER_PART_LIMIT, updateRigUnit } from "../lib/planner";
import type { CustomRig, RigUnit } from "../lib/types";
import { partName } from "../lib/ui";

function UnitRow({unit,rig,onChange,pending}:{unit:RigUnit;rig:CustomRig;onChange:(rig:CustomRig)=>void;pending:boolean}){
  const [label,setLabel]=useState(unit.label),[error,setError]=useState("");
  useEffect(()=>{setLabel(unit.label);setError("");},[unit.label]);
  const rename=()=>{
    if(label===unit.label)return;
    if(!label.trim()){setLabel(unit.label);setError("La etiqueta no puede estar vacía; se conservó la anterior.");return;}
    onChange(updateRigUnit(rig,unit.id,{label:label.trim()}));setError("");
  };
  return <li data-unit-id={unit.id} data-unit-role={unit.role}>
    <div className="unit-identity"><input aria-label={`Etiqueta de ${partName(unit.part_id)}, ${unit.label}`} maxLength={40} value={label} onChange={event=>setLabel(event.target.value)} onBlur={rename} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();event.currentTarget.blur();}if(event.key==="Escape"){setLabel(unit.label);setError("");}}}/><span className={`unit-role ${unit.role}`}>{unit.role==="spare"?"Repuesto · sin montar":pending?"En rig · montaje pendiente":"En rig · cadena candidata"}</span></div>
    <div className="unit-actions"><button type="button" onClick={()=>onChange(updateRigUnit(rig,unit.id,{role:unit.role==="rig"?"spare":"rig"}))} aria-label={`${unit.role==="rig"?"Pasar a repuesto":"Usar en rig"}: ${partName(unit.part_id)}, ${unit.label}`}>{unit.role==="rig"?"A repuesto":"Usar en rig"}</button><button type="button" onClick={()=>onChange(removeRigUnit(rig,unit.id))} aria-label={`Quitar unidad: ${partName(unit.part_id)}, ${unit.label}`}>Quitar</button></div>
    {error&&<p role="status" className="unit-error">{error}</p>}
  </li>;
}

export default function RigUnitEditor({partId,rig,pending,repeatable,onChange}:{partId:string;rig:CustomRig;pending:boolean;repeatable:boolean;onChange:(rig:CustomRig)=>void}){
  const units=rigUnits(rig),selected=units.filter(unit=>unit.part_id===partId),atLimit=units.length>=UNIT_LIMIT||selected.length>=UNITS_PER_PART_LIMIT;
  return <section id={`units-${partId}`} className="unit-editor" tabIndex={-1} aria-label={`Unidades de ${partName(partId)}`}>
    <div className="unit-heading"><strong>{selected.length} {selected.length===1?"unidad elegida":"unidades elegidas"}</strong>{repeatable&&<button type="button" className="quiet-button" disabled={atLimit} onClick={()=>onChange(addSpareUnit(rig,partId))} aria-label={`Añadir repuesto de ${partName(partId)}`}>+ Repuesto</button>}</div>
    <ul>{selected.map(unit=><UnitRow key={unit.id} unit={unit} rig={rig} pending={pending} onChange={onChange}/>)}</ul>
    {selected.some(unit=>unit.role==="spare")&&<p className="unit-note">Un repuesto no se monta, no recibe cables ni se suma a la carga. «Usar en rig» intercambia la unidad de este producto; no valida su encaje físico.</p>}
    {atLimit&&<p className="unit-note">Límite de planificación alcanzado. No es un límite mecánico.</p>}
  </section>;
}
