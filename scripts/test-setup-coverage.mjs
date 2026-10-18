import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const intake=read("support-intake"),coverage=read("setup-coverage"),parts=read("parts-manifest").parts,sources=read("sources").sources,rules=read("planner-rules"),layout=read("layout-manifest"),variants=read("variants").variants;
let checks=0;const test=(name,run)=>{run();checks++;console.log(`CORRECTO: ${name}`);};
test("Seis fichas conservadas y dos altas explícitas separadas",()=>{
 assert.equal(intake.products.length,6);assert.equal(intake.selectable_promotions.length,2);assert.equal(intake.physical_validation.status,"pending");assert.deepEqual(intake.physical_validation.observations,[]);for(const item of intake.products){assert.equal(item.status,"research_only");assert.equal(item.selectable,false);assert(!parts.some(p=>p.id===item.id));assert(!layout.nodes.some(p=>p.id===item.id));assert(!JSON.stringify(rules).includes(JSON.stringify(item.id)));}for(const promotion of intake.selectable_promotions){assert(intake.products.some(item=>item.id===promotion.intake_id));assert(parts.some(p=>p.id===promotion.part_id));assert(layout.nodes.some(p=>p.id===promotion.part_id));assert(read("catalog-promotions").promotions.some(p=>p.id===promotion.promotion_id&&p.part_ids.includes(promotion.part_id)));}
});
test("Cada SKU mantiene fuente oficial propia y localizador de sus cifras",()=>{
 assert.equal(new Set(intake.products.map(item=>item.id)).size,6);for(const item of intake.products){const source=sources.find(s=>s.id===item.primary_source_id);assert.equal(source.type,"official");assert(source.review_subject_part_ids.includes(item.id));for(const field of [item.dimensions_mm,item.weight_g])if(field){assert(field.source_locator);assert(field.basis);}}
});
test("2896C conserva BOM completo, peso neto y barras distintas de ocho pulgadas",()=>{
 const item=intake.products.find(p=>p.model_number==="2896C");assert.equal(item.weight_g.value,1260);assert.equal(item.weight_g.tolerance,5);assert.deepEqual(item.dimensions_mm.value,[510,300,180]);assert.equal(item.included.find(row=>row.item==="Empuñadura").quantity,2);assert.equal(item.included.find(row=>row.item==="Varilla de 15 mm y 400 mm").quantity,2);assert.equal(item.included.find(row=>row.item==="Varilla de 15 mm y 300 mm").quantity,1);assert(item.pending.some(note=>note.includes("1674")));
});
test("4346, 4015 y 4016 mantienen interfaces diferentes sin pareja universal",()=>{
 const a=intake.products.find(p=>p.model_number==="4346"),b=intake.products.find(p=>p.model_number==="4015"),c=intake.products.find(p=>p.model_number==="4016");assert(a.interfaces.some(text=>text.includes("1/4-20")));assert(b.interfaces.some(text=>text.includes("18 mm")));assert.deepEqual(c.interfaces,["Localización ARRI 3/8-16"]);assert(a.candidate_relation.includes("no pareja certificada"));assert.equal(c.weight_g,null);assert.equal(c.dimensions_mm,null);
});
test("Tilta mantiene masa disputada y no promete placa universal",()=>{
 const item=intake.products.find(p=>p.model_number==="TA-LSR-B");assert.equal(item.weight_g,null);assert.equal(item.dimensions_mm,null);assert(item.pending.some(note=>note.includes("1.7 kg")&&note.includes("7.7 lb")));assert(item.pending.some(note=>note.includes("no cualquier")));
});
test("VCT y fichas parciales no se convierten en medidas verificadas",()=>{
 const item=intake.products.find(p=>p.model_number==="4274B");assert.equal(item.weight_g,null);assert.equal(item.dimensions_mm,null);assert(item.interfaces.some(note=>note.includes("no VCT-U14")));
});
test("Cobertura exige doce familias y conserva adiciones explícitas",()=>{
 assert.equal(coverage.families.length,12);assert.equal(new Set(coverage.families.map(f=>f.id)).size,12);assert.equal(coverage.automatic_part_insertion,false);assert.equal(coverage.catalog_complete,false);assert.equal(coverage.universal_compatibility,false);for(const family of coverage.families)assert(family.required_check.length>50);
});
test("Hombro candidato sin prueba física; trípode pendiente y agarre nativo válido",()=>{
 assert.equal(coverage.setup_targets.find(t=>t.id==="shoulder").status,"fx3_2896c_planning_candidate_physical_checks_pending");assert.equal(coverage.setup_targets.find(t=>t.id==="handheld").native_grip_is_valid,true);assert.match(coverage.setup_targets.find(t=>t.id==="static").status,/pending/);assert.equal(variants.length,7);for(const target of coverage.setup_targets)for(const id of target.pending_intake_ids){assert(intake.products.some(item=>item.id===id));assert(!intake.selectable_promotions.some(p=>p.intake_id===id));}
});
console.log(`COBERTURA: ${checks} comprobaciones. Dos altas separadas, cuatro candidatos pendientes; no ensayos físicos.`);
