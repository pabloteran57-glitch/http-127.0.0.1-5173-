import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "typescript";
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const moduleOf=async name=>import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`,import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString("base64")}`);
const {attachmentCandidates,applyAttachment,newRig,resolveRig,completionIds,parseLibrary,writeLibrary}=await moduleOf("planner");
const {layoutForVariant}=await moduleOf("viewer"),{assemblyTimeline}=await moduleOf("assembly");
const rules=read("planner-rules"),cables=read("cables-manifest").cables,parts=read("parts-manifest").parts,templates=read("variants").variants,layout=read("layout-manifest"),content=read("assembly-profile-content");
const master=templates.find(template=>template.id===read("variants").master_variant_id);
const rig=(ids,context="handheld",orientation="landscape")=>({schema_version:1,id:"rig-attachment-fixture",name:"Prueba de accesorios",context,orientation,part_ids:ids,updated_at:"2026-10-07T00:00:00Z"});
const core=["sony-fx3","sony-fe-16-35-gm","smallrig-4770"],names=id=>id;
const resolve=input=>resolveRig(input,rules,cables,master,names);
let count=0;const test=(name,run)=>{run();count++;console.log(`CORRECTO: ${name}`);};

test("Rig desde cero no impone estabilizador; copias conservan su contexto",()=>{
  assert.equal(newRig(undefined,undefined,rules.default_context).context,"handheld");
  assert.deepEqual(newRig().part_ids,[]);
  for(const template of templates)assert.equal(newRig("Copia",template,rules.default_context).context,template.viewer.rig_context);
});
test("Completar monitor a mano no propone 3026B ni gimbal",()=>{
  const input=rig([...core,"smallhd-indie-7"]),before=JSON.stringify(input),add=completionIds("smallhd-indie-7",input,rules,resolve(input).variant.cable_profile_ids);
  assert.deepEqual(add,["smallrig-2906b","kondor-blue-hdmi-aa","sony-np-f970-pro"]);
  assert.equal(JSON.stringify(input),before);
});
test("Desde HawkLock se añade monitor completo sin brazo del gimbal",()=>{
  const input=rig(core),before=JSON.stringify(input),next=applyAttachment("cage-monitor","smallrig-4770",input,rules,cables,master);
  assert(next);assert.equal(JSON.stringify(input),before);assert.equal(next.context,"handheld");
  assert.deepEqual(next.part_ids,[...core,"smallrig-2906b","smallhd-indie-7","kondor-blue-hdmi-aa","sony-np-f970-pro"]);
  const result=resolve(next);assert.deepEqual(result.parked_ids,[]);assert.equal(result.variant.viewer.monitor_mount_route,"cage");
  assert(result.variant.cable_profile_ids.includes("vid-fx3-to-smallhd"));assert(result.variant.cable_profile_ids.includes("pwr-npf-to-smallhd-contacts"));
  const node=layoutForVariant(result.variant,layout).nodes.find(node=>node.id==="smallhd-indie-7");assert.equal(node.parent_id,"smallrig-2906b");assert.equal(node.mass_domain,"moving");
  assert(!next.part_ids.includes("smallrig-3026b")&&!next.part_ids.includes("dji-rs4-pro-combo"));
});
test("Montaje acumulativo añade el monitor elegido y no etapas de gimbal",()=>{
  const next=applyAttachment("cage-monitor","smallrig-4770",rig(core),rules,cables,master),variant=resolve(next).variant;
  const timeline=assemblyTimeline(variant,rules,cables,content);assert(timeline.some(step=>step.number===6&&step.part_ids.includes("smallhd-indie-7")));
  assert(!timeline.some(step=>[7,8,10].includes(step.number)));assert(timeline.every(step=>step.part_ids.every(id=>next.part_ids.includes(id))));
});
test("Asa XLR exige 4830; no ocupa el riel desmontable 4770",()=>{
  const input=rig([...core,"sony-xlr-h1"]);assert(!attachmentCandidates("smallrig-4770",input,rules,cables,master).some(item=>item.option.id==="cage-monitor"));
  const next=applyAttachment("xlr-monitor","sony-xlr-h1",input,rules,cables,master);assert(next.part_ids.includes("smallrig-4830"));assert.equal(resolve(next).variant.viewer.monitor_mount_route,"xlr");
});
test("Gimbal activo conserva monitor lateral; no ofrece soporte sobre cámara",()=>{
  const input=rig([...core,"dji-rs4-pro-combo","dji-rs-bg70"],"gimbal");assert(!attachmentCandidates("smallrig-4770",input,rules,cables,master).some(item=>item.option.id==="cage-monitor"));
  const next=applyAttachment("gimbal-monitor","dji-rs4-pro-combo",input,rules,cables,master);assert(next.part_ids.includes("smallrig-3026b"));assert(!next.part_ids.includes("smallrig-2906b"));assert.equal(resolve(next).variant.viewer.monitor_mount_route,"gimbal");
});
test("Vertical permite lateral pero no propone placa V-mount sin soporte",()=>{
  const input=rig([...core,"dji-rs4-pro-combo","dji-rs-bg70"],"gimbal","vertical");assert(applyAttachment("gimbal-monitor","dji-rs4-pro-combo",input,rules,cables,master));
  assert(!attachmentCandidates("smallrig-4770",input,rules,cables,master).some(item=>item.option.id==="cage-base"));
});
test("Cambiar a mano conserva la selección previa y deja 3026B pendiente",()=>{
  const selected=[...core,"dji-rs4-pro-combo","dji-rs-bg70","smallrig-3026b","smallhd-indie-7"],input=rig(selected,"handheld");
  const add=completionIds("smallhd-indie-7",input,rules,[]),result=resolve(rig([...selected,...add],"handheld"));
  assert.deepEqual(input.part_ids,selected);assert(result.parked_ids.includes("smallrig-3026b"));assert(result.variant.active_part_ids.includes("smallhd-indie-7"));assert.equal(result.variant.viewer.monitor_mount_route,"cage");
});
test("Accesorios ya elegidos no se duplican ni cambian la biblioteca",()=>{
  const next=applyAttachment("cage-monitor","smallrig-4770",rig(core),rules,cables,master);assert.equal(applyAttachment("cage-monitor","smallrig-4770",next,rules,cables,master),null);
  assert.equal(new Set(next.part_ids).size,next.part_ids.length);
});
test("Relación, ancla o evidencia ausentes no activan nada",()=>{
  assert.equal(applyAttachment("unknown","smallrig-4770",rig(core),rules,cables,master),null);
  assert.deepEqual(attachmentCandidates("smallrig-4770",rig(["sony-fx3"]),rules,cables,master),[]);
  const custom=structuredClone(rules);custom.attachment_options.forEach(option=>option.source_ids=[]);assert.deepEqual(attachmentCandidates("smallrig-4770",rig(core),custom,cables,master),[]);
});
test("Las propuestas no certifican alimentación externa ni activan reservas",()=>{
  for(const context of ["handheld","static","gimbal"])for(const part of parts){const input=rig(parts.map(part=>part.id).filter(id=>!["smallrig-2906b","smallrig-3026b","smallrig-4830","smallhd-indie-7","sony-np-f970-pro","dji-focus-pro-lidar"].includes(id)),context);
    for(const candidate of attachmentCandidates(part.id,input,rules,cables,master))assert(candidate.add_ids.every(id=>!rules.parked_part_ids.includes(id)));
  }
});
test("Añadidos se guardan y recuperan localmente con elecciones exactas",()=>{
  const map=new Map(),storage={getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};
  const next=applyAttachment("cage-monitor","smallrig-4770",rig(core),rules,cables,master),ids=parts.map(part=>part.id);
  const raw=writeLibrary(storage,null,[next],ids,rules.max_saved_rigs);assert.deepEqual(parseLibrary(raw,ids,rules.max_saved_rigs).rigs[0].part_ids,next.part_ids);
});
test("Añadir desde una copia no cambia las siete plantillas",()=>{
  const before=JSON.stringify(templates),template=templates.find(template=>template.id==="handheld-quick-release"),copy=newRig("Copia",template);
  assert(applyAttachment("xlr-monitor","sony-xlr-h1",copy,rules,cables,master));assert.equal(JSON.stringify(templates),before);
});
console.log(`ACCESORIOS: ${count} pruebas de selección contextual; no ensayos físicos.`);
