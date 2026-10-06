import type { LayoutManifest, Part, Variant } from "./types";

export function visibleCableIds(availableIds: string[], showAll: boolean, selectedId: string | null): string[] {
  return availableIds.filter(id => showAll || id === selectedId);
}

// Sólo piezas móviles modeladas; no es una carga completa ni certificada.
export function movingMass(variant: Variant, layout: LayoutManifest, parts: Record<string, Part>) {
  const moving = layout.nodes.filter(n => n.mass_domain === "moving" && variant.active_part_ids.includes(n.id));
  const subtotal=moving.reduce((sum,n)=>sum+(parts[n.id].planning_weight_g??0),0);
  return {
    subtotal,
    estimated: moving.filter(n=>parts[n.id].verified_weight_g.value===null).map(n=>n.id),
    envelopeCentroid: subtotal ? [0,1,2].map(axis=>moving.reduce((sum,n)=>sum+(parts[n.id].planning_weight_g??0)*n.position_mm[axis],0)/subtotal) : null,
    unknown: moving.filter(n => parts[n.id].planning_weight_g === null).length,
    approximate: moving.some(n => parts[n.id].verified_weight_g.approximate),
    excluded: "Leads, RX-only mass, fasteners and plate-stack additions must be weighed. Gimbal and fixed side monitor excluded.",
  };
}
