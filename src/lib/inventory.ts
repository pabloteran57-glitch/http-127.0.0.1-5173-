import type { Part, Variant } from "./types";

export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function builderEntries(parts: Part[], chosenIds: string[], categories: {id: string; part_ids: string[]}[], scope: "catalog" | "selected", category: string, query: string, nameOf: (id: string) => string) {
  const search = normalizeSearch(query);
  const ids = scope === "selected" ? chosenIds : search || category === "all" ? [...new Set(categories.flatMap(item => item.part_ids))] : categories.find(item => item.id === category)?.part_ids ?? [];
  const byId = new Map(parts.map(part => [part.id, part]));
  return ids.map(id => byId.get(id)).filter((part): part is Part => !!part && normalizeSearch(`${part.exact_product_name} ${part.model_number ?? ""} ${part.brand} ${nameOf(part.id)}`).includes(search));
}

export function inventoryEntries(parts: Part[], variant: Variant, chosenIds: string[], scope: "rig" | "catalog", query: string, nameOf: (id: string) => string) {
  const chosen = new Set(chosenIds);
  const active = new Set(variant.active_part_ids);
  const search = normalizeSearch(query);
  return parts.filter(part => (scope === "catalog" || chosen.has(part.id)) && normalizeSearch(`${part.exact_product_name} ${part.model_number ?? ""} ${part.brand} ${nameOf(part.id)}`).includes(search))
    .map(part => ({part, state: chosen.has(part.id) ? active.has(part.id) ? "active" as const : "pending" as const : "unchosen" as const}));
}
