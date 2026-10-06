import { layoutData, partById, referenceById } from "../data";
import type { Variant } from "../lib/types";
import { partName } from "../lib/ui";
import { formatNumber } from "../lib/format";
import { publicDemo } from "../lib/publication";
import { officialVisualLink } from "./ProductVisual";

export default function PartInspector({ selectedId, variant }: { selectedId: string; variant: Variant }) {
  const part = partById[selectedId];
  const node = layoutData.nodes.find(n => n.id === selectedId);
  const ref = referenceById[selectedId];
  if (!part) return null;
  const active = variant.active_part_ids.includes(part.id);
  const visualLink = officialVisualLink(part.id);
  const dimensions = [part.verified_dimensions_mm.length,part.verified_dimensions_mm.width,part.verified_dimensions_mm.height];
  return <aside id="part-inspector" className="inspector" aria-label="Ficha de la pieza">
    <div className="inspector-top"><span className="eyebrow">PIEZA SELECCIONADA</span><span className={active ? "status active" : "status parked"}>{active ? "EN PLAN" : "MONTAJE PENDIENTE"}</span></div>
    <div className="product-reference">{publicDemo ? <div className="reference-pending">Referencia del fabricante<a href={visualLink.href} target="_blank" rel="noreferrer">{visualLink.label}</a><span>Imágenes conservadas en investigación local</span></div> : ref ? <a href={ref.display_image} target="_blank" rel="noreferrer" aria-label="Ampliar referencia oficial"><img src={ref.display_image} alt={partName(part.id) + ", referencia del fabricante"} /></a> : <div className="reference-pending">Referencia visual pendiente<span>No se sustituye por una imagen inventada</span></div>}<span>{publicDemo ? "FUENTES OFICIALES / NO ES CAD CERTIFICADO" : "REFERENCIA REAL / NO ES EL MODELO 3D"}</span></div>
    <p className="part-brand">{part.brand} / {part.model_number ?? "Fabricante"}</p><h2>{node?.label ?? partName(part.id)}</h2>
    <div className="spec-pair"><div><span>MASA PUBLICADA</span><strong>{part.category==="software" ? "No aplica" : part.verified_weight_g.value===null ? "Pendiente" : `${part.verified_weight_g.approximate?"~ ":""}${formatNumber(part.verified_weight_g.value)} g`}</strong></div><div><span>DOMINIO DE CARGA</span><strong>{node ? node.mass_domain==="moving" ? "Cámara móvil" : "Base fija" : "No modelado"}</strong></div></div>
    <p className="dimension-note">{part.category==="software" ? "Sin geometría física" : dimensions.some(v=>v===null) ? "Dimensiones completas pendientes" : `${dimensions.map(v=>v===null?"?":formatNumber(v)).join(" × ")} mm${part.verified_dimensions_mm.approximate?" aprox.":""}`}<br />Envolvente publicada; forma y posición 3D aproximadas.</p>
    {!active&&<p className="piece-inspector-pending">Elegida y conservada en tu rig. El montaje actual no tiene una cadena activa; revisa soporte, contexto y pendientes antes de instalarla.</p>}
    {node && <div className="mount-summary"><span className="eyebrow">{active?"MONTAJE CANDIDATO":"MONTAJE POR RESOLVER"}</span>{active&&node.parent_id && variant.active_part_ids.includes(node.parent_id) && <p className="mount-parent">Sobre {partName(node.parent_id)}</p>}<details><summary>Interfaz y orientación</summary><p>{node.mount}</p></details></div>}
    <details className="inspector-details"><summary>Medidas, materiales y fuentes</summary><p><b>Nombre oficial del fabricante:</b> {part.exact_product_name}</p><p>{part.verified_dimensions_mm.note}</p><p>{part.verified_weight_g.note}</p><p><b>Material:</b> {part.likely_material}</p><a href={node?.dimension_source_url??part.primary_source_url} target="_blank" rel="noreferrer">Medidas publicadas</a><a href={part.primary_source_url} target="_blank" rel="noreferrer">Fabricante</a>{part.secondary_source_url && <a href={part.secondary_source_url} target="_blank" rel="noreferrer">Confirmación secundaria</a>}</details>
    <details className="inspector-details"><summary>Puertos y restricciones</summary><ul>{part.ports_interfaces.map(port=><li key={port}>{port}</li>)}</ul><p>{part.physical_constraints.join(" ")}</p>{node && <p>Evitar: {node.rejected}</p>}</details>
  </aside>;
}
