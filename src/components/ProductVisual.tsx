import { useState } from "react";
import { layoutData, modelAssets, partById, referenceById, referencesData } from "../data";
import visualRegistry from "../../data/product-visuals.json";
import { approvedModelFor } from "../lib/model-assets";
import { approvedProductVisual } from "../lib/product-visuals";
import { publicDemo } from "../lib/publication";
import { partName } from "../lib/ui";

export function officialVisualLink(id: string) {
  const reference = referenceById[id];
  const media = referencesData.parts.find(part => part.id === id)?.images.find(image => image.url === reference?.source_url && image.local_path === reference?.display_image && image.content_type.startsWith("image/"));
  const photo = reference?.review === "visual_identity_checked" && !!media;
  const href = reference?.source_url ?? partById[id].primary_source_url;
  return {href, label: photo ? "Ver foto oficial" : /\.pdf(?:\?|$)/i.test(href) ? "Ver referencia oficial" : "Ver producto oficial"};
}

// Pictogramas de categoría: no contienen cotas, roscas ni anclajes de producto.
function CategoryDrawing({category}: {category: string}) {
  switch (category) {
    case "camera body": return <><path d="M28 38h70l12 12h17v39H28Z"/><path d="M45 38V27h32v11M114 53v28"/><circle cx="76" cy="64" r="26"/><circle cx="76" cy="64" r="19"/><circle cx="76" cy="64" r="11"/><path d="M32 44h13M119 56v18"/></>;
    case "lens": return <><path d="M47 23h59l8 9v61H38V32Z"/><path d="M39 38h74M39 47h74M39 79h74M39 88h74"/>{[46,54,62,70,78,86,94,102].map(x=><path key={x} d={`M${x} 49v27`}/>)}<ellipse cx="76" cy="24" rx="29" ry="7"/></>;
    case "gimbal bundle": return <><path d="M53 97V76h22v21M57 76V63h22V42h39V20H83v16H62"/><circle cx="63" cy="54" r="10"/><circle cx="111" cy="24" r="9"/><path d="M68 62h20M83 18H52v18h31M61 38h33M86 36v8"/></>;
    case "gimbal power": return <><rect x="61" y="13" width="31" height="87" rx="9"/><path d="M65 23h23M66 80h20M66 86h20M66 40v27M72 16h9"/></>;
    case "camera cage": return <><path d="M28 28h93v63H28ZM37 36h72v46H37Z"/><path d="M114 40v34M43 90v7h61v-7M34 31h9M56 31h9M81 31h9M105 31h9"/></>;
    case "baseplate": return <><path d="m34 37 70-6 16 17-70 7Z M34 37v34l16 15 70-8V48M50 55v31"/><circle cx="72" cy="67" r="8"/><circle cx="105" cy="64" r="8"/><path d="m55 40 45-4"/></>;
    case "rods": return <><path d="m38 90 61-69M57 95l61-69" strokeWidth="9"/><path d="m38 90 61-69M57 95l61-69" stroke="var(--visual-detail)" strokeWidth="2"/></>;
    case "matte box": return <><path d="M26 36h102v53H26ZM40 48h74v30H40ZM26 36l13-16h76l13 16"/><path d="M119 51h12v18h-12M33 87h90"/></>;
    case "monitor mount": return <><path d="M28 60h18v19H28ZM46 67h48v-9h29v12H94v8H46Z"/><circle cx="106" cy="64" r="7"/><path d="M105 49v9M34 60V47h14M36 79v8"/></>;
    case "monitor": return <><rect x="23" y="25" width="111" height="65" rx="7"/><rect x="31" y="33" width="95" height="48" rx="3"/><path d="m35 70 25-20 17 12 18-18 27 24M61 85h35"/></>;
    case "battery": return <><rect x="51" y="16" width="54" height="82" rx="9"/><rect x="67" y="34" width="24" height="17" rx="3"/><path d="M60 22h36M60 86h36M65 64h25M76 64v13"/></>;
    case "battery plate": return <><rect x="49" y="26" width="61" height="71" rx="4"/><path d="M40 16h78v17H40Z M61 50h35l-17 26ZM58 88h43"/><circle cx="55" cy="25" r="5"/><circle cx="101" cy="25" r="5"/></>;
    case "audio handle": return <><path d="M28 37h41v24H28ZM69 43h54v11H69ZM40 61v23h18V61M119 54v25"/><circle cx="39" cy="48" r="5"/><circle cx="56" cy="48" r="5"/></>;
    case "wireless audio": return <><rect x="28" y="31" width="24" height="45" rx="5"/><rect x="64" y="31" width="24" height="45" rx="5"/><rect x="100" y="30" width="30" height="47" rx="5"/><path d="M32 82h96v11H32M106 41h18v15M35 40h10M71 40h10"/></>;
    case "lavalier microphone": return <><circle cx="59" cy="27" r="8"/><path d="M55 37v20c0 18 58 3 58 27s-74 18-74-3M35 70v-8h8v8"/></>;
    case "software": return <><rect x="51" y="14" width="53" height="85" rx="8"/><rect x="58" y="27" width="39" height="57" rx="3"/><path d="M68 44h18v17H68M70 89h15M72 20h11"/></>;
    case "power cable": case "video cable": case "control cable": return <><path d="M35 42v18c0 16 32 0 32 15s-23 16-23 0 42-14 42 0-19 14-19 0 48-4 48-27"/><path d="M27 25h16v17H27ZM106 27h18v20h-18ZM31 20h8v5M110 22h10v5"/></>;
    case "focus motor": return <><circle cx="75" cy="51" r="24"/><circle cx="75" cy="51" r="15"/><path d="M57 74v21h36V74M43 41h-9v21h9M92 31l15-11 13 16-13 9"/></>;
    case "focus sensor": return <><rect x="37" y="33" width="82" height="36" rx="7"/><circle cx="59" cy="50" r="9"/><circle cx="94" cy="50" r="9"/><path d="M68 69v14h23V69"/></>;
    default: return <><rect x="33" y="33" width="90" height="49" rx="7"/><path d="M43 44h34M43 51h34M43 58h34M102 40v32M93 87h23"/></>;
  }
}

export default function ProductVisual({id, caption = true}: {id: string; caption?: boolean}) {
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const markFailed=(key:string)=>setFailedIds(previous=>previous.includes(key)?previous:[...previous,key]);
  const part = partById[id], reference = referenceById[id];
  const node=layoutData.nodes.find(n=>n.id===id),model=node?approvedModelFor(node,part,modelAssets):null;
  const visual=approvedProductVisual(id,model,visualRegistry.assets);
  const ownKey=visual?.image.sha256;
  const useModel=!!visual&&!failedIds.includes(ownKey!);
  const usePhoto = !useModel&&!publicDemo && reference?.review === "visual_identity_checked" && !failedIds.includes(id);
  return <div className={`product-visual ${useModel?"is-model":usePhoto ? "is-photo" : "is-schematic"}`} data-visual-kind={useModel?"authored-model":usePhoto ? "official-local" : "category-schematic"}>
    {useModel?<img src={visual.image.path} width={400} height={280} alt={`${partName(id)}, modelo propio aproximado${visual.subcomponent_id?", sólo receptor RX":""}`} loading="lazy" decoding="async" onError={()=>markFailed(ownKey!)}/>:usePhoto ? <img src={reference.display_image} alt={`${partName(id)}, referencia oficial revisada`} loading="lazy" decoding="async" onError={() => markFailed(id)}/> : <svg viewBox="0 0 160 110" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><CategoryDrawing category={part.category}/></svg>}
    {caption && <span>{useModel?visual.caption:usePhoto ? "Referencia oficial local" : part.category === "software" ? "Esquema de aplicación" : "Esquema · no es foto"}</span>}
  </div>;
}
