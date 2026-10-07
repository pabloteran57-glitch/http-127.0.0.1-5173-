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
import assemblyProfileContent from "../../data/assembly-profile-content.json";
import connectionReviewManifest from "../../data/connection-reviews.json";
import modelAssetManifest from "../../data/model-assets.json";
import type { ModelAsset } from "../lib/model-assets";
import { assessConnection } from "../lib/connections";
import type {
  CablesManifest,
  PartsManifest,
  VariantsManifest,
  LayoutManifest,
  MonitorJoint,
  AssemblyStep,
  LayoutNode,
  Vec3,
  Port,
  PlannerRules,
  AssemblyProfileContent,
  ConnectionReviewManifest,
  ConnectionCheck,
  ElectricalProperties,
} from "../lib/types";

export const partsData = partsManifest as PartsManifest;
export const modelAssets = modelAssetManifest.assets as ModelAsset[];
export const plannerData = plannerRules as PlannerRules;
export const assemblyContent = assemblyProfileContent as AssemblyProfileContent;
export const cablesData = cablesManifest as CablesManifest;
export const variantsData = variantsManifest as VariantsManifest;
export const sourcesData = sourcesManifest;
export const connectionReviewsData: ConnectionReviewManifest = {
  ...connectionReviewManifest, version: 1,
  reviews: connectionReviewManifest.reviews.map(review => ({...review,
    citations: Object.fromEntries(Object.entries(review.citations).filter(([, citation]) => citation !== undefined)),
    checks: review.checks as ConnectionCheck[],
  })),
};
const vector = (values: number[]): Vec3 => {
  if (values.length !== 3 || !values.every(Number.isFinite)) throw new Error("Invalid layout vector");
  return [values[0], values[1], values[2]];
};
const kinds: LayoutNode["kind"][] = ["camera", "lens", "cage", "baseplate", "rods", "matte", "batteryPlate", "battery", "gimbal", "grip", "monitorMount", "monitor", "handle", "audioReceiver", "compactMonitorMount", "handleExtension", "monitorBattery"];
function monitorOverride(raw:{position_mm?:number[];rotation_deg?:number[];parent_id?:string;mass_domain?:string;mount?:string;placement?:string;orientation?:string;rationale?:string;rejected?:string}):Partial<LayoutNode>{
  return {...(raw.position_mm?{position_mm:vector(raw.position_mm)}:{}),...(raw.rotation_deg?{rotation_deg:vector(raw.rotation_deg)}:{}),...(raw.parent_id?{parent_id:raw.parent_id}:{}),...(raw.mass_domain?{mass_domain:raw.mass_domain==="fixed"?"fixed":"moving"}:{}),...(raw.mount?{mount:raw.mount}:{}),...(raw.placement?{placement:raw.placement}:{}),...(raw.orientation?{orientation:raw.orientation}:{}),...(raw.rationale?{rationale:raw.rationale}:{}),...(raw.rejected?{rejected:raw.rejected}:{})};
}
export const layoutData: LayoutManifest = {
  ...layoutManifest,
  battery_plate_slide:{...layoutManifest.battery_plate_slide,rod_axis_local:vector(layoutManifest.battery_plate_slide.rod_axis_local)},
  monitor_joints: Object.fromEntries(Object.entries(layoutManifest.monitor_joints).map(([id,joint])=>[id,{...joint,tilt_range_deg:[joint.tilt_range_deg[0],joint.tilt_range_deg[1]] as [number,number],swivel_range_deg:[joint.swivel_range_deg[0],joint.swivel_range_deg[1]] as [number,number],tilt_pivot_local_mm:vector(joint.tilt_pivot_local_mm),swivel_pivot_local_mm:vector(joint.swivel_pivot_local_mm)} satisfies MonitorJoint])),
  monitor_mount_routes: Object.fromEntries(Object.entries(layoutManifest.monitor_mount_routes).map(([id,route])=>[id,{label:route.label,overrides:Object.fromEntries(Object.entries(route.overrides).map(([partId,override])=>[partId,monitorOverride(override)]))}])),
  nodes: layoutManifest.nodes.map(node => {
    const kind = kinds.find(kind => kind === node.kind);
    if (!kind) throw new Error(`Invalid layout kind: ${node.kind}`);
    return { ...node, kind, vertical_frame: "vertical_frame" in node && node.vertical_frame === "camera" ? "camera" : undefined, mounting_points: "mounting_points" in node ? node.mounting_points?.map(point=>({...point,local_position_mm:vector(point.local_position_mm),rotation_deg:vector(point.rotation_deg),size_xyz_mm:vector(point.size_xyz_mm)})) : undefined, position_mm: vector(node.position_mm), size_xyz_mm: vector(node.size_xyz_mm), explode_mm: vector(node.explode_mm), rotation_deg: vector(node.rotation_deg),
      articulated_subassemblies: "articulated_subassemblies" in node ? Object.fromEntries(Object.entries(node.articulated_subassemblies??{}).filter((entry):entry is [string,string[]]=>Array.isArray(entry[1]))) : undefined,
      envelope: node.envelope === "verified" ? "verified" : "approximate",
      mass_domain: node.mass_domain === "moving" ? "moving" : "fixed" };
  }),
};
export const assemblySteps = assemblyManifest.steps as AssemblyStep[];
export const portsData: Port[] = portsManifest.ports.map(port => ({...port, electrical: port.electrical as ElectricalProperties | undefined, local_position_mm: port.local_position_mm ? vector(port.local_position_mm) : null}));
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

export const connectionAssessmentById = Object.fromEntries(cablesData.cables.map(cable => [cable.cable_id,
  assessConnection(cable, connectionReviewsData, {catalog_revision: plannerRules.catalog_revision, parts: partsData.parts, ports: portsData, sources: sourcesData.sources}),
]));
