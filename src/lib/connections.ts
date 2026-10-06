import type { Cable, ConnectionCheck, ConnectionReview, ConnectionReviewManifest, ElectricalReference, Part, Port, ReviewSource } from "./types";

export type ReviewState = "documented" | "pending" | "blocked";
export interface CheckResult { id: string; label: string; state: ReviewState; detail: string; source_ids: string[] }
export interface ConnectionAssessment {
  state: ReviewState;
  reviewed: boolean;
  action: string;
  checks: CheckResult[];
  sources: ReviewSource[];
}
export interface ConnectionContext {
  catalog_revision: string;
  parts: Part[];
  ports: Port[];
  sources: ReviewSource[];
}

const validRange = (range: unknown): range is [number, number] => Array.isArray(range) && range.length === 2 && range.every(value => Number.isFinite(value) && value > 0) && range[0] <= range[1];
export function compareVoltageRanges(source: unknown, receiver: unknown): ReviewState {
  if (!validRange(source) || !validRange(receiver)) return "pending";
  // Un solapamiento parcial no demuestra que toda la salida sea admisible.
  return source[0] >= receiver[0] && source[1] <= receiver[1] ? "documented" : "blocked";
}
export function comparePolarities(source: unknown, receiver: unknown): ReviewState {
  const known = (value: unknown) => value === "center_positive" || value === "center_negative";
  return !known(source) || !known(receiver) ? "pending" : source === receiver ? "documented" : "blocked";
}

const pending = (action: string): ConnectionAssessment => ({state: "pending", reviewed: false, action, checks: [], sources: []});
function bindingMatches(cable: Cable, review: ConnectionReview, context: ConnectionContext): boolean {
  const b = review.binding;
  const partIds = new Set([cable.source_part_id, cable.from_part_id, cable.to_part_id].filter((id): id is string => !!id));
  return review.catalog_revision === context.catalog_revision && !!review.reviewed_on &&
    b.source_part_id === cable.source_part_id && b.from_port_id === cable.from_port_id && b.to_port_id === cable.to_port_id &&
    b.connector_a === cable.connector_a && b.connector_b === cable.connector_b && b.signal_standard === cable.voltage_or_signal_standard &&
    b.electrical_revision === (cable.electrical?.revision ?? null) &&
    b.models.length === partIds.size && new Set(b.models.map(model => model.part_id)).size === partIds.size &&
    b.models.every(model => partIds.has(model.part_id) && context.parts.some(part => part.id === model.part_id && part.model_number === model.model_number && part.exact_product_name === model.exact_product_name)) &&
    b.ports.length === 2 && new Set(b.ports.map(port => port.id)).size === 2 &&
    b.ports.every(port => [cable.from_port_id, cable.to_port_id].includes(port.id) && context.ports.some(actual =>
      actual.id === port.id && actual.part_id === (port.id === cable.from_port_id ? cable.from_part_id : cable.to_part_id) &&
      actual.connector === port.connector && (actual.electrical?.revision ?? null) === port.electrical_revision));
}

function evaluateCheck(check: ConnectionCheck, cable: Cable, review: ConnectionReview, context: ConnectionContext): CheckResult {
  const result = (state: ReviewState, detail = check.detail): CheckResult => ({id: check.id, label: check.label, state, detail, source_ids: [...new Set(check.citation_ids.map(id => review.citations[id]?.source_id).filter((id): id is string => !!id))]});
  if (check.kind === "operational") return result("pending");
  const participants = new Set(review.binding.models.map(model => model.part_id));
  const proofValid = check.citation_ids.length > 0 && check.citation_ids.every(id => {
    const proof = review.citations[id];
    const source = context.sources.find(source => source.id === proof?.source_id);
    return proof && proof.locator.trim() && proof.claim.trim() && proof.part_ids.length > 0 && proof.part_ids.every(id => participants.has(id)) &&
      source?.type === "official" && /^https:\/\//.test(source.url) && source.url === proof.source_url && proof.part_ids.every(id => source.review_subject_part_ids?.includes(id));
  });
  if (!proofValid) return result("pending", "Falta evidencia oficial con alcance y localizador para esta comprobación.");
  const covers = (id: string) => check.citation_ids.some(key => review.citations[key].part_ids.includes(id));
  if (check.kind === "specification") return result(check.subject_part_ids.length > 0 && check.subject_part_ids.every(id => participants.has(id) && covers(id)) ? "documented" : "pending");
  if (check.kind === "manufacturer_pair") {
    const exactPair = check.pair[0] === cable.from_part_id && check.pair[1] === cable.to_part_id;
    const pairProof = check.citation_ids.some(id => check.pair.every(part => review.citations[id].part_ids.includes(part)));
    return result(exactPair && pairProof && !!check.tested_firmware.trim() ? "documented" : "pending");
  }
  const fact = (ref: ElectricalReference) => {
    const owner = ref.owner === "cable" ? cable : context.ports.find(port => port.id === (ref.owner === "from_port" ? cable.from_port_id : cable.to_port_id));
    const value = owner?.electrical?.[ref.field];
    const sourceId = owner?.electrical?.field_sources[ref.field];
    const subject = ref.owner === "cable" ? cable.source_part_id : (owner as Port | undefined)?.part_id;
    const proven = check.citation_ids.some(id => review.citations[id].source_id === sourceId && !!subject && review.citations[id].part_ids.includes(subject));
    return proven ? value : undefined;
  };
  if (check.kind === "voltage_range") {
    if (check.source.field !== "output_range_v" || check.receiver.field !== "input_range_v") return result("pending", "La comparación exige rangos de salida y entrada, no valores nominales.");
    const state = compareVoltageRanges(fact(check.source), fact(check.receiver));
    return result(state, state === "blocked" ? "El rango completo de salida excede el rango de entrada. No conectar." : check.detail);
  }
  if (check.source.field !== "output_polarity" || check.receiver.field !== "input_polarity") return result("pending", "Falta la identidad de polaridad de ambos extremos.");
  const state = comparePolarities(fact(check.source), fact(check.receiver));
  return result(state, state === "blocked" ? "Las polaridades documentadas no coinciden. No conectar." : check.detail);
}

export function assessConnection(cable: Cable, manifest: ConnectionReviewManifest, context: ConnectionContext): ConnectionAssessment {
  const matches = manifest.reviews.filter(review => review.cable_id === cable.cable_id);
  if (matches.length !== 1 || manifest.version !== 1 || manifest.catalog_revision !== context.catalog_revision || !manifest.revision) {
    return pending("Revisión ampliada pendiente. Consulta las especificaciones y comprueba el circuito antes de utilizarlo.");
  }
  const review = matches[0];
  if (!bindingMatches(cable, review, context) || !review.checks.length || new Set(review.checks.map(check => check.id)).size !== review.checks.length) {
    return pending("La evidencia no coincide con la revisión, los modelos o los puertos actuales. Revisar antes de conectar.");
  }
  const checks = review.checks.map(check => evaluateCheck(check, cable, review, context));
  const state = checks.some(check => check.state === "blocked") ? "blocked" : checks.some(check => check.state === "pending") ? "pending" : "documented";
  const sourceIds = new Set(checks.flatMap(check => check.source_ids));
  return {state, reviewed: true, action: state === "blocked" ? "No conectar: hay una incompatibilidad documentada. Corregir la cadena y repetir la revisión." : review.action,
    checks, sources: context.sources.filter(source => sourceIds.has(source.id))};
}
