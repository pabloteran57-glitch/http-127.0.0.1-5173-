import type { LayoutNode, Part, Vec3 } from "./types";

export interface ModelAsset {
  id: string;
  part_id: string;
  subcomponent_id: string | null;
  exact_product_name: string;
  model_number: string | null;
  status: "quarantine" | "approved";
  source: { method: "official_cad" | "community" | "ai" | "manual"; url: string; author: string };
  rights: {
    license: string; evidence_url: string; reviewed_on: string;
    commercial: boolean; redistribution: boolean; modification: boolean;
    source_images_authorized: boolean; source_images_evidence: string; attribution: string;
  };
  artifact: { path: string; sha256: string; bytes: number; triangles: number };
  calibration: {
    units: "metres"; uniform_scale: number; offset_mm: Vec3; rotation_deg: Vec3;
    bounds_mm: Vec3; reference_url: string; reference_basis: string;
  };
  review: {
    identity: boolean; scale: boolean; views: boolean; interfaces: boolean;
    evidence: string; mechanical_accuracy: "approximate"; ports_authority: "ports-manifest.json" | "catalog-intake.json";
  };
}

export const MODEL_LIMITS = { bytes: 1_500_000, triangles: 50_000 };
const https = (s: string) => { try { const u = new URL(s); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } };
const vector = (v: number[]) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite);

// Licencia y escala declaradas necesitan evidencia revisada; no certifican la mecánica.
export function modelIssues(asset: ModelAsset, part: Part | undefined, node: LayoutNode | undefined): string[] {
  const issues: string[] = [];
  const component = part?.subcomponents?.find(c => c.id === node?.subcomponent_id);
  if (!part || !node || asset.part_id !== part.id || asset.exact_product_name !== part.exact_product_name || asset.subcomponent_id !== (node.subcomponent_id ?? null) || asset.model_number !== (component?.model ?? part.model_number)) issues.push("Identidad, revisión o subcomponente distintos del catálogo");
  if (asset.status !== "approved") issues.push("Recurso en cuarentena");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(asset.id) || asset.artifact.path !== `/models/${asset.id}.glb`) issues.push("Ruta GLB local no permitida");
  if (!["official_cad", "community", "ai", "manual"].includes(asset.source.method) || !https(asset.source.url) || !asset.source.author.trim()) issues.push("Origen o autor sin documentar");
  const rights = asset.rights;
  if (!["CC0-1.0", "CC-BY-4.0", "custom-reviewed"].includes(rights.license) || !https(rights.evidence_url) || !/^\d{4}-\d{2}-\d{2}$/.test(rights.reviewed_on) || !rights.commercial || !rights.redistribution || !rights.modification || !rights.attribution.trim()) issues.push("Derechos, revisión o atribución pendientes");
  if (asset.source.method === "ai" && (!rights.source_images_authorized || rights.source_images_evidence.trim().length < 20)) issues.push("Fotografías sin autorización/evidencia de transformación IA");
  const file = asset.artifact;
  if (!/^[a-f0-9]{64}$/.test(file.sha256) || !Number.isInteger(file.bytes) || file.bytes <= 0 || file.bytes > MODEL_LIMITS.bytes || !Number.isInteger(file.triangles) || file.triangles <= 0 || file.triangles > MODEL_LIMITS.triangles) issues.push("Huella o presupuesto web no válido");
  const c = asset.calibration;
  if (c.units !== "metres" || !Number.isFinite(c.uniform_scale) || c.uniform_scale <= 0 || !vector(c.offset_mm) || !vector(c.rotation_deg) || !vector(c.bounds_mm) || c.bounds_mm.some(v => v <= 0) || !https(c.reference_url) || c.reference_basis.trim().length < 12) issues.push("Escala uniforme, ejes, cotas o base de referencia pendientes");
  const review = asset.review;
  if (!review.identity || !review.scale || !review.views || !review.interfaces || review.evidence.trim().length < 20 || review.mechanical_accuracy !== "approximate" || review.ports_authority !== "ports-manifest.json") issues.push("Revisión visual/escala incompleta o autoridad mecánica indebida");
  return issues;
}

export function approvedModelFor(node: LayoutNode, part: Part, assets: ModelAsset[]): ModelAsset | null {
  const matches = assets.filter(a => a.part_id === node.id && a.subcomponent_id === (node.subcomponent_id ?? null) && a.status === "approved");
  return matches.length === 1 && modelIssues(matches[0], part, node).length === 0 ? matches[0] : null;
}
