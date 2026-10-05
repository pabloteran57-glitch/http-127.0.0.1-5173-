import partsManifest from "../../data/parts-manifest.json";
import cablesManifest from "../../data/cables-manifest.json";
import variantsManifest from "../../data/variants.json";
import sourcesManifest from "../../data/sources.json";
import layoutManifest from "../../data/layout-manifest.json";
import assemblyManifest from "../../data/assembly-guide.json";
import portsManifest from "../../data/ports-manifest.json";
import referenceManifest from "../../data/geometry-references.json";
import geometryAudit from "../../data/geometry-audit.json";
import plannerRules from "../../data/planner-rules.json";
import type {
  CablesManifest,
  PartsManifest,
  VariantsManifest,
  LayoutManifest,
  AssemblyStep,
  LayoutNode,
  Vec3,
  Port,
  PlannerRules,
} from "../lib/types";

export const partsData = partsManifest as PartsManifest;
export const plannerData = plannerRules as PlannerRules;
export const cablesData = cablesManifest as CablesManifest;
export const variantsData = variantsManifest as VariantsManifest;
export const sourcesData = sourcesManifest;
const vector = (values: number[]): Vec3 => {
  if (values.length !== 3 || !values.every(Number.isFinite)) throw new Error("Invalid layout vector");
  return [values[0], values[1], values[2]];
};
const kinds: LayoutNode["kind"][] = ["camera", "lens", "cage", "baseplate", "rods", "matte", "batteryPlate", "battery", "gimbal", "grip", "monitorMount", "monitor", "handle"];
export const layoutData: LayoutManifest = {
  ...layoutManifest,
  nodes: layoutManifest.nodes.map(node => {
    const kind = kinds.find(kind => kind === node.kind);
    if (!kind) throw new Error(`Invalid layout kind: ${node.kind}`);
    return { ...node, kind, position_mm: vector(node.position_mm), size_xyz_mm: vector(node.size_xyz_mm), explode_mm: vector(node.explode_mm), rotation_deg: vector(node.rotation_deg),
      envelope: node.envelope === "verified" ? "verified" : "approximate",
      mass_domain: node.mass_domain === "moving" ? "moving" : "fixed" };
  }),
};
export const assemblySteps = assemblyManifest.steps as AssemblyStep[];
export const portsData: Port[] = portsManifest.ports.map(port => ({...port, local_position_mm: port.local_position_mm ? vector(port.local_position_mm) : null}));
export const portById = Object.fromEntries(portsData.map(port => [port.id, port]));
export const referencesData = referenceManifest;
export const geometryAuditData = geometryAudit;
export const referenceById = Object.fromEntries(geometryAudit.references.map(ref => [ref.part_id, ref]));

export const partById = Object.fromEntries(
  partsData.parts.map((part) => [part.id, part]),
);

export const cableById = Object.fromEntries(
  cablesData.cables.map((cable) => [cable.cable_id, cable]),
);
