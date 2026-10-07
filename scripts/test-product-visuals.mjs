import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import ts from "typescript";
import sharp from "sharp";
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const code=ts.transpileModule(readFileSync(new URL("../src/lib/product-visuals.ts",import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const {approvedProductVisual}=await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const models=read("model-assets").assets,visuals=read("product-visuals").assets;
let count=0;const test=(name,fn)=>{fn();count++;console.log("CORRECTO: "+name);};
test("Miniaturas de todas las mallas aprobadas, nunca de fuentes privadas",()=>{assert.equal(visuals.length,models.length);assert.deepEqual(new Set(visuals.map(v=>v.part_id)),new Set(models.map(m=>m.part_id)));models.forEach(m=>assert(approvedProductVisual(m.part_id,m,visuals)));});
test("Cuarentena, licencia o modelo diferentes no producen miniatura",()=>{const m=models[0];for(const changed of [{...m,status:"quarantine"},{...m,part_id:"otro"},{...m,rights:{...m.rights,redistribution:false}},{...m,rights:{...m.rights,modification:false}}])assert.equal(approvedProductVisual(m.part_id,changed,visuals),null);});
test("Huella GLB, revisión, subcomponente y rutas se vinculan",()=>{const m=models[0];for(const field of ["id","model_sha256","subcomponent_id","method","reviewed_on","caption"]){const copy=structuredClone(visuals);copy[0][field]="incorrecto";assert.equal(approvedProductVisual(m.part_id,m,copy),null);}const copy=structuredClone(visuals);copy[0].image.path="/references/foto.jpg";assert.equal(approvedProductVisual(m.part_id,m,copy),null);});
test("Duplicados, imagen pesada o cotas incorrectas se rechazan",()=>{const m=models[0];assert.equal(approvedProductVisual(m.part_id,m,[...visuals,visuals[0]]),null);for(const change of [{bytes:16001},{width:500},{height:300},{sha256:"no"}]){const copy=structuredClone(visuals);Object.assign(copy[0].image,change);assert.equal(approvedProductVisual(m.part_id,m,copy),null);}});
test("Mic 2 conserva alcance RX; sin malla no se inventa foto",()=>{assert.equal(visuals.find(v=>v.part_id==="dji-mic-2-kit").subcomponent_id,"receiver");assert.match(visuals.find(v=>v.part_id==="dji-mic-2-kit").caption,/RX/);assert.equal(approvedProductVisual("startech-st122hd4ku",null,visuals),null);});
for(const v of visuals){const bytes=readFileSync(new URL("../public"+v.image.path,import.meta.url)),meta=await sharp(bytes).metadata();assert.equal(bytes.length,v.image.bytes);assert.equal(createHash("sha256").update(bytes).digest("hex"),v.image.sha256);assert.equal(meta.width,400);assert.equal(meta.height,280);assert.equal(meta.format,"webp");}
count++;console.log(`MINIATURAS: ${count} comprobaciones, ${visuals.length} imágenes propias; no CAD ni fotos oficiales.`);
