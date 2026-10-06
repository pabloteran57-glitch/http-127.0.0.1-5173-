export const PROFILES_KEY = "takegrid.profiles.v1";
export const ACTIVE_PROFILE_KEY = "takegrid.profile.active.v1";
export const INITIAL_PROFILE_ID = "initial";
export const PROFILE_LIMIT = 20;
export interface LocalProfile { id: string; name: string }
export type ProfileStorage = Pick<Storage, "getItem" | "setItem" | "removeItem" | "length" | "key">;
export const initialProfile: LocalProfile = { id: INITIAL_PROFILE_ID, name: "Perfil inicial" };

function validId(id: string) { return id === INITIAL_PROFILE_ID || /^profile-[a-z0-9-]{1,80}$/.test(id); }
export function parseProfiles(raw: string | null): LocalProfile[] {
  if (raw === null) return [{ ...initialProfile }];
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error("Lista de perfiles no compatible. No se borraron datos."); }
  if (value?.version !== 1 || !Array.isArray(value.profiles) || value.profiles.length < 1 || value.profiles.length > PROFILE_LIMIT) throw new Error("Lista de perfiles no compatible. No se borraron datos.");
  const profiles = value.profiles.map((p: unknown) => {
    if (!p || typeof p !== "object") throw new Error("Perfil local no válido.");
    const profile = p as LocalProfile;
    if (typeof profile.id !== "string" || !validId(profile.id) || typeof profile.name !== "string" || !profile.name.trim() || profile.name.length > 40) throw new Error("Perfil local no válido.");
    return { id: profile.id, name: profile.name.trim() };
  });
  if (profiles.filter((p: LocalProfile) => p.id === INITIAL_PROFILE_ID).length !== 1 || new Set(profiles.map((p: LocalProfile) => p.id)).size !== profiles.length || new Set(profiles.map((p: LocalProfile) => p.name.toLocaleLowerCase("es"))).size !== profiles.length) throw new Error("Perfiles duplicados o perfil inicial ausente.");
  return profiles;
}

export function addProfile(storage: Pick<Storage, "getItem" | "setItem">, expected: string | null, name: string, id: string): { profiles: LocalProfile[]; raw: string; profile: LocalProfile } {
  const current = storage.getItem(PROFILES_KEY);
  if (current !== expected) throw new Error("Los perfiles cambiaron en otra pestaña. Actualiza la lista antes de crear uno.");
  const profiles = parseProfiles(current);
  if (!name.trim() || name.trim().length > 40) throw new Error("Escribe un nombre de hasta 40 caracteres.");
  if (profiles.length >= PROFILE_LIMIT) throw new Error(`Máximo ${PROFILE_LIMIT} perfiles locales.`);
  const profile = { id, name: name.trim() };
  const raw = JSON.stringify({ version: 1, profiles: [...profiles, profile] });
  const checked = parseProfiles(raw);
  storage.setItem(PROFILES_KEY, raw);
  if (storage.getItem(PROFILES_KEY) !== raw) throw new Error("No se pudo confirmar el perfil. Revisa el almacenamiento antes de continuar.");
  return { profiles: checked, raw, profile };
}

const ownKey = (key: string) => /^takegrid\.rigs\.v[12](?:\.backup)?$/.test(key) || key.startsWith("takegrid.drafts.v1.");
export function profileStorage(storage: ProfileStorage, id: string): ProfileStorage {
  if (!validId(id)) throw new Error("Identificador de perfil no válido.");
  const prefix = id === INITIAL_PROFILE_ID ? "" : `takegrid.profile.${id}.`;
  const physical = (key: string) => {
    if (!ownKey(key)) throw new Error("Recurso ajeno a la biblioteca del perfil.");
    return prefix + key;
  };
  const keys = () => {
    const result: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key === null || !key.startsWith(prefix)) continue;
      const virtual = key.slice(prefix.length);
      if (ownKey(virtual)) result.push(virtual);
    }
    return result;
  };
  // El perfil inicial conserva las claves existentes: no hay copia, mezcla ni borrado de v1/v2.
  return {
    getItem: key => storage.getItem(physical(key)),
    setItem: (key, value) => storage.setItem(physical(key), value),
    removeItem: key => storage.removeItem(physical(key)),
    get length() { return keys().length; },
    key: index => Number.isInteger(index) && index >= 0 ? keys()[index] ?? null : null
  };
}

export function readActiveProfile(storage: Pick<Storage, "getItem">, profiles: LocalProfile[]): LocalProfile {
  return profiles.find(p => p.id === storage.getItem(ACTIVE_PROFILE_KEY)) ?? profiles.find(p => p.id === INITIAL_PROFILE_ID)!;
}
