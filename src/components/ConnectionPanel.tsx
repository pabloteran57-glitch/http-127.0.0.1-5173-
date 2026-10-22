import { cableById, cablesData, portById, partById, layoutData, connectionAssessmentById, connectionReviewsData } from "../data";
import { cableForVariant } from "../lib/viewer";
import type { Variant } from "../lib/types";
import { connectionKind, connectionName, connectorName, partName } from "../lib/ui";
import Icon from "./Icon";
import { publicDemo } from "../lib/publication";
import type { UnitGraph } from "../lib/unit-graph";
import SetupValidation from "./SetupValidation";
import type {SetupValidation as ValidationResult} from "../lib/setup-validation";
export { connectionName } from "../lib/ui";
export default function ConnectionPanel({variant,bench,selectedId,onSelect,unitGraph,validation,onReview}:{variant:Variant;bench:boolean;selectedId:string;onSelect:(id:string)=>void;unitGraph?:UnitGraph;validation?:ValidationResult;onReview?:()=>void}) {
  const ids=bench?cablesData.profiles.requested_dual_feed_bench:variant.cable_profile_ids;
  const sourceCable=cableById[ids.includes(selectedId)?selectedId:ids[0]];
  const selected=sourceCable?(bench?sourceCable:cableForVariant(sourceCable,variant)):undefined;
  const review=selected?connectionAssessmentById[selected.cable_id]:null;
  const binding=bench?undefined:unitGraph?.links.find(link=>link.cable_id===selected?.cable_id&&link.state==="candidate");
  const fromUnit=binding&&unitGraph?.units.find(unit=>unit.id===binding.from.unit_id),toUnit=binding&&unitGraph?.units.find(unit=>unit.id===binding.to.unit_id),sourceUnit=binding&&unitGraph?.units.find(unit=>unit.id===binding.source_unit_id);
  const documentedCount=review?.checks.filter(check=>check.state==="documented").length??0;
  const hasVisualRoute=selected?.display_kind==="cable"&&[selected.from_port_id,selected.to_port_id].every(id=>portById[id].local_position_mm&&layoutData.nodes.some(n=>n.id===portById[id].part_id&&variant.active_part_ids.includes(n.id)));
  const choose=(id:string)=>onSelect(id);
  return <aside className="connection-panel" aria-label="Conexiones del perfil">
    <div className="panel-heading"><h2>{bench?"Doble HDMI":"Conexiones"}</h2><span className="mono">{ids.length} enlaces</span></div>
    {!bench&&validation&&onReview&&<SetupValidation result={validation} onReview={onReview}/>}
    {ids.length>0&&<><p className="connection-list-heading">Elegir conexión</p><div className="connection-list">{ids.map(id=>{
      const c=cableById[id];const color=cablesData.color_coding[c.type==="data"?"control":c.type];
      return <button key={id} className={selected?.cable_id===id?"connection-choice chosen":"connection-choice"} onClick={()=>choose(id)} aria-pressed={selected?.cable_id===id} style={{borderLeftColor:color}}>
        <small>{connectionKind(c.type)}{c.display_kind!=="cable"?" · Sin cable externo":""}</small><strong>{connectionName(id)}</strong>
      </button>;
    })}</div></>}
    {selected&&<div tabIndex={-1} className="connection-focus" aria-live="polite">
      <p className="connection-category" style={{color:cablesData.color_coding[selected.type==="data"?"control":selected.type]}}>{connectionKind(selected.type)} <span>{selected.display_kind==="cable"?"Cable":selected.display_kind==="contacts"?"Contactos":"Batería interna"}</span></p>
      <h3>{connectionName(selected.cable_id)}</h3>
      <div className="endpoint-card" data-endpoint="A" data-unit-id={fromUnit?.id}><span className="endpoint-letter">A</span><div><strong>{partName(selected.from_part_id)}</strong>{fromUnit&&<b className="connection-unit-label">{fromUnit.label}</b>}<p>{portById[selected.from_port_id].label}</p><small>{connectorName(selected.connector_a)}</small></div></div>
      <div className="endpoint-card" data-endpoint="B" data-unit-id={toUnit?.id}><span className="endpoint-letter">B</span><div><strong>{partName(selected.to_part_id)}</strong>{toUnit&&<b className="connection-unit-label">{toUnit.label}</b>}<p>{portById[selected.to_port_id].label}</p><small>{connectorName(selected.connector_b)}</small></div></div>
      {sourceUnit&&<p className="connection-unit-source" data-source-unit-id={sourceUnit.id}>Referencia elegida para este enlace: <b>{partName(sourceUnit.part_id)} / {sourceUnit.label}</b>. Revisa el cable físico; un cable incluido en un kit no se convierte en otra unidad de catálogo.</p>}
      {review&&<section className={`connection-review ${review.state}`} aria-label="Revisión de la conexión">
        <div className="review-heading"><strong>{review.state==="blocked"?"No conectar":review.reviewed?"Requiere comprobación":"Revisión pendiente"}</strong>{review.reviewed&&<span>{documentedCount} {documentedCount===1?"dato documentado":"datos documentados"}</span>}</div>
        <p>{review.action}</p>
        {review.reviewed&&<details><summary>Ver comprobaciones ({review.checks.length})</summary>
          <ul className="connection-checks">{review.checks.map(check=><li key={check.id}>
            <div><strong>{check.label}</strong><span className={`check-state ${check.state}`}>{check.state==="documented"?"Documentado":check.state==="blocked"?"Incompatible":"Por comprobar"}</span></div>
            <p>{check.detail}</p>
            {check.source_ids.map(id=>{const source=review.sources.find(source=>source.id===id);return source?<a key={id} href={source.url} target="_blank" rel="noreferrer">Fuente oficial: {new URL(source.url).hostname}<Icon name="arrow"/></a>:null;})}
          </li>)}</ul>
          <p className="review-limit">Revisión documental, no ensayo físico ni autorización para energizar.</p>
        </details>}
      </section>}
      {!bench&&hasVisualRoute&&<button className="show-route-button" onClick={()=>document.querySelector(".rig-stage")?.scrollIntoView({block:"start"})}>Ver ruta en el rig<Icon name="arrow"/></button>}
      <details><summary>Especificaciones y seguridad</summary><p><b>Señal / tensión:</b> {selected.voltage_or_signal_standard}</p><p><b>Longitud:</b> {selected.ideal_length_estimate}</p><p><b>Recorrido:</b> {selected.routing_path}</p><p><b>Alivio de tensión:</b> {selected.strain_relief_requirement}</p><p className="risk-text">{selected.risk_notes.join(" ")}</p><a href={partById[selected.source_part_id].primary_source_url} target="_blank" rel="noreferrer">Referencia de fabricante</a></details>
    </div>}
    {ids.length===0&&<div className="connection-empty"><Icon name="connect"/><h3>Aún no hay conexiones</h3><p>Elige componentes y sus cables en Editar piezas. Sólo aparecen circuitos con ambos extremos disponibles.</p></div>}
    <p className="panel-footnote">{bench?"Circuito estático. Distribuidor con fuente 5 V / 2 A. No hay soporte validado en el rig.":`Puertos identificados; geometría y curvas aproximadas. ${connectionReviewsData.reviews.length} circuitos con revisión ampliada; no certifica el conjunto.`}</p>
  </aside>;
}

export function SplitFeedDiagram({selectedId,onSelect}:{selectedId:string;onSelect:(id:string)=>void}) {
  return <div className="bench-diagram"><p className="eyebrow">TOPOLOGÍA SOLICITADA / NO ES UN MONTAJE EN GIMBAL</p><h2>Un HDMI. Dos destinos.</h2>
    <div className="split-tree"><button onClick={()=>onSelect("vid-fx3-to-startech-splitter")} aria-pressed={selectedId==="vid-fx3-to-startech-splitter"}><small>SONY FX3</small><strong>Salida HDMI</strong><span>Tipo A hembra</span></button><div className="flow-arrow">→<small>Cable cautivo A macho</small></div><div className="splitter-node"><small>ST122HD4KU</small><strong>DISTRIBUIDOR 1 → 2</strong><span>Entrada: cable integrado</span></div><div className="branch-destinations"><button onClick={()=>onSelect("vid-splitter-to-smallhd")} aria-pressed={selectedId==="vid-splitter-to-smallhd"}><small>Salida 1 → HDMI A-A</small><strong>Indie 7 / entrada HDMI J</strong><span>Tipo A hembra</span></button><button onClick={()=>onSelect("vid-splitter-to-raveneye")} aria-pressed={selectedId==="vid-splitter-to-raveneye"}><small>Salida 2 → HDMI A-C</small><strong>RavenEye / entrada Mini HDMI</strong><span>Tipo C hembra</span></button></div></div>
    <div className="bench-supplies"><button onClick={()=>onSelect("pwr-ac-to-splitter")}>Adaptador incluido → distribuidor <b>5 V / 2 A</b></button><button onClick={()=>onSelect("pwr-raveneye-internal")}>RavenEye <b>Batería interna</b></button><button onClick={()=>onSelect("pwr-plate-to-smallhd")}>V-mount / 3203B → Indie 7 <b>D-Tap → entrada DC I</b></button><button onClick={()=>onSelect("pwr-vmount-to-fx3-dummy")}>V-mount → FX3 <b>4253B / 8.0–8.4 V regulados</b></button></div>
    <p>Configurar una señal progresiva 1080p compatible con ambos destinos y verificar EDID. No se presupone conversión de 4K a 1080p.</p>
    {!publicDemo&&<img src="/references/smallhd-indie-7-3.png" alt="Diagrama oficial de puertos Indie 7: J HDMI IN, K HDMI OUT, I DC IN" className="port-guide"/>}
    <a href="https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide" target="_blank" rel="noreferrer">Referencia de puertos SmallHD</a>
  </div>;
}
