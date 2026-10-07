import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateCatalogPilot } from "./lib/catalog-pilot.mjs";
const read = name => JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
const input = { pilot: read("catalog-pilot"), authorities: { intake: read("catalog-intake"), parts: read("parts-manifest"), sources: read("sources") } };
let count = 0;
const test = (name, run) => { run(); count++; console.log("CORRECTO: " + name); };
const reject = (mutate, pattern) => {
  const fixture = structuredClone(input);
  mutate(fixture.pilot, fixture.authorities);
  assert.throws(() => validateCatalogPilot(fixture.pilot, fixture.authorities), pattern);
};
test("Ficha real coherente, en cuarentena y sin validación física", () => {
  const before = JSON.stringify(input);
  const report = validateCatalogPilot(input.pilot, input.authorities);
  assert.equal(report.subtotal_g, 1226);
  assert.equal(report.approximate, true);
  assert.deepEqual(report.documented, ["identity", "support", "native-power", "guide"]);
  assert.deepEqual(report.pending, ["geometry", "integration"]);
  assert.equal(report.next_stage, "viewer");
  assert.equal(report.planning_ready, false);
  assert.equal(report.physically_validated, false);
  assert.equal(JSON.stringify(input), before);
});
test("Masa derivada de autoridades, no un total fijo de la ficha", () => {
  const fixture = structuredClone(input);
  fixture.authorities.parts.parts.find(item => item.id === "smallrig-4770").planning_weight_g = 210;
  assert.equal(validateCatalogPilot(fixture.pilot, fixture.authorities).subtotal_g, 1228);
});
test("Rechaza otro modelo de objetivo", () => reject(p => { p.manifest[2].model_number = "SEL1635GM"; }, /Modelo diferente/));
test("Rechaza fuente desconocida", () => reject(p => { p.claims[0].source_id = "fuente-inventada"; }, /Fuente oficial desconocida/));
test("No usa fuente oficial revisada para otro par", () => reject(p => { p.claims[0].source_id = "intake-sony-npfz100-us"; }, /Fuente no revisada/));
test("No inventa firmware compatible", () => reject(p => { p.claims[0].firmware_basis = "all_versions"; }, /No inventar firmware/));
test("No duplica batería con masa de cuerpo compuesto", () => reject(p => { p.manifest[0].mass_field = "additional_mass.with_battery_and_card_g"; }, /masa compuesta/));
test("No mezcla base de masa desconocida", () => reject(p => { p.manifest[0].mass_basis = "body_battery_card"; }, /cuerpo solo/));
test("Distribución sin coordenadas inventadas", () => reject(p => { p.layout[0].position_mm = [0, 0, 0]; }, /coordenadas/));
test("Soporte debe pertenecer al par documentado", () => reject(p => { p.layout[2].parent_id = "smallrig-4770"; }, /Soporte sin evidencia/));
test("Raíz sin piezas implícitas", () => reject(p => { p.part_ids.push("dji-rs4-pro-combo"); }, /selección/));
test("No repite elementos de la ficha", () => reject(p => { p.manifest.push(p.manifest[0]); }, /duplicado/));
test("No convierte contactos en cable D-Tap", () => reject(p => { p.connections[0].display_kind = "cable"; }, /cable externo/));
test("No inventa pinout ni intervalo eléctrico", () => {
  reject(p => { p.connections[0].pinout = { positive: 1 }; }, /no publicado/);
  reject(p => { p.connections[0].voltage_range_v = [6, 8.4]; }, /no publicado/);
});
test("Guía sólo contiene piezas elegidas", () => reject(p => { p.assembly[4].introduced_part_ids.push("smallhd-indie-7"); }, /no elegida/));
test("Guía no puede omitir la batería", () => reject(p => { p.assembly[3].introduced_part_ids = []; }, /omite piezas/));
test("No reutiliza malla FX3 para representar FX30", () => reject(p => { p.viewer.model_ids = ["sony-fx3-takegrid-v1"]; }, /heredar geometría/));
test("Orden estricto y sin aprobar integración prematura", () => {
  reject(p => { p.gates[4].status = "documented"; }, /sin evidencia/);
  reject(p => { p.phase_order.reverse(); }, /orden de ingeniería/);
});
test("Ningún test puede inventar un ensayo físico", () => reject(p => { p.physical_validation.status = "passed"; }, /ensayo físico/));
test("La investigación no activa productos", () => reject(p => { p.status = "planning_candidate"; }, /no activa productos/));
console.log(`${count} pruebas de software del piloto superadas; no ensayos de equipo real.`);
