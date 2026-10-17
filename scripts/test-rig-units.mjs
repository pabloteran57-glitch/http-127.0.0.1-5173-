import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const moduleOf=async name=>import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`,import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString("base64")}`);
const p=await moduleOf("planner"),drafts=await moduleOf("drafts"),profiles=await moduleOf("profiles");
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const catalog=read("parts-manifest").parts.map(part=>part.id),rules=read("planner-rules"),cables=read("cables-manifest").cables,variants=read("variants").variants,master=variants.find(v=>v.id==="commercial-solo-gimbal");
const fixture=()=>({...p.newRig("Unidades de prueba"),part_ids:["sony-fx3","smallrig-4770","smallrig-2906b","smallhd-indie-7","sony-np-f970-pro","kondor-blue-hdmi-aa"]});
const memory=()=>{const values=new Map();return {values,get length(){return values.size;},key:i=>[...values.keys()][i]??null,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
const resolve=rig=>p.resolveRig(rig,rules,cables,master,id=>id);
const parser=value=>p.parseRig(value,catalog);
let checks=0;
const test=(name,run)=>{run();checks++;console.log(`CORRECTO: ${name}`);};
test("Conversión determinista sin escritura ni cambios de selección, ajustes o fecha",()=>{
 const old={...fixture(),adjustments:{monitor:{mount_id:"smallrig-2906b",tilt_deg:20,swivel_deg:15}}},before=JSON.stringify(old),a=p.withRigUnits(old),b=p.withRigUnits(old);
 assert.deepEqual(a,b);assert.equal(JSON.stringify(old),before);assert.deepEqual(a.part_ids,old.part_ids);assert.deepEqual(a.adjustments,old.adjustments);assert.equal(a.updated_at,old.updated_at);assert.equal(a.schema_version,2);assert.equal(a.units.length,old.part_ids.length);assert(a.units.every(u=>u.role==="rig"));assert.deepEqual(parser(a),a);
});
test("Dos unidades del monitor conservan identidades y etiquetas independientes",()=>{
 const a=p.withRigUnits(fixture()),b=p.addSpareUnit(a,"smallhd-indie-7"),unit=b.units.at(-1),c=p.updateRigUnit(b,unit.id,{label:"Monitor de respaldo"});
 assert.notEqual(unit.id,a.units.find(u=>u.part_id===unit.part_id).id);assert.equal(c.units.at(-1).label,"Monitor de respaldo");assert.deepEqual(c.part_ids,a.part_ids);assert.equal(a.units.length,6);assert.deepEqual(parser(c),c);
});
test("Repuestos no duplican geometría, etapas, circuitos ni selección activa",()=>{
 const a=p.withRigUnits(fixture()),b=p.addSpareUnit(p.addSpareUnit(a,"smallhd-indie-7"),"kondor-blue-hdmi-aa");
 assert.deepEqual(resolve(a),resolve(b));
 for(let step=1;step<=13;step++)assert.deepEqual(p.assemblyFrame(resolve(a).variant,step,rules,cables),p.assemblyFrame(resolve(b).variant,step,rules,cables));
});
test("Usar un repuesto intercambia sólo su producto sin certificar compatibilidad",()=>{
 const a=p.addSpareUnit(p.withRigUnits(fixture()),"smallhd-indie-7"),unit=a.units.at(-1),b=p.updateRigUnit(a,unit.id,{role:"rig"});
 assert.equal(b.units.find(u=>u.id===unit.id).role,"rig");assert.equal(b.units.filter(u=>u.part_id===unit.part_id&&u.role==="rig").length,1);assert.equal(b.units.filter(u=>u.part_id===unit.part_id&&u.role==="spare").length,1);assert.deepEqual(b.part_ids,a.part_ids);assert.deepEqual(resolve(a),resolve(b));assert.deepEqual(parser(b),b);
});
test("Retirar el soporte no mueve el repuesto a su lugar ni borra dependientes",()=>{
 const a=p.addSpareUnit(p.withRigUnits(fixture()),"smallrig-2906b"),unit=a.units.find(u=>u.part_id==="smallrig-2906b"&&u.role==="rig"),b=p.removeRigUnit(a,unit.id);
 assert(!b.part_ids.includes(unit.part_id));assert(b.units.some(u=>u.part_id===unit.part_id&&u.role==="spare"));assert(b.part_ids.includes("smallhd-indie-7"));assert(resolve(b).parked_ids.includes("smallhd-indie-7"));assert(!resolve(b).variant.cable_profile_ids.includes("vid-fx3-to-smallhd"));assert.deepEqual(parser(b),b);
});
test("Sólo repuestos es un proyecto válido sin montaje ficticio",()=>{
 let rig=p.withRigUnits(fixture());for(const unit of rig.units)rig=p.updateRigUnit(rig,unit.id,{role:"spare"});
 assert.equal(rig.part_ids.length,0);assert.equal(rig.units.length,6);assert.equal(resolve(rig).variant.active_part_ids.length,0);assert.equal(resolve(rig).variant.cable_profile_ids.length,0);assert.deepEqual(parser(rig),rig);
});
test("Selección desde catálogo conserva repuestos y crea sólo unidades solicitadas",()=>{
 const a=p.addSpareUnit(p.withRigUnits(fixture()),"smallhd-indie-7"),b=p.setRigParts(a,[...a.part_ids,"dji-mic-2-kit"]);
 assert.equal(b.units.length,a.units.length+1);assert.deepEqual(b.units.slice(0,a.units.length),a.units);assert.deepEqual(parser(b),b);
});
test("Formato antiguo no admite unidades que una pestaña vieja ignoraría",()=>{assert.throws(()=>parser({...fixture(),units:[]}));assert.throws(()=>p.parseLibrary(JSON.stringify({version:2,catalog_revision:p.CATALOG_REVISION,rigs:[p.withRigUnits(fixture())]}),catalog,40));});
test("Unidades falsas, dobles montajes, IDs duplicados y anclajes inventados se rechazan",()=>{
 const rig=p.withRigUnits(fixture()),unit=rig.units[0];
 for(const units of [undefined,[...rig.units,unit],[...rig.units,{...unit,id:"unit-other"}],[...rig.units,{...unit,id:"unit-other",role:"spare",part_id:"not-a-product"}],rig.units.slice(1),rig.units.map((u,i)=>i?u:{...u,slot_id:"inventado"}),rig.units.map((u,i)=>i?u:{...u,label:" "})])assert.throws(()=>parser({...rig,units}));
});
test("Límites de software explícitos sin compras o cambios parciales",()=>{
 let rig=p.withRigUnits(fixture());for(let i=1;i<p.UNITS_PER_PART_LIMIT;i++)rig=p.addSpareUnit(rig,"smallhd-indie-7");
 const before=JSON.stringify(rig);assert.throws(()=>p.addSpareUnit(rig,"smallhd-indie-7"),/Límite/);assert.equal(JSON.stringify(rig),before);assert.deepEqual(parser(rig),rig);assert.throws(()=>p.addSpareUnit(rig,"smallrig-4152"),/primero/);assert.throws(()=>p.updateRigUnit(rig,"unit-absent",{role:"rig"}));
});
test("Duplicar crea nuevas identidades y conserva etiquetas, repuestos y ajustes",()=>{
 const original=p.addSpareUnit(p.withRigUnits(fixture()),"smallhd-indie-7"),copy=p.copyRig(original,"Copia"),oldIds=new Set(original.units.map(u=>u.id));
 assert.notEqual(copy.id,original.id);assert(copy.units.every(u=>!oldIds.has(u.id)));assert.deepEqual(copy.units.map(({id,...u})=>u),original.units.map(({id,...u})=>u));assert.deepEqual(parser(copy),copy);
});
test("Ciento veinte unidades válidas no admiten una copia adicional",()=>{
 let rig=p.withRigUnits(fixture());for(const id of rig.part_ids)for(let n=1;n<p.UNITS_PER_PART_LIMIT;n++)rig=p.addSpareUnit(rig,id);
 assert.equal(rig.units.length,p.UNIT_LIMIT);assert.deepEqual(parser(rig),rig);assert.throws(()=>p.addSpareUnit(rig,rig.part_ids[0]),/Límite/);
 const proposed=p.setRigParts(rig,[...rig.part_ids,"dji-mic-2-kit"]);assert.throws(()=>parser(proposed));assert.equal(rig.units.length,p.UNIT_LIMIT);
});
test("Roles coercibles, etiquetas inválidas e identidades ajenas se rechazan",()=>{
 const rig=p.withRigUnits(fixture());for(const change of [{role:["rig"]},{role:"installed"},{label:"x".repeat(41)},{id:"unit-../escape"},{part_id:42}])assert.throws(()=>parser({...rig,units:rig.units.map((u,i)=>i?u:{...u,...change})}));
});
test("Historial conserva las unidades de cada guardado y limita cinco versiones",()=>{
 const storage=memory();let rig=p.withRigUnits(fixture()),raw=null;for(let n=0;n<8;n++){rig=p.addSpareUnit(rig,"smallhd-indie-7");raw=p.writeLibrary(storage,raw,[rig],catalog,40);}
 const history=p.parseLibrary(raw,catalog,40).history[rig.id];assert.equal(history.length,5);assert.deepEqual(history.map(r=>r.units.length),[10,11,12,13,14]);assert(history.every(r=>r.part_ids.length===6));
});
test("Bibliotecas v1/v2 e historial quedan intactos al guardar en v3",()=>{
 const storage=memory(),old=fixture(),legacy=JSON.stringify({version:1,rigs:[old]}),previous=JSON.stringify({version:2,catalog_revision:p.CATALOG_REVISION,legacy_fingerprint:p.libraryFingerprint(legacy),rigs:[old],history:{[old.id]:[old]}});
 storage.setItem(p.LEGACY_LIBRARY_KEY,legacy);storage.setItem(p.PREVIOUS_LIBRARY_KEY,previous);const loaded=p.loadRigLibrary(storage,catalog,40);
 assert.equal(loaded.legacyChanged,false);assert.equal(storage.length,2);const rig=p.addSpareUnit(loaded.rigs[0],"smallhd-indie-7"),raw=p.writeLibrary(storage,null,[rig],catalog,40);
 assert.equal(JSON.parse(raw).version,3);assert.equal(storage.getItem(p.LEGACY_LIBRARY_KEY),legacy);assert.equal(storage.getItem(p.PREVIOUS_LIBRARY_KEY),previous);assert.deepEqual(p.loadRigLibrary(storage,catalog,40).rigs,[rig]);assert.equal(p.parseLibrary(raw,catalog,40).history[rig.id].length,2);
});
test("Cambios antiguos después de migrar se detectan sin pisarlos",()=>{
 const storage=memory(),rig=p.withRigUnits(fixture());p.writeLibrary(storage,null,[rig],catalog,40);assert.equal(p.loadRigLibrary(storage,catalog,40).legacyChanged,false);
 storage.setItem(p.PREVIOUS_LIBRARY_KEY,JSON.stringify({version:2,catalog_revision:p.CATALOG_REVISION,rigs:[fixture()]}));assert.equal(p.loadRigLibrary(storage,catalog,40).legacyChanged,true);
});
test("Guardados v3 obsoletos, cuota y lectura no confirmada fallan",()=>{
 const storage=memory(),rig=p.addSpareUnit(p.withRigUnits(fixture()),"smallhd-indie-7"),raw=p.writeLibrary(storage,null,[rig],catalog,40);
 assert.throws(()=>p.writeLibrary(storage,null,[rig],catalog,40),/otra pestaña/);assert.equal(storage.getItem(p.LIBRARY_KEY),raw);assert.throws(()=>p.writeLibrary({getItem:()=>null,setItem:()=>{}},null,[rig],catalog,40),/confirmar/);
});
test("Borrador v2 conserva unidades y el borrador v1 sigue recuperable",()=>{
 const storage=memory(),old=fixture(),key=`${drafts.LEGACY_DRAFT_PREFIX}old.${old.id}`,raw=JSON.stringify({version:1,tab_id:"old",recorded_at:old.updated_at,rig:old});storage.setItem(key,raw);
 const rig=p.addSpareUnit(p.withRigUnits(old),"smallhd-indie-7");drafts.writeDraft(storage,"new",rig,parser);assert.equal(drafts.readDrafts(storage,parser).drafts.length,2);assert.equal(storage.getItem(key),raw);assert(drafts.clearConfirmedDraft(storage,"new",rig));assert.equal(storage.getItem(key),raw);
});
test("Perfiles v3 aíslan unidades, historial y borradores nuevos de los antiguos",()=>{
 const storage=memory(),a=profiles.profileStorage(storage,"profile-a"),b=profiles.profileStorage(storage,"profile-b"),rig=p.addSpareUnit(p.withRigUnits(fixture()),"smallhd-indie-7");p.writeLibrary(a,null,[rig],catalog,40);drafts.writeDraft(a,"tab",rig,parser);
 assert.equal(p.loadRigLibrary(b,catalog,40).rigs.length,0);assert.equal(drafts.readDrafts(b,parser).drafts.length,0);assert.equal(p.loadRigLibrary(a,catalog,40).rigs[0].units.length,7);
});
test("Las siete plantillas conservan el documento canónico y sus circuitos",()=>{
 const before=JSON.stringify(variants);for(const variant of variants){const old=p.newRig(variant.label,variant),next=p.withRigUnits(old);assert.deepEqual(resolve(next),resolve(old));assert.deepEqual(parser(next),next);}assert.equal(JSON.stringify(variants),before);
});
test("Resumen distingue unidades y repuestos aunque no haya montaje activo",()=>{
 assert.equal(p.unitSummary({...fixture(),part_ids:[]}),"0 unidades");assert.match(p.unitSummary(p.addSpareUnit(p.withRigUnits(fixture()),"smallhd-indie-7")),/7 unidades · 1 repuesto/);
});
console.log(`UNIDADES: ${checks} pruebas. Identidad y repuestos; no montaje simultáneo duplicado ni validación física.`);
