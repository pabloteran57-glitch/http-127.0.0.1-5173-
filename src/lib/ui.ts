import copy from "../../data/ui-content.json";
import { cableById, partById } from "../data";

const partNames: Record<string, string> = copy.part_names;
const connectors: Record<string, string> = copy.connector_labels;

export function connectorName(value: string) {
  return connectors[value] ?? value;
}

export function partName(id: string | null) {
  return id ? partNames[id] ?? partById[id]?.exact_product_name ?? id : "Adaptador AC";
}

export function connectionName(id: string) {
  const cable = cableById[id];
  if (!cable) return id;
  if (cable.display_kind === "internal") return `${partName(cable.to_part_id)} / batería interna`;
  return `${partName(cable.from_part_id)} → ${partName(cable.to_part_id)}`;
}

export function connectionKind(type: "power" | "video" | "data") {
  return type === "power" ? "Alimentación" : type === "video" ? "Vídeo" : "Control / audio";
}

