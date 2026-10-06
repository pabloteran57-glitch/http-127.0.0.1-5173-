import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const moduleOf = async name => {
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
};
const { parseProfiles, addProfile, profileStorage, readActiveProfile, PROFILES_KEY, ACTIVE_PROFILE_KEY, PROFILE_LIMIT } = await moduleOf("profiles");
const { writeLibrary, parseLibrary, LIBRARY_KEY, LEGACY_LIBRARY_KEY } = await moduleOf("planner");
const { writeDraft, readDrafts, discardDraft } = await moduleOf("drafts");
const memory = () => {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), key: i => [...values.keys()][i] ?? null, get length() { return values.size; } };
};
const rig = { schema_version: 1, id: "rig-test-profile", name: "Rodaje de prueba", context: "gimbal", orientation: "vertical", part_ids: ["sony-fx3"], updated_at: "2026-10-06T12:00:00Z" };
const ids = ["sony-fx3"], parser = value => value;
let checks = 0;
const test = (name, run) => { run(); checks++; console.log("CORRECTO: " + name); };

test("Sin índice conserva un único perfil inicial sin escribir", () => assert.deepEqual(parseProfiles(null), [{ id: "initial", name: "Perfil inicial" }]));
test("Índice corrupto, versión ajena o inicial ausente no se reemplazan", () => {
  for (const raw of ["{", "null", '{"version":2,"profiles":[]}', '{"version":1,"profiles":[{"id":"profile-a","name":"Ana"}]}']) assert.throws(() => parseProfiles(raw));
});
test("IDs inseguros y nombres vacíos se rechazan", () => {
  const storage = memory();
  for (const id of ["../other", "profile-a.b", "initial", "profile-", "profile-<html>"]) assert.throws(() => addProfile(storage, null, "Ana", id));
  assert.throws(() => addProfile(storage, null, " ", "profile-a"));
  assert.throws(() => addProfile(storage, null, "a".repeat(41), "profile-a"));
  assert.equal(storage.length, 0);
});
test("Crear confirma lectura y no toca bibliotecas previas", () => {
  const storage = memory(); storage.setItem(LEGACY_LIBRARY_KEY, "original");
  const added = addProfile(storage, null, "  Ana  ", "profile-a");
  assert.equal(added.profile.name, "Ana"); assert.equal(storage.getItem(PROFILES_KEY), added.raw); assert.equal(storage.getItem(LEGACY_LIBRARY_KEY), "original");
});
test("IDs y nombres duplicados no sobrescriben índice", () => {
  const storage = memory(), first = addProfile(storage, null, "Ana", "profile-a");
  assert.throws(() => addProfile(storage, first.raw, "ANA", "profile-b"));
  assert.throws(() => addProfile(storage, first.raw, "Luis", "profile-a"));
  assert.equal(storage.getItem(PROFILES_KEY), first.raw);
});
test("Cambio de otra pestaña exige actualizar antes de crear", () => {
  const storage = memory(); addProfile(storage, null, "Ana", "profile-a");
  assert.throws(() => addProfile(storage, null, "Luis", "profile-b"), /otra pestaña/);
});
test("Límite de perfiles explícito y sin borrado automático", () => {
  const storage = memory(); let raw = null;
  for (let i = 1; i < PROFILE_LIMIT; i++) raw = addProfile(storage, raw, `Persona ${i}`, `profile-${i}`).raw;
  assert.throws(() => addProfile(storage, raw, "Otra", "profile-extra"), /Máximo/); assert.equal(storage.getItem(PROFILES_KEY), raw);
});
test("Escritura bloqueada o no confirmada nunca anuncia creación", () => {
  assert.throws(() => addProfile({ getItem: () => null, setItem: () => {} }, null, "Ana", "profile-a"), /confirmar/);
  assert.throws(() => addProfile({ getItem: () => null, setItem: () => { throw new Error("denegado"); } }, null, "Ana", "profile-a"));
});
test("Perfil inicial usa exactamente claves v1/v2 heredadas", () => {
  const storage = memory(); storage.setItem(LEGACY_LIBRARY_KEY, "v1"); storage.setItem(LIBRARY_KEY, "v2");
  const before = [...storage.values], initial = profileStorage(storage, "initial");
  assert.equal(initial.getItem(LEGACY_LIBRARY_KEY), "v1"); assert.equal(initial.getItem(LIBRARY_KEY), "v2"); assert.deepEqual([...storage.values], before);
});
test("Bibliotecas y claves de respaldo independientes incluso con mismos IDs", () => {
  const storage = memory(), initial = profileStorage(storage, "initial"), a = profileStorage(storage, "profile-a"), b = profileStorage(storage, "profile-b");
  initial.setItem(LIBRARY_KEY, "anterior"); a.setItem(LIBRARY_KEY, "Ana"); a.setItem(LIBRARY_KEY + ".backup", "copia Ana"); b.setItem(LIBRARY_KEY, "Luis");
  assert.equal(a.getItem(LIBRARY_KEY), "Ana"); assert.equal(b.getItem(LIBRARY_KEY), "Luis"); assert.equal(b.getItem(LIBRARY_KEY + ".backup"), null); assert.equal(initial.getItem(LIBRARY_KEY), "anterior");
  a.removeItem(LIBRARY_KEY); assert.equal(b.getItem(LIBRARY_KEY), "Luis"); assert.equal(initial.getItem(LIBRARY_KEY), "anterior");
});
test("Enumeración sólo expone claves del perfil y no cuenta otras personas", () => {
  const storage = memory(), a = profileStorage(storage, "profile-a"), b = profileStorage(storage, "profile-ab");
  storage.setItem(PROFILES_KEY, "índice"); storage.setItem("unrelated", "privado");
  a.setItem(LIBRARY_KEY, "Ana"); b.setItem(LIBRARY_KEY, "Luis");
  assert.equal(a.length, 1); assert.equal(a.key(0), LIBRARY_KEY); assert.equal(a.key(-1), null); assert.equal(a.key(1), null); assert.equal(profileStorage(storage, "initial").length, 0);
});
test("Adaptador rechaza accesos externos o escape a otro perfil", () => {
  const storage = memory(), a = profileStorage(storage, "profile-a");
  for (const key of [PROFILES_KEY, ACTIVE_PROFILE_KEY, "unrelated", "takegrid.profile.profile-b.takegrid.rigs.v2"]) {
    assert.throws(() => a.getItem(key)); assert.throws(() => a.setItem(key, "x")); assert.throws(() => a.removeItem(key));
  }
  assert.throws(() => profileStorage(storage, "../profile")); assert.equal(storage.length, 0);
});
test("Historial y selección vertical permanecen sólo en biblioteca elegida", () => {
  const storage = memory(), a = profileStorage(storage, "profile-a"), b = profileStorage(storage, "profile-b");
  const first = writeLibrary(a, null, [rig], ids, 10), updated = { ...rig, name: "Segundo rodaje" };
  const second = writeLibrary(a, first, [updated], ids, 10);
  assert.equal(parseLibrary(second, ids, 10).history[rig.id].length, 2); assert.equal(parseLibrary(second, ids, 10).rigs[0].orientation, "vertical");
  assert.deepEqual(parseLibrary(b.getItem(LIBRARY_KEY), ids, 10).rigs, []);
});
test("Conflicto de biblioteca sigue protegido dentro del perfil", () => {
  const storage = memory(), a = profileStorage(storage, "profile-a"); writeLibrary(a, null, [rig], ids, 10);
  assert.throws(() => writeLibrary(a, null, [], ids, 10), /otra pestaña/);
});
test("Biblioteca que no confirma escritura no devuelve guardado", () => {
  assert.throws(() => writeLibrary({ getItem: () => null, setItem: () => {} }, null, [rig], ids, 10), /confirmar/);
});
test("Borradores recuperables y descartes nunca cruzan perfiles", () => {
  const storage = memory(), initial = profileStorage(storage, "initial"), a = profileStorage(storage, "profile-a"), b = profileStorage(storage, "profile-b");
  writeDraft(initial, "old-tab", rig, parser); writeDraft(a, "same-tab", rig, parser); writeDraft(b, "same-tab", { ...rig, name: "Luis" }, parser);
  const draft = readDrafts(a, parser).drafts[0]; assert.equal(readDrafts(a, parser).drafts.length, 1); assert.equal(readDrafts(b, parser).drafts[0].rig.name, "Luis");
  discardDraft(a, draft); assert.equal(readDrafts(initial, parser).drafts.length, 1); assert.equal(readDrafts(b, parser).drafts.length, 1);
});
test("Elección por pestaña recuerda sólo perfil válido sin activar otro", () => {
  const profiles = [{ id: "initial", name: "Perfil inicial" }, { id: "profile-a", name: "Ana" }], a = memory(), b = memory();
  a.setItem(ACTIVE_PROFILE_KEY, "profile-a"); assert.equal(readActiveProfile(a, profiles).id, "profile-a"); assert.equal(readActiveProfile(b, profiles).id, "initial");
  a.setItem(ACTIVE_PROFILE_KEY, "profile-missing"); assert.equal(readActiveProfile(a, profiles).id, "initial");
});
console.log(`PERFILES: ${checks} pruebas de aislamiento, conservación y errores. No son autenticación ni ensayos de usuarios.`);
