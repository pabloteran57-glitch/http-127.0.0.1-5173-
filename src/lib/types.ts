export interface WeightField {
  value: number | null;
  approximate: boolean;
  note: string;
  source_url?: string;
  checked_on?: string;
}

export interface DimensionField {
  length: number | null;
  width: number | null;
  height: number | null;
  approximate: boolean;
  note: string;
}

export interface Part {
  id: string;
  exact_product_name: string;
  model_number: string | null;
  brand: string;
  category: string;
  verified_dimensions_mm: DimensionField;
  verified_weight_g: WeightField;
  planning_weight_g: number | null;
  ports_interfaces: string[];
  mounting_method: string;
  likely_material: string;
  mandatory_or_optional: "mandatory" | "optional";
  rig_role: string;
  physical_constraints: string[];
  primary_source_url: string;
  secondary_source_url: string | null;
  confidence_level: "high" | "medium" | "low";
  bundle_includes?: string[];
  subcomponents?: {id:string;model:string;dimensions_lwh_mm:Vec3;weight_g:number;source_url:string;note:string}[];
}

export interface PartsManifest {
  build_id: string;
  build_name: string;
  verified_on: string;
  notes: string[];
  parts: Part[];
}

export interface Cable {
  monitor_route_overrides?: Record<string, Pick<Cable, "routing_path" | "motion_boundary" | "route_control_offsets_mm" | "route_control_frame">>;
  route_control_frame?: "camera" | "world";
  electrical?: ElectricalProperties;
  from_port_id: string;
  to_port_id: string;
  display_kind: "cable" | "contacts" | "internal";
  route_control_offsets_mm: {a: number[]; b: number[]} | null;
  cable_id: string;
  source: string;
  destination: string;
  connector_a: string;
  connector_b: string;
  type: "power" | "video" | "data";
  voltage_or_signal_standard: string;
  ideal_length_estimate: string;
  routing_path: string;
  strain_relief_requirement: string;
  risk_notes: string[];
  mandatory_or_optional: "mandatory" | "optional";
  source_part_id: string;
  from_part_id: string | null;
  to_part_id: string | null;
  status: "candidate" | "conditional" | "bench";
  motion_boundary: string;
  route_geometry: string;
}

export interface CablesManifest {
  profiles: {
    direct_gimbal: string[];
    requested_dual_feed_bench: string[];
    alternate_loopthrough_conditional: string[];
  };
  generated_on: string;
  color_coding: Record<string, string>;
  assembled_routing_logic: string[];
  exploded_routing_logic: string[];
  cables: Cable[];
}

export interface VariantViewerPosition {
  x: number;
  y: number;
  z: number;
}

export interface Variant {
  id: string;
  label: string;
  parts_removed: string[];
  parts_added: string[];
  active_part_ids: string[];
  conditional_part_ids: string[];
  dependencies: string[];
  operating_status: string;
  cable_profile_ids: string[];
  cables_removed: string[];
  cables_added: string[];
  balance_impact: string;
  workflow_impact: string;
  budget_impact: string;
  complexity_impact: string;
  viewer: {
    mode: "assembled" | "exploded" | "vertical";
    positions: Record<string, VariantViewerPosition>;
    monitor_mount_route?: string;
    rig_context?: CustomRig["context"];
    adjustments?: RigAdjustments;
  };
}

export type Vec3 = [number, number, number];
export interface LayoutNode {
  articulated_subassemblies?: Record<string,string[]>;
  vertical_frame?: "camera" | "fixed";
  visual_subassemblies?: {object_name:string;hide_if_any_part_ids:string[]}[];
  subcomponent_id?: string;
  mount_point_id?: string;
  mounting_points?: {id:string;local_position_mm:Vec3;rotation_deg:Vec3;size_xyz_mm:Vec3;source_url:string;confidence:string;note:string}[];
  rotation_deg: Vec3;
  parent_id: string | null;
  dimension_source_url: string;
  id: string;
  label: string;
  kind: "camera" | "lens" | "cage" | "baseplate" | "rods" | "matte" | "batteryPlate" | "battery" | "gimbal" | "grip" | "monitorMount" | "monitor" | "handle" | "audioReceiver" | "compactMonitorMount" | "handleExtension" | "monitorBattery" | "nativeBattery";
  internal?: boolean;
  position_mm: Vec3;
  size_xyz_mm: Vec3;
  explode_mm: Vec3;
  envelope: "verified" | "approximate";
  mass_domain: "moving" | "fixed";
  mount: string;
  placement: string;
  orientation: string;
  rationale: string;
  rejected: string;
}
export interface LayoutManifest {
  battery_plate_slide?: {plate_id:string;rod_id:string;attached_part_ids:string[];rod_axis_local:Vec3;source_url:string;source_locator:string;travel_status:string;note:string};
  monitor_joints?: Record<string,MonitorJoint>;
  units: string;
  nominal_rod_center_spacing_mm: number;
  nodes: LayoutNode[];
  monitor_mount_routes?: Record<string, {label:string; overrides:Record<string, Partial<LayoutNode>>}>;
  camera_layout_profiles?: {id:string;camera_part_id:string;overrides:Record<string,Partial<LayoutNode>>}[];
  clearance_gates: { id: string; title: string; detail: string; status: string }[];
}
export interface AssemblyStep {
  applies_if_any_part_ids: string[];
  number: number;
  title: string;
  mount: string;
  where: string;
  verify: string[];
  rebalance: string;
}

export interface AssemblyContentBlock {
  part_ids: string[];
  source_ids?: string[];
  require_all?: string[];
  unless_any?: string[];
  cable_ids?: string[];
  mount: string;
  where: string;
  verify: string[];
}
export interface AssemblyProfileContent {
  version: number;
  profiles?: {id:string;steps:AssemblyProfileContent["steps"]}[];
  steps: {
    source_ids?: string[];
    references?: {part_id:string;document_id:string;page:number;image_path:string;alt:string}[];
    number: number;
    title: string;
    note: string;
    kind: "mount" | "check" | "optional";
    requires_any: string[];
    rebalance: string;
    blocks: AssemblyContentBlock[];
  }[];
}

export interface VariantsManifest {
  generated_on: string;
  master_variant_id: string;
  variants: Variant[];
}

export interface CustomRig {
  schema_version: 1;
  id: string;
  name: string;
  context: "gimbal" | "handheld" | "static";
  orientation: "landscape" | "vertical";
  part_ids: string[];
  updated_at: string;
  adjustments?: RigAdjustments;
}

export interface RigAdjustments {
  monitor?: {mount_id:string;tilt_deg:number;swivel_deg:number};
  battery_plate?: {offset_mm:number;measured_back_mm:number;measured_forward_mm:number};
}
export interface MonitorJoint {
  mount_id:string;
  monitor_id:string;
  attached_part_ids:string[];
  tilt_range_deg:[number,number];
  swivel_range_deg:[number,number];
  tilt_pivot_local_mm:Vec3;
  swivel_pivot_local_mm:Vec3;
  head_object_name:string;
  swivel_object_name?:string;
  source_url:string;
  source_locator:string;
  geometry_note:string;
}

export interface PlannerRules {
  default_context?: CustomRig["context"];
  attachment_options?: AttachmentOption[];
  planning_root_part_ids: string[];
  exclusive_selection_groups?: {id:string;part_ids:string[];max_active:number;message:string}[];
  viewer_routes?: {id:string;condition:RuleCondition}[];
  viewer_route_part_ids?: string[];
  completion_rules?: Record<string,{label:string;required_all:string[];power_cable_ids:string[];power_suggest_ids:string[]}>;
  camera_external_power_part_ids?: string[];
  camera_internal_power_part_ids?: string[];
  part_context_constraints?: {part_ids:string[];contexts:CustomRig["context"][];orientations:CustomRig["orientation"][];message:string}[];
  selection_scopes?: {id:string;condition:RuleCondition;allowed_part_ids:string[];message:string}[];
  assembly_profiles?: {id:string;camera_part_id:string;frames:PlannerRules["assembly_frames"]}[];
  extraction_step?: number;
  version: number;
  max_saved_rigs: number;
  parked_part_ids: string[];
  mount_dependencies: Record<string, string[]>;
  dynamic_mount_dependencies?: {part_id:string; condition:RuleCondition; required_all:string[]}[];
  gimbal_only_part_ids: string[];
  gimbal_excluded_part_ids: string[];
  vertical_excluded_part_ids: string[];
  categories: {id: string; label: string; part_ids: string[]}[];
  assembly_frames: {step: number; add_part_ids: string[]; add_cable_ids: string[]; context_part_ids: string[]; note: string}[];
  extraction_keep_part_ids: string[];
  camera_part_ids: string[];
  selection_checks: {id:string; condition:RuleCondition; message:string; required_all?:string[]; required_any?:string[]; suggest_ids?:string[]}[];
  cable_exclusions: {cable_id:string;condition:RuleCondition}[];
}

export interface AttachmentOption {
  id: string;
  anchor_part_id: string;
  label: string;
  add_part_ids: string[];
  condition: RuleCondition;
  source_ids: string[];
  note: string;
}

export interface RuleCondition {
  all?:string[];
  any?:string[];
  none?:string[];
  context?:CustomRig["context"];
  not_context?:CustomRig["context"];
  orientation?:CustomRig["orientation"];
}
export interface CompatibilityEvidence {
  id:string;
  domain:"mechanical"|"power"|"signal";
  status:"documented_candidate"|"incompatible"|"unknown";
  source_urls:string[];
  revision:string|null;
  note:string;
}

export interface Port {
  electrical?: ElectricalProperties;
  id: string;
  part_id: string | null;
  label: string;
  connector: string;
  local_position_mm: Vec3 | null;
  position_confidence: string;
  identity_source_url: string;
}

export type ElectricalField = "input_range_v" | "output_range_v" | "output_polarity" | "input_polarity" | "output_nominal_v" | "input_min_current_a" | "output_max_current_a" | "nominal_input_current_a" | "barrel_outer_mm" | "barrel_inner_mm";
export interface ElectricalProperties {
  revision: string;
  input_range_v?: [number, number] | null;
  output_range_v?: [number, number] | null;
  output_nominal_v?: number;
  input_min_current_a?: number;
  output_max_current_a?: number;
  nominal_input_current_a?: number;
  output_polarity?: "center_positive" | "center_negative" | null;
  input_polarity?: "center_positive" | "center_negative" | null;
  barrel_outer_mm?: number;
  barrel_inner_mm?: number | null;
  field_sources: Partial<Record<ElectricalField, string>>;
}
export interface ReviewSource { id: string; type: string; url: string; review_subject_part_ids?: string[] }
export interface EvidenceCitation { source_id: string; source_url: string; locator: string; claim: string; part_ids: string[] }
export interface ElectricalReference { owner: "from_port" | "to_port" | "cable"; field: ElectricalField }
interface ConnectionCheckBase { id: string; label: string; detail: string; citation_ids: string[] }
export type ConnectionCheck = ConnectionCheckBase & (
  { kind: "specification"; subject_part_ids: string[] } |
  { kind: "manufacturer_pair"; pair: [string, string]; tested_firmware: string } |
  { kind: "voltage_range" | "polarity"; source: ElectricalReference; receiver: ElectricalReference } |
  { kind: "operational" }
);
export interface ConnectionReview {
  cable_id: string;
  catalog_revision: string;
  reviewed_on: string;
  action: string;
  binding: {
    source_part_id: string;
    from_port_id: string;
    to_port_id: string;
    connector_a: string;
    connector_b: string;
    signal_standard: string;
    electrical_revision: string | null;
    models: { part_id: string; model_number: string | null; exact_product_name: string }[];
    ports: { id: string; connector: string; electrical_revision: string | null }[];
  };
  citations: Record<string, EvidenceCitation>;
  checks: ConnectionCheck[];
}
export interface ConnectionReviewManifest {
  version: 1;
  revision: string;
  catalog_revision: string;
  policy: string;
  reviews: ConnectionReview[];
}
