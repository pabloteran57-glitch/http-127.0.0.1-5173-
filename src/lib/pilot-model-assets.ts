import type { ModelAsset } from "./model-assets";

export interface PilotModelAsset extends ModelAsset {
  references: string[];
  image: { path: string; sha256: string; bytes: number; width: number; height: number };
}
export interface PilotProduct {
  id: string; exact_product_name: string; model_number: string;
  release_status: string; weight_g: number; weight_approximate: boolean;
  dimensions: { width_mm?: number; height_mm?: number; depth_mm?: number; diameter_mm?: number; length_mm?: number; approximate: boolean };
}
export function pilotModelIssues(asset: PilotModelAsset, product: PilotProduct | undefined): string[] {
  const issues: string[] = [];
  if (!product || product.release_status !== "research_only" || asset.part_id !== product.id || asset.exact_product_name !== product.exact_product_name || asset.model_number !== product.model_number || asset.id !== `${product.id}-pilot-v1` || asset.subcomponent_id !== null) issues.push("Identidad de investigación incorrecta");
  if (asset.status !== "approved" || asset.source.method !== "manual" || asset.review.ports_authority !== "catalog-intake.json" || asset.review.mechanical_accuracy !== "approximate") issues.push("Modelo no revisado para investigación aislada");
  if (asset.artifact.path !== `/models/${asset.id}.glb` || asset.image.path !== `/product-visuals/${asset.id}.webp`) issues.push("Ruta de recurso no permitida");
  if (![asset.artifact.sha256, asset.image.sha256].every(hash => /^[a-f0-9]{64}$/.test(hash))) issues.push("Huella no válida");
  if (!Number.isInteger(asset.artifact.bytes) || asset.artifact.bytes <= 0 || asset.artifact.bytes > 1_500_000 || !Number.isInteger(asset.artifact.triangles) || asset.artifact.triangles <= 0 || asset.artifact.triangles > 50_000 || !Number.isInteger(asset.image.bytes) || asset.image.bytes <= 0 || asset.image.bytes > 16_000 || asset.image.width !== 400 || asset.image.height !== 280) issues.push("Presupuesto o dimensiones de recurso no válidos");
  if (asset.calibration.units !== "metres" || asset.calibration.uniform_scale !== 1 || [...asset.calibration.offset_mm, ...asset.calibration.rotation_deg].some(value => value !== 0) || asset.calibration.bounds_mm.length !== 3 || !asset.calibration.bounds_mm.every(value => Number.isFinite(value) && value > 0)) issues.push("Escala aislada no válida");
  const https = (value: string) => { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } };
  if (![asset.source.url, asset.rights.evidence_url, asset.calibration.reference_url, ...asset.references].every(https) || !asset.references.length || !asset.source.author.trim()) issues.push("Procedencia incompleta");
  if (!asset.review.identity || !asset.review.scale || !asset.review.views || !asset.review.interfaces || asset.review.evidence.length < 20 || asset.calibration.reference_basis.length < 20) issues.push("Revisión incompleta");
  if (asset.rights.license !== "custom-reviewed" || !asset.rights.commercial || !asset.rights.redistribution || !asset.rights.modification || asset.rights.source_images_authorized || asset.rights.source_images_evidence.length < 20 || !asset.rights.attribution || !/^\d{4}-\d{2}-\d{2}$/.test(asset.rights.reviewed_on)) issues.push("Derechos propios sin revisar");
  return issues;
}
