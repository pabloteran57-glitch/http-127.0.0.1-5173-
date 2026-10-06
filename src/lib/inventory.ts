import type { Part, Variant } from "./types";

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function inventoryEntries(parts: Part[], variant: Variant, chosenIds: string[], scope: "rig" | "catalog", query: string, nameOf: (id: string) => string) {
  const chosen = new Set(chosenIds);
  const active = new Set(variant.active_part_ids);
  const search = normalizeSearch(query);
  return parts.filter(part => (scope === "catalog" || chosen.has(part.id)) && normalizeSearch(`${part.exact_product_name} ${part.model_number ?? ""} ${part.brand} ${nameOf(part.id)}`).includes(search))
    .map(part => ({part, state: chosen.has(part.id) ? active.has(part.id) ? "active" as const : "pending" as const : "unchosen" as const}));
}
