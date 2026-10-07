import type { ModelAsset } from "./model-assets";

export interface ProductVisualAsset {
  id: string; part_id: string; subcomponent_id: string | null; model_sha256: string;
  status: string; method: string; caption: string; reviewed_on: string | null;
  image: { path: string; sha256: string; bytes: number; width: number; height: number };
}

export function approvedProductVisual(partId: string, model: ModelAsset | null, visuals: ProductVisualAsset[]): ProductVisualAsset | null {
  if (!model || model.status !== "approved" || model.part_id !== partId || !model.rights.redistribution || !model.rights.modification) return null;
  const matches = visuals.filter(visual => visual.part_id === partId && visual.status === "approved");
  if (matches.length !== 1) return null;
  const visual = matches[0], image = visual.image;
  if (visual.id !== model.id || visual.subcomponent_id !== model.subcomponent_id || visual.model_sha256 !== model.artifact.sha256 || visual.method !== "rendered_approved_mesh") return null;
  if (image.path !== `/product-visuals/${model.id}.webp` || !/^[a-f0-9]{64}$/.test(image.sha256) || !Number.isInteger(image.bytes) || image.bytes <= 0 || image.bytes > 16_000) return null;
  if (image.width !== 400 || image.height !== 280 || !/^\d{4}-\d{2}-\d{2}$/.test(visual.reviewed_on ?? "") || !visual.caption.includes("aprox")) return null;
  return visual;
}
