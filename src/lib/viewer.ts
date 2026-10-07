import type { Cable, LayoutManifest, LayoutNode, Part, Variant, Vec3 } from "./types";

export function monitorRoute(variant:Variant) {
  return variant.viewer.monitor_mount_route;
}

export function cableForVariant(cable:Cable,variant:Variant):Cable {
  const route=monitorRoute(variant);
  return {...cable,...(route?cable.monitor_route_overrides?.[route]:undefined)};
}

export function layoutForVariant(variant:Variant,layout:LayoutManifest):LayoutManifest {
  const route=monitorRoute(variant);
  const overrides=(route?layout.monitor_mount_routes?.[route]?.overrides:undefined)??{};
  return {...layout,nodes:layout.nodes.map(node=>({...node,...overrides[node.id]}))};
}

export function visibleCableIds(availableIds: string[], showAll: boolean, selectedId: string | null): string[] {
  return availableIds.filter(id => showAll || id === selectedId);
}

export function nodeWeight(node:LayoutNode,part:Part) {
  if(node.subcomponent_id){
    const component=part.subcomponents?.find(c=>c.id===node.subcomponent_id);
    return {value:component?.weight_g??null,approximate:false,published:!!component};
  }
  return {value:part.planning_weight_g,approximate:part.verified_weight_g.approximate,published:part.verified_weight_g.value!==null};
}

// Una pieza unida a la jaula gira con ella, incluidos los anclajes de cable.
export function nodePose(node:LayoutNode,vertical:boolean,exploded=false) {
  const position=node.position_mm.map((v,i)=>v+(exploded?node.explode_mm[i]:0)) as Vec3;
  const rotation=[...node.rotation_deg] as Vec3;
  if(vertical&&node.vertical_frame==="camera"){
    [position[0],position[1]]=[-position[1],position[0]];
    rotation[2]+=90;
  }
  return {position_mm:position,rotation_deg:rotation};
}

export function hiddenSubassemblies(node:LayoutNode,variant:Variant):string[] {
  return (node.visual_subassemblies??[]).filter(rule=>rule.hide_if_any_part_ids.some(id=>variant.active_part_ids.includes(id))).map(rule=>rule.object_name);
}

export function preferredPartId(ids:string[],layout:LayoutManifest):string {
  return ids.find(id=>layout.nodes.some(node=>node.id===id&&node.kind==="camera"))??ids[0]??"";
}

export function routeOffset(offset:Vec3,cameraFrame:boolean,vertical:boolean):Vec3 {
  return cameraFrame&&vertical?[-offset[1],offset[0],offset[2]]:[...offset];
}

// Sólo piezas móviles modeladas; no es una carga completa ni certificada.
export function movingMass(variant: Variant, layout: LayoutManifest, parts: Record<string, Part>) {
  const moving = layoutForVariant(variant,layout).nodes.filter(n => n.mass_domain === "moving" && variant.active_part_ids.includes(n.id));
  const subtotal=moving.reduce((sum,n)=>sum+(nodeWeight(n,parts[n.id]).value??0),0);
  return {
    subtotal,
    estimated: moving.filter(n=>!nodeWeight(n,parts[n.id]).published).map(n=>n.id),
    envelopeCentroid: subtotal ? [0,1,2].map(axis=>moving.reduce((sum,n)=>sum+(nodeWeight(n,parts[n.id]).value??0)*nodePose(n,variant.viewer.mode==="vertical").position_mm[axis],0)/subtotal) : null,
    unknown: moving.filter(n => nodeWeight(n,parts[n.id]).value === null).length,
    approximate: moving.some(n => nodeWeight(n,parts[n.id]).approximate),
    excluded: "Cables, fijaciones y adiciones de la pila pendientes de pesaje. TX y estuche fuera del rig; gimbal y monitor lateral fuera de carga móvil.",
  };
}
