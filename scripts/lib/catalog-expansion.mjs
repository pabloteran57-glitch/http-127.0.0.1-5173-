import assert from "node:assert/strict";

export const engineeringPhases = ["manifest", "layout", "cables_power", "assembly", "viewer", "variants"];
const fieldAt = (record, path) => path.split(".").reduce((value, key) => value?.[key], record);
const methods = new Set(["direct_official_page", "official_pdf_text_review", "official_indexed_text_direct_incomplete"]);

export function validateRiggingIntake(intake, {parts, sources}) {
  assert.equal(intake.version, 1);
  assert.equal(intake.status, "research_only");
  assert.deepEqual(intake.phase_order, engineeringPhases);
  assert.deepEqual(intake.activation_gates.map(gate => gate.phase), engineeringPhases);
  assert.equal(intake.coverage.catalog_complete, false);
  assert.equal(intake.coverage.percentage_complete, null, "No inventar porcentaje sin inventario completo");
  assert.equal(intake.coverage.selectable_promotions, 0);
  const families = new Set(intake.families.map(family => family.id));
  assert.equal(families.size, intake.families.length);
  intake.families.forEach(family => assert(family.label && family.required_fields.length));
  const sourceById = new Map(sources.sources.map(source => [source.id, source]));
  const official = id => {
    const source = sourceById.get(id);
    assert(source?.type === "official" && /^https:\/\//.test(source.url), "Fuente oficial ausente: " + id);
    return source;
  };
  intake.existing_part_ids.forEach(id => assert(parts.parts.some(part => part.id === id), "Referencia activa inexistente"));
  const ids = new Set(), identities = new Set();
  for (const product of intake.products) {
    assert(!ids.has(product.id), "ID repetido"); ids.add(product.id);
    const identity = `${product.brand}:${product.model_number}`;
    assert(!identities.has(identity), "SKU/revisión repetidos"); identities.add(identity);
    assert(["SmallRig", "Tilta"].includes(product.brand));
    assert(product.model_number && product.exact_product_name && product.remaining.length);
    assert.equal(product.status, "research_only");
    assert.equal(product.selectable, false);
    assert(!parts.parts.some(part => part.id === product.id || `${part.brand}:${part.model_number}` === identity), "La cuarentena no duplica ni activa el catálogo");
    assert(product.family_ids.length && product.family_ids.every(id => families.has(id)));
    assert(product.source_ids.length && product.field_citations.length);
    product.source_ids.forEach(official);
    const cited = new Set();
    for (const citation of product.field_citations) {
      const source = official(citation.source_id);
      assert(product.source_ids.includes(citation.source_id) && source.review_subject_part_ids?.includes(product.id));
      assert(methods.has(citation.method) && citation.locator && citation.field_paths.length);
      for (const field of citation.field_paths) {
        assert(fieldAt(product, field) != null, "Cita sin dato de origen: " + field);
        cited.add(field);
      }
    }
    for (const field of ["exact_product_name", "model_number", "interfaces", "published_dimensions_mm", "published_weight_g", "published_material", "included_items", "fastener", "published_load_limit", "published_weight_raw", "published_dimensions_raw"]) {
      if (product[field] != null) assert(cited.has(field), "Dato sin cita: " + product.id + "/" + field);
    }
    for (const port of product.interfaces) {
      assert(["rail", "clamp", "rod", "male", "female", "male_locating", "male_dual", "driving", "unspecified"].includes(port.direction));
      assert(port.kind && port.description && product.source_ids.includes(port.source_id));
    }
    if (product.published_dimensions_mm) assert(product.published_dimensions_mm.values.length === 3 && product.published_dimensions_mm.values.every(value => Number.isFinite(value) && value > 0) && product.published_dimensions_mm.basis);
    if (product.published_weight_g !== null) assert(Number.isFinite(product.published_weight_g) && product.published_weight_g > 0);
    assert.equal(product.geometry.position_mm, null);
    assert.equal(product.geometry.status, "not_authored");
    assert.equal(product.geometry.rights, "not_granted_for_manufacturer_media");
    assert.equal(product.compatibility.status, "unknown");
    assert.deepEqual(product.compatibility.exact_pairs, []);
    assert.equal(product.physical_validation.status, "pending");
    assert.deepEqual(product.physical_validation.observations, []);
    if (product.fastener) {
      assert.equal(product.fastener.threaded_length_mm, null);
      assert.equal(product.fastener.head_dimensions_mm, null);
      assert.equal(product.fastener.torque_nm, null);
    }
  }
  assert.equal(new Set(intake.inventory.map(index => index.id)).size, intake.inventory.length);
  for (const index of intake.inventory) {
    official(index.source_id);
    assert(!index.family_id || families.has(index.family_id));
    assert.equal(index.pagination_complete, false);
    assert.equal(index.official_total, null);
    assert.equal(index.status, "enumeration_pending");
  }
  for (const batch of intake.batches) assert(batch.family_ids.every(id => families.has(id)) && batch.exit_checks.length && batch.status === "research_only");
  return {products: ids.size, families: families.size, brands: [...new Set(intake.products.map(product => product.brand))]};
}

export function validateCatalogPromotions(register, {parts, sources, layout, rules, assets, visuals}) {
  assert.equal(register.version, 1);
  const promoted = new Set(), sourceById = new Map(sources.sources.map(source => [source.id, source]));
  for (const promotion of register.promotions) {
    assert.equal(promotion.status, "planning_candidate");
    assert(promotion.contexts.length && promotion.orientations.length && promotion.claims.length);
    promotion.source_ids.forEach(id => assert(sourceById.get(id)?.type === "official"));
    for (const id of promotion.part_ids) {
      assert(!promoted.has(id)); promoted.add(id);
      assert(parts.parts.some(part => part.id === id));
      assert(layout.nodes.some(node => node.id === id));
      assert(assets.assets.some(asset => asset.part_id === id && asset.status === "approved"));
      assert(visuals.assets.some(asset => asset.part_id === id));
      assert(rules.assembly_frames.some(frame => frame.add_part_ids.includes(id)) || rules.assembly_profiles?.some(profile => profile.frames.some(frame => frame.add_part_ids.includes(id))));
      const scope = rules.part_context_constraints.find(rule => rule.part_ids.includes(id));
      assert.deepEqual(scope.contexts, promotion.contexts);
      assert.deepEqual(scope.orientations, promotion.orientations);
    }
    assert.equal(new Set(promotion.claims.map(claim => claim.id)).size, promotion.claims.length);
    for (const claim of promotion.claims) {
      const source = sourceById.get(claim.source_id);
      assert(source?.type === "official" && promotion.source_ids.includes(claim.source_id));
      assert.equal(claim.method, "official_browser_visible");
      assert(claim.locator && claim.limitation && claim.part_ids.length === 2 && claim.model_numbers.length === 2);
      claim.part_ids.forEach((id, index) => {
        assert.equal(parts.parts.find(part => part.id === id)?.model_number, claim.model_numbers[index], "Evidencia de otra revisión");
        assert(source.review_subject_part_ids?.includes(id), "Fuente ajena al par exacto");
      });
    }
    assert.equal(promotion.physical_validation.status, "pending");
    assert.deepEqual(promotion.physical_validation.observations, []);
    promotion.examples.forEach(example => assert(example.part_ids.every(id => parts.parts.some(part => part.id === id)) && promotion.contexts.includes(example.context) && promotion.orientations.includes(example.orientation)));
  }
  return {promoted_part_ids: [...promoted]};
}
