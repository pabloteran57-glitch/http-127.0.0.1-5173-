import assert from "node:assert/strict";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist-public/", import.meta.url));
const walk = path => readdirSync(path, { withFileTypes: true }).flatMap(entry => {
  const absolute = join(path, entry.name);
  assert(!entry.isSymbolicLink(), "No publicar enlaces simbólicos");
  return entry.isDirectory() ? walk(absolute) : [absolute];
});
const files = walk(root);
const names = files.map(path => relative(root, path).replaceAll("\\", "/"));
const allowed = /^(?:index\.html|404\.html|brand\/(?:takegrid-mark\.svg|takegrid-app-icon\.svg|preview\.html)|assets\/[a-zA-Z0-9_-]+\.(?:js|css))$/;
for (const name of names) assert(allowed.test(name), "Archivo no autorizado para publicación: " + name);
assert(names.includes("index.html"));
assert(names.includes("brand/takegrid-app-icon.svg"));
const html = readFileSync(join(root, "index.html"), "utf8");
assert(html.includes('lang="es"'));
const total = files.reduce((sum, file) => sum + statSync(file).size, 0);
assert(total < 5_000_000, "La demo pública superó el presupuesto de 5 MB sin comprimir");
console.log(`PUBLICACIÓN VERIFICADA: ${names.length} archivos propios, ${(total / 1_000_000).toFixed(2)} MB; sin fotos, manuales, capturas de investigación ni credenciales.`);

