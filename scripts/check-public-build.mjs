import assert from "node:assert/strict";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {createHash} from "node:crypto";

const root = fileURLToPath(new URL("../dist-public/", import.meta.url));
const walk = path => readdirSync(path, { withFileTypes: true }).flatMap(entry => {
  const absolute = join(path, entry.name);
  assert(!entry.isSymbolicLink(), "No publicar enlaces simbólicos");
  return entry.isDirectory() ? walk(absolute) : [absolute];
});
const files = walk(root);
const names = files.map(path => relative(root, path).replaceAll("\\", "/"));
const registry=JSON.parse(readFileSync(new URL("../data/model-assets.json",import.meta.url),"utf8"));
const modelPaths=new Set(registry.assets.filter(a=>a.status==="approved").map(a=>a.artifact.path.slice(1)));
const visuals=JSON.parse(readFileSync(new URL("../data/product-visuals.json",import.meta.url),"utf8")).assets;
const visualPaths=new Set(visuals.filter(a=>a.status==="approved").map(a=>a.image.path.slice(1)));
const allowed = /^(?:index\.html|404\.html|sw\.js|manifest\.webmanifest|brand\/(?:takegrid-mark\.svg|takegrid-app-icon\.svg|preview\.html)|assets\/[a-zA-Z0-9_-]+\.(?:js|css))$/;
for (const name of names) assert(allowed.test(name)||modelPaths.has(name)||visualPaths.has(name), "Archivo no autorizado para publicación: " + name);
for(const visual of visuals){const bytes=readFileSync(join(root,visual.image.path.slice(1)));assert.equal(createHash("sha256").update(bytes).digest("hex"),visual.image.sha256);assert.equal(bytes.length,visual.image.bytes);}
for(const path of modelPaths)assert(names.includes(path),"Malla auditada no publicada: "+path);
assert(names.includes("index.html"));
assert(names.includes("brand/takegrid-app-icon.svg"));
assert(names.includes("sw.js")&&names.includes("manifest.webmanifest"));
const worker=readFileSync(join(root,"sw.js"),"utf8");
assert(!worker.includes("__PRECACHE_ASSETS__")&&!worker.includes("__BUILD_HASH__"));
assert(!worker.includes("skipWaiting()")&&!worker.includes("clients.claim()"),"No activar una versión nueva sobre pestañas con borradores");
const precache=JSON.parse(worker.match(/const ASSETS = (\[[^;]+\]);/)[1]);
for(const path of precache)assert(names.includes(path.slice(1)),"Recurso sin conexión no publicado: "+path);
assert(precache.filter(path=>path.startsWith("/assets/")).length===names.filter(path=>path.startsWith("assets/")).length,"Todos los módulos propios deben estar disponibles sin conexión");
const html = readFileSync(join(root, "index.html"), "utf8");
assert(html.includes('lang="es"'));
const total = files.reduce((sum, file) => sum + statSync(file).size, 0);
assert(total < 6_000_000, "La demo pública superó el presupuesto explícito de 6 MB para 17 mallas y sus miniaturas");
console.log(`PUBLICACIÓN VERIFICADA: ${names.length} archivos permitidos, ${(total / 1_000_000).toFixed(2)} MB; ${modelPaths.size} mallas auditadas, sin fotos, manuales, capturas de investigación ni credenciales.`);
