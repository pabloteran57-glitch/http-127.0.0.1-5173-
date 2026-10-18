import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "typescript";
const code=name=>ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`,import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const url=code=>`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const plannerUrl=url(code("planner")),p=await import(plannerUrl),g=await import(url(code("unit-graph").replace('"./planner"',JSON.stringify(plannerUrl))));
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const rules=read("planner-rules"),cables=read("cables-manifest").cables,ports=read("ports-manifest").ports,variants=read("variants").variants,parts=read("parts-manifest").parts,master=variants.find(v=>v.id==="commercial-solo-gimbal");
const fixture=()=>p.withRigUnits({...p.newRig("Grafo de unidades"),part_ids:["sony-fx3","sony-fe-35-f18","sony-np-fz100","smallrig-4770","smallrig-2906b","smallhd-indie-7","sony-np-f970-pro","kondor-blue-hdmi-aa","dji-mic-2-kit"]});
const resolve=rig=>p.resolveRig(rig,rules,cables,master,id=>id),graph=rig=>g.projectUnitGraph(rig,resolve(rig).variant,rules,cables,ports),unit=(rig,id)=>g.plannedUnit(rig,id),revision=rig=>g.assemblyReviewRevision(resolve(rig).variant,rig.part_ids,rig);
let checks=0;const test=(name,run)=>{run();checks++;console.log(`CORRECTO: ${name}`);};
test("Todos los extremos apuntan a unidades activas y puertos de su modelo",()=>{
 const rig=fixture(),result=graph(rig);assert.equal(result.issues.length,0);assert.equal(result.links.length,resolve(rig).variant.cable_profile_ids.length);
 for(const link of result.links)for(const end of [link.from,link.to]){assert.equal(ports.find(port=>port.id===end.port_id).part_id,end.part_id);assert.equal(unit(rig,end.part_id)?.id,end.unit_id);}
});
test("Recursos se instancian por unidad anfitriona, no por nombre de producto",()=>{
 const rig=fixture(),result=graph(rig),resource=result.resources.find(r=>r.resource.id==="cage-nato");assert.equal(resource.host_unit_id,unit(rig,"smallrig-4770").id);assert.deepEqual(resource.active_unit_ids,[unit(rig,"smallrig-2906b").id]);assert(result.dependencies.some(edge=>edge.unit_id===unit(rig,"smallrig-2906b").id&&edge.resource_instance_id===resource.id));
});
test("Repuestos no reciben extremos, recursos, dependencias o geometría",()=>{
 const original=fixture();let rig=original;for(const id of rig.part_ids)rig=p.addSpareUnit(rig,id);
 const before=graph(original),after=graph(rig),spares=new Set(rig.units.filter(u=>u.role==="spare").map(u=>u.id));assert.deepEqual(after.links,before.links);assert.deepEqual(after.resources,before.resources);assert.deepEqual(after.dependencies,before.dependencies);assert(after.links.every(link=>![link.source_unit_id,link.from.unit_id,link.to.unit_id].some(id=>spares.has(id))));
});
test("Intercambiar monitor cambia sólo su identidad de extremo, no sus puertos",()=>{
 const a=p.addSpareUnit(fixture(),"smallhd-indie-7"),b=p.updateRigUnit(a,a.units.at(-1).id,{role:"rig"}),before=graph(a),after=graph(b);
 assert.equal(after.issues.length,0);for(const old of before.links){const next=after.links.find(link=>link.cable_id===old.cable_id);assert.equal(next.from.port_id,old.from.port_id);assert.equal(next.to.port_id,old.to.port_id);if(old.to.part_id==="smallhd-indie-7")assert.equal(next.to.unit_id,b.units.at(-1).id);else assert.deepEqual(next,old);}
 assert.notEqual(revision(a),revision(b));
});
test("Intercambiar cable cambia la unidad portadora sin generar otra salida HDMI",()=>{
 const a=p.addSpareUnit(fixture(),"kondor-blue-hdmi-aa"),b=p.updateRigUnit(a,a.units.at(-1).id,{role:"rig"}),link=graph(b).links.find(link=>link.cable_id==="vid-fx3-to-smallhd");assert.equal(link.source_unit_id,b.units.at(-1).id);assert.equal(graph(b).links.filter(link=>link.from.port_id==="fx3-hdmi").length,1);assert.notEqual(revision(a),revision(b));
});
test("Cambiar anfitrión vuelve a identificar el asiento sin duplicarlo",()=>{
 const a=p.addSpareUnit(fixture(),"smallrig-4770"),b=p.updateRigUnit(a,a.units.at(-1).id,{role:"rig"}),old=graph(a).resources.find(r=>r.resource.id==="cage-nato"),next=graph(b).resources.find(r=>r.resource.id==="cage-nato");assert.notEqual(old.id,next.id);assert.equal(next.host_unit_id,b.units.at(-1).id);assert.deepEqual(next.active_unit_ids,old.active_unit_ids);
});
test("Renombrar, guardar y añadir repuesto no conserva falsos cambios de montaje",()=>{
 const rig=fixture(),named=p.updateRigUnit(rig,rig.units[0].id,{label:"Cámara A"});assert.equal(revision(named),revision(rig));assert.equal(revision({...rig,updated_at:new Date().toISOString()}),revision(rig));assert.equal(revision(p.addSpareUnit(rig,"smallhd-indie-7")),revision(rig));
});
test("Cambiar pose o la unidad del soporte exige revisar nuevamente",()=>{
 const rig=fixture(),pose={...rig,adjustments:{monitor:{mount_id:"smallrig-2906b",tilt_deg:25,swivel_deg:0}}};assert.notEqual(revision(pose),revision(rig));const spare=p.addSpareUnit(rig,"smallrig-2906b");assert.notEqual(revision(p.updateRigUnit(spare,spare.units.at(-1).id,{role:"rig"})),revision(rig));
});
test("Quitar soporte conserva monitor pendiente y no roba el repuesto",()=>{
 const a=p.addSpareUnit(fixture(),"smallrig-2906b"),b=p.removeRigUnit(a,unit(a,"smallrig-2906b").id),result=graph(b);assert.equal(result.units.find(u=>u.part_id==="smallhd-indie-7"&&u.role==="rig").state,"pending");assert(!result.links.some(link=>link.to.part_id==="smallhd-indie-7"));assert(!result.dependencies.some(edge=>edge.support_unit_id===a.units.at(-1).id));
});
test("Dos primarias del mismo SKU o IDs repetidos no producen asignaciones",()=>{
 const rig=fixture();for(const units of [[...rig.units,{...rig.units[0],id:"unit-forged"}],[...rig.units,rig.units[0]]]){const result=g.projectUnitGraph({...rig,units},resolve(rig).variant,rules,cables,ports);assert(result.issues.some(i=>i.id==="unit-identity"));assert.equal(result.links.length,0);assert.equal(result.resources.length,0);}
});
test("Un puerto de otro cuerpo bloquea el circuito, no mueve la conexión",()=>{
 const rig=fixture(),altered=cables.map(c=>c.cable_id==="vid-fx3-to-smallhd"?{...c,from_port_id:"fx30-hdmi-out"}:c),result=g.projectUnitGraph(rig,resolve(rig).variant,rules,altered,ports);assert(result.issues.some(i=>i.cable_ids.includes("vid-fx3-to-smallhd")));assert(!result.links.some(link=>link.cable_id==="vid-fx3-to-smallhd"));
});
test("Dos circuitos en un conector se bloquean sin crear un splitter",()=>{
 const rig=fixture(),base=cables.find(c=>c.cable_id==="vid-fx3-to-smallhd"),duplicate={...base,cable_id:"fixture-duplicate"},variant=resolve(rig).variant;const result=g.projectUnitGraph(rig,{...variant,cable_profile_ids:[...variant.cable_profile_ids,duplicate.cable_id]},rules,[...cables,duplicate],ports);assert.equal(result.links.filter(link=>[base.cable_id,duplicate.cable_id].includes(link.cable_id)&&link.state==="blocked").length,2);assert(result.issues.some(issue=>issue.id.startsWith("unit-port:")));
});
test("Un cable independiente no se utiliza dos veces aunque los puertos difieran",()=>{
 const rig=fixture(),base=cables.find(c=>c.cable_id==="vid-fx3-to-smallhd"),duplicate={...base,cable_id:"fixture-second-circuit",from_port_id:"fx3-usbc",to_port_id:"indie7-dc"},variant=resolve(rig).variant;const result=g.projectUnitGraph(rig,{...variant,cable_profile_ids:[...variant.cable_profile_ids,duplicate.cable_id]},rules,[...cables,duplicate],ports);assert(result.issues.some(issue=>issue.id.startsWith("unit-carrier:")));
});
test("Contactos de batería mantienen dos unidades sin cable físico inventado",()=>{
 const rig=fixture(),link=graph(rig).links.find(link=>link.cable_id==="pwr-npfz100-to-fx3-contacts");assert.equal(link.source_unit_id,unit(rig,"sony-np-fz100").id);assert.equal(link.from.unit_id,link.source_unit_id);assert.equal(link.to.unit_id,unit(rig,"sony-fx3").id);
});
test("Capacidad desconocida sigue nula, sólo se informa el grupo canónico",()=>{
 const rig=fixture();assert.equal(g.resourceCapacity(rules.mount_resources.find(r=>r.id==="cage-nato"),rig,rules),1);assert.equal(g.resourceCapacity(rules.mount_resources.find(r=>r.id==="handle-front-shoe"),rig,rules),null);
});
test("FX30 y vertical conservan sus extremos propios y monitor fijo",()=>{
 for(const [camera,context,orientation,extras] of [["sony-fx30","handheld","landscape",["sony-fe-20-f18-g","smallrig-2906b"]],["sony-fx3","gimbal","vertical",["sony-fe-16-35-gm","dji-rs4-pro-combo","dji-rs-bg70","smallrig-3026b"]]]){
  const rig=p.withRigUnits({...p.newRig("Caso"),context,orientation,part_ids:[camera,"smallrig-4770","smallhd-indie-7","sony-np-f970-pro","kondor-blue-hdmi-aa",...extras]}),result=graph(rig);assert.equal(result.issues.length,0);assert(result.links.some(link=>link.from.part_id===camera&&link.to.part_id==="smallhd-indie-7"));if(context==="gimbal")assert(result.resources.some(resource=>resource.resource.id==="gimbal-monitor-side"&&resource.active_unit_ids.length===1));
 }
});
test("Las siete plantillas mantienen su selección y resuelven unidades sin conflictos",()=>{
 const before=JSON.stringify(variants);for(const variant of variants){const rig=p.withRigUnits(p.newRig(variant.label,variant));if(variant.id==="corporate-interview")rig.context="static";const result=graph(rig);assert.equal(result.issues.length,0,variant.id);assert.equal(result.links.length,resolve(rig).variant.cable_profile_ids.length);}assert.equal(JSON.stringify(variants),before);
});
test("Mil subselecciones conservan propiedad y nunca utilizan repuestos",()=>{
 let seed=491;for(let iteration=0;iteration<1000;iteration++){const ids=parts.filter(()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32>.5;}).map(p=>p.id),rig=p.withRigUnits({...p.newRig("Caso aleatorio"),part_ids:ids,context:["gimbal","handheld","static"][iteration%3],orientation:iteration%2?"landscape":"vertical"}),result=graph(rig);assert.equal(result.issues.length,0);const activeIds=new Set(result.units.filter(u=>u.state==="candidate").map(u=>u.id));for(const link of result.links){assert(activeIds.has(link.source_unit_id));assert(link.from.unit_id===null||activeIds.has(link.from.unit_id));assert(link.to.unit_id===null||activeIds.has(link.to.unit_id));}}
});
console.log(`GRAFO POR UNIDAD: ${checks} pruebas, 1000 subselecciones. No certifica montaje ni energización.`);
