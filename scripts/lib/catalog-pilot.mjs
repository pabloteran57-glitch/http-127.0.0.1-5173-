import assert from "node:assert/strict";

const stages = ["manifest", "layout", "cables_power", "assembly", "viewer", "variants"];
const methods = new Set(["direct_official_page", "official_browser_page_review", "official_pdf_text_review", "official_pdf_visual_review"]);
const fieldAt = (record, path) => path.split(".").reduce((value, key) => value?.[key], record);

// La ficha referencia autoridades existentes; no crea otro catálogo de especificaciones.
export function validateCatalogPilot(pilot, { intake, parts, sources }) {
  assert.equal(pilot.version, 1);
  assert.equal(pilot.status, "research_only", "La ficha de investigación no activa productos");
  assert.deepEqual(pilot.phase_order, stages, "Conservar el orden de ingeniería");
  const candidate = intake.configuration_candidates.find(item => item.id === pilot.configuration_id);
  assert(candidate, "Conjunto candidato desconocido");
  assert.deepEqual(pilot.part_ids, candidate.part_ids, "No cambiar la selección del conjunto implícitamente");
  assert.equal(pilot.context, candidate.context, "Contexto diferente del conjunto candidato");
  const selected = new Set(pilot.part_ids);
  assert.equal(selected.size, pilot.part_ids.length, "Piezas duplicadas");
  assert.deepEqual(new Set(pilot.manifest.map(item => item.part_id)), selected, "Manifiesto incompleto");
  assert.equal(pilot.manifest.length, selected.size, "Manifiesto duplicado");
  const sourceById = new Map(sources.sources.map(item => [item.id, item]));
  const official = id => {
    const source = sourceById.get(id);
    assert(source?.type === "official" && source.url.startsWith("https://"), "Fuente oficial desconocida: " + id);
    return source;
  };
  const records = new Map();
  for (const binding of pilot.manifest) {
    assert(["catalog-intake", "parts-manifest"].includes(binding.authority), "Autoridad desconocida");
    const list = binding.authority === "catalog-intake" ? intake.products : parts.parts;
    const record = list.find(item => item.id === binding.part_id);
    assert(record, "Pieza fuera de su autoridad: " + binding.part_id);
    assert.equal(binding.model_number, record.model_number, "Modelo diferente de la autoridad");
    assert(binding.source_ids.length && binding.remaining.length, "Fuentes y límites explícitos requeridos");
    binding.source_ids.forEach(official);
    assert.equal(binding.mass_field, binding.authority === "catalog-intake" ? "weight_g" : "planning_weight_g", "No usar una masa compuesta ni duplicar batería");
    const mass = fieldAt(record, binding.mass_field);
    assert(Number.isFinite(mass) && mass > 0, "Masa de planificación desconocida");
    if (record.category === "camera") assert.equal(binding.mass_basis, "body_only", "Cámara debe usar masa del cuerpo solo");
    records.set(binding.part_id, record);
  }
  const claims = new Map(pilot.claims.map(item => [item.id, item]));
  assert.equal(claims.size, pilot.claims.length, "Evidencias duplicadas");
  for (const claim of pilot.claims) {
    assert(["camera_lens", "camera_cage", "native_battery"].includes(claim.kind), "Tipo de evidencia no revisado");
    assert.equal(claim.status, "manufacturer_documented", "Una fuente no es un ensayo físico");
    assert.equal(claim.part_ids.length, 2);
    assert.equal(new Set(claim.part_ids).size, 2);
    assert.equal(claim.model_numbers.length, claim.part_ids.length);
    const source = official(claim.source_id);
    claim.part_ids.forEach((id, index) => {
      assert(selected.has(id), "Evidencia de una pieza no seleccionada");
      assert.equal(claim.model_numbers[index], records.get(id).model_number, "Evidencia de otro modelo");
      assert(source.review_subject_part_ids?.includes(id), "Fuente no revisada para este par exacto");
    });
    assert(claim.locator && claim.limitation && methods.has(claim.method), "Evidencia sin localizador o método directo");
    if (claim.kind === "camera_lens") assert.equal(claim.firmware_basis, "not_specified_by_manufacturer", "No inventar firmware compatible");
  }
  const poses = new Map(pilot.layout.map(item => [item.part_id, item]));
  assert.equal(poses.size, selected.size, "Distribución incompleta o duplicada");
  assert.equal(pilot.layout.length, selected.size);
  assert.deepEqual(new Set(poses.keys()), selected);
  for (const pose of pilot.layout) {
    assert.equal(pose.position_mm, null, "No inventar coordenadas mecánicas");
    assert.equal(pose.rotation_deg, null, "No inventar orientación calibrada");
    assert(pose.placement && pose.orientation && pose.why && pose.rejected.length && pose.checks.length);
    if (pose.parent_id === null) {
      assert.equal(records.get(pose.part_id).category, "camera", "La raíz debe ser el cuerpo");
      assert.equal(pose.claim_id, null);
    } else {
      assert(selected.has(pose.parent_id), "Soporte no seleccionado");
      const claim = claims.get(pose.claim_id);
      assert(claim?.part_ids.includes(pose.part_id) && claim.part_ids.includes(pose.parent_id), "Soporte sin evidencia del par");
    }
    const seen = new Set([pose.part_id]);
    let parent = pose.parent_id;
    while (parent !== null) {
      assert(!seen.has(parent), "Ciclo de soporte");
      seen.add(parent);
      parent = poses.get(parent)?.parent_id;
      assert(parent !== undefined, "Soporte ausente en distribución");
    }
  }
  assert.equal(pilot.connections.length, 1, "No añadir cables o señales no revisados al núcleo nativo");
  const circuit = pilot.connections[0];
  assert.equal(circuit.type, "power");
  assert.equal(circuit.display_kind, "contacts", "Batería nativa no lleva cable externo");
  assert.equal(circuit.cable_part_id, null);
  assert.equal(circuit.ideal_length_mm, null);
  for (const key of ["voltage_range_v", "pinout", "source_port_position_mm", "destination_port_position_mm"]) assert.equal(circuit[key], null, "Dato eléctrico o espacial no publicado: " + key);
  const powerClaim = claims.get(circuit.claim_id);
  assert.equal(powerClaim?.kind, "native_battery");
  assert.deepEqual(new Set(powerClaim.part_ids), new Set([circuit.from_part_id, circuit.to_part_id]));
  assert.equal(records.get(circuit.from_part_id)?.category, "battery");
  assert.equal(records.get(circuit.to_part_id)?.category, "camera");
  assert.equal(circuit.nominal_voltage_ref.part_id, circuit.from_part_id);
  assert.equal(circuit.nominal_voltage_ref.field, "nominal_voltage_v");
  assert(fieldAt(records.get(circuit.from_part_id), circuit.nominal_voltage_ref.field) > 0);
  official(circuit.nominal_voltage_ref.source_id);
  assert(circuit.routing && circuit.retention && circuit.risk_notes.length && circuit.mandatory);
  const introduced = [];
  assert(pilot.assembly.length > 0);
  assert.equal(new Set(pilot.assembly.map(item => item.id)).size, pilot.assembly.length);
  for (const step of pilot.assembly) {
    assert(step.title && step.mount && step.where && step.verify.length && step.rebalance);
    assert(step.source_ids.length);
    step.source_ids.forEach(official);
    step.introduced_part_ids.forEach(id => assert(selected.has(id), "La guía añade una pieza no elegida"));
    introduced.push(...step.introduced_part_ids);
  }
  assert.deepEqual(new Set(introduced), selected, "La guía omite piezas elegidas");
  assert.equal(introduced.length, selected.size, "Montaje de una misma pieza repetido");
  assert.equal(pilot.viewer.enabled, false, "Ficha no integrada: no activar visor");
  assert.equal(pilot.viewer.geometry_status, "not_created");
  assert.deepEqual(pilot.viewer.model_ids, [], "No heredar geometría de otro producto");
  assert.equal(pilot.viewer.coordinate_status, "unmeasured");
  assert.equal(pilot.variants.enabled, false);
  assert.deepEqual(pilot.variants.template_ids, []);
  assert.deepEqual(pilot.gates.map(gate => gate.stage), stages, "Criterios fuera de orden");
  assert.equal(new Set(pilot.gates.map(gate => gate.id)).size, stages.length);
  for (const gate of pilot.gates) {
    assert.equal(gate.status, stages.indexOf(gate.stage) < 4 ? "documented" : "pending", "No aprobar visualización o integración sin evidencia");
    assert(gate.note);
    if (gate.status === "documented") assert(gate.claim_ids.length);
    gate.claim_ids.forEach(id => assert(claims.has(id), "Criterio sin evidencia"));
  }
  assert.equal(pilot.physical_validation.status, "pending", "No convertir pruebas de software en ensayo físico");
  assert.deepEqual(pilot.physical_validation.observations, [], "Registro real separado: no inventar observaciones");
  assert.equal(pilot.mass.calculation, "sum_manifest_mass_fields");
  assert.equal(pilot.mass.approximate, true);
  assert(pilot.mass.exclusions.length && pilot.mass.note);
  return {
    subtotal_g: pilot.manifest.reduce((total, binding) => total + fieldAt(records.get(binding.part_id), binding.mass_field), 0),
    approximate: true,
    documented: pilot.gates.filter(gate => gate.status === "documented").map(gate => gate.id),
    pending: pilot.gates.filter(gate => gate.status === "pending").map(gate => gate.id),
    next_stage: pilot.gates.find(gate => gate.status === "pending")?.stage ?? null,
    planning_ready: false,
    physically_validated: false
  };
}
