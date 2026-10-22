import {readFileSync} from "node:fs";
import ts from "typescript";
const cache=new Map();
function moduleUrl(name){
  if(cache.has(name))return cache.get(name);
  if(!/^[a-z-]+$/.test(name))throw Error("Módulo de prueba fuera del directorio permitido");
  let code=ts.transpileModule(readFileSync(new URL(`../../src/lib/${name}.ts`,import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
  code=code.replace(/from ["']\.\/([a-z-]+)["']/g,(_,dependency)=>`from "${moduleUrl(dependency)}"`);
  const url=`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;cache.set(name,url);return url;
}
export const loadTsModule=name=>import(moduleUrl(name));
