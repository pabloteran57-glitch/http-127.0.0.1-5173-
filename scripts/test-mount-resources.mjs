import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "typescript";

const code = ts.transpileModule(readFileSync(new URL("../src/lib/planner.ts", import.meta.url), "utf8"), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
const planner = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const rig = {schema_version:1,id:"rig-resource-test",name:"Prueba de anclaje",context:"handheld",orientation:"landscape",part_ids:["cage","shoe-mount","rx"],updated_at:"2026-10-08T00:00:00Z"};
const group = {id:"shared-shoe",part_ids:["shoe-mount","rx"],max_active:1,condition:{none:["handle"],not_context:"gimbal"},message:"Una zapata no admite dos accesorios."};
const rules = {planning_root_part_ids:["cage"],mount_dependencies:{"shoe-mount":["cage"],rx:["cage"],handle:["cage"]},exclusive_selection_groups:[group],parked_part_ids:[],gimbal_only_part_ids:[],gimbal_excluded_part_ids:[],vertical_excluded_part_ids:[],selection_checks:[],cable_exclusions:[],viewer_routes:[{id:"test",condition:{}}],viewer_route_part_ids:[]};
const master = {active_part_ids:[],cable_profile_ids:[]};
const resolve = input => planner.resolveRig(input,rules,[],master,id=>id);
assert(resolve(rig).parked_ids.includes("rx"));
const separate = {...rig,part_ids:[...rig.part_ids,"handle"]};
assert.deepEqual(resolve(separate).parked_ids,[],"Una condición falsa no debe bloquear dos anclajes distintos.");
assert.equal(planner.selectionConflictProblem("rx",separate,rules),null);
assert.deepEqual(rig.part_ids,["cage","shoe-mount","rx"]);
console.log("RECURSOS: conflicto real rechazado; condición falsa y selección original conservadas.");
