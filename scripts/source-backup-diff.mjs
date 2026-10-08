import {readFileSync,readdirSync,statSync} from "node:fs";
import {resolve,relative,sep} from "node:path";
import {execFileSync} from "node:child_process";
import assert from "node:assert/strict";

const root=process.cwd(),baseline=resolve(root,process.argv[2]);
assert(baseline.startsWith(root+sep),"Comparación fuera del proyecto");
const git=(...args)=>execFileSync("git",["-C",baseline,...args],{encoding:"utf8",maxBuffer:5_000_000});
const head=git("rev-parse","FETCH_HEAD").trim(),tree=git("rev-parse","FETCH_HEAD^{tree}").trim();
const tracked=new Set(git("ls-tree","-r","--name-only","FETCH_HEAD").trim().split("\n"));
const roots=["src","data","docs","scripts","public/brand"];
const top=["AGENTS.md","README.md","package.json","package-lock.json","index.html","vite.config.ts","tsconfig.json","tsconfig.node.json","tailwind.config.ts","tailwind.config.js","postcss.config.js","netlify.toml",".gitignore","public/manifest.webmanifest","public/offline-worker.js"];
const walk=path=>readdirSync(resolve(root,path),{withFileTypes:true}).flatMap(e=>{
  assert(!e.isSymbolicLink(),"Enlace no admitido");const next=path+"/"+e.name;
  return e.isDirectory()?walk(next):[next];
});
const paths=[...new Set([...top.filter(p=>{try{return statSync(resolve(root,p)).isFile();}catch{return false;}}),...roots.flatMap(walk).filter(p=>/\.(?:md|json|tsx?|[cm]?js|css|html|svg|toml)$/.test(p))])].sort();
const changes=[];
for(const path of paths) {
  assert(!/(?:^|\/)(?:private|research|references|node_modules|\.env)(?:\/|$)/.test(path),"Ruta privada no admitida");
  const bytes=readFileSync(resolve(root,path));assert(!bytes.includes(0),"Sólo texto autorizado: "+path);
  const content=bytes.toString("utf8").replaceAll("\r\n","\n");
  assert(!/(?:BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{30}|sk-[A-Za-z0-9]{30})/.test(content),"Posible credencial en fuente");
  if(tracked.has(path)&&git("show",`FETCH_HEAD:${path}`).replaceAll("\r\n","\n")===content)continue;
  changes.push({path,mode:"100644",type:"blob",content});
}
const batches=[];let batch=[],size=0;
for(const entry of changes) {
  const length=JSON.stringify(entry).length;
  if(size+length>120_000&&batch.length){batches.push(batch);batch=[];size=0;}
  batch.push(entry);size+=length;
}
if(batch.length)batches.push(batch);
const index=process.argv[3];
console.log(JSON.stringify(index===undefined?{head,tree,changes:changes.map(e=>({path:e.path,bytes:Buffer.byteLength(e.content)})),batches:batches.map(b=>({files:b.length,characters:JSON.stringify(b).length}))}:{head,tree,elements:batches[Number(index)]}));
