import { useState } from "react";
import { variantsData } from "../data";
import RigPlannerPage from "../views/RigPlannerPage";
export default function App(){
 const [variantId,setVariantId]=useState(variantsData.master_variant_id);
 const [exploded,setExploded]=useState(false);const [showLabels,setShowLabels]=useState(false);const [showCables,setShowCables]=useState(false);
 const variant=variantsData.variants.find(v=>v.id===variantId)??variantsData.variants[0];
 return <RigPlannerPage variant={variant} exploded={exploded} onExplodedChange={setExploded} showLabels={showLabels} onShowLabelsChange={setShowLabels} showCables={showCables} onShowCablesChange={setShowCables} onVariantChange={setVariantId}/>;
}

