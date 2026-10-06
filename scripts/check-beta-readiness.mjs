import {readFileSync,existsSync} from "node:fs";
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const evidence=read("beta-evidence"),protocol=read("beta-protocol"),intake=read("catalog-intake"),funding=read("funding-plan");
const valid=evidence.observations.filter(o=>protocol.tasks.some(t=>t.id===o.task_id)&&typeof o.completed==="boolean"&&Number.isFinite(o.assistance_count)&&Number.isFinite(o.elapsed_seconds));
const completed=valid.filter(o=>o.completed&&o.assistance_count===0).length;
const participants=new Set(valid.map(o=>o.participant_alias)).size;
const failures=evidence.issues.filter(i=>["critical","high"].includes(i.severity)&&i.status!=="closed");
const gates=[
  {name:"Protocolos y entregables preparatorios",pass:["beta-protocol.md","release-operations.md","funding-readiness.md","durable-projects.md","extensible-engineering.md","catalog-pilot.md"].every(path=>existsSync(new URL(`../docs/${path}`,import.meta.url)))},
  {name:`Participantes observados: ${participants} / mínimo propuesto ${protocol.cohort.target_min}`,pass:participants>=protocol.cohort.target_min},
  {name:`Finalización sin ayuda: ${completed} / ${valid.length} tareas válidas${valid.length?` (${(completed/valid.length*100).toFixed(1)}%)`:"; sin tasa calculable"}`,pass:valid.length>0&&completed/valid.length>=protocol.proposed_success_rate},
  {name:"Dispositivos físicos de referencia y comparación",pass:evidence.reference_devices.length>=2},
  {name:"Ensayos físicos trazables",pass:evidence.physical_trials.some(t=>t.status==="passed"&&t.evidence_paths?.length)},
  {name:"Productos piloto liberados con cadenas completas",pass:intake.products.some(p=>p.release_status==="planning_candidate")},
  {name:"Privacidad revisada con evidencia",pass:evidence.privacy_review?.status==="approved"&&evidence.privacy_review.evidence_paths?.length>0},
  {name:"Canal y responsable de soporte comprobados",pass:evidence.support_setup?.status==="verified"&&!!evidence.support_setup.channel&&!!evidence.support_setup.responsible&&evidence.support_setup.evidence_paths?.length>0},
  {name:`Incidencias críticas/altas abiertas: ${failures.length}; registro sin observaciones no certifica ausencia de errores`,pass:valid.length>0&&failures.length===0},
  {name:"Presupuesto cotizado y elegibilidad de financiación",pass:funding.budget_lines.every(line=>Number.isFinite(line.amount)&&line.quotes.length)&&!!funding.platform&&!!funding.legal_entity}
];
for(const gate of gates)console.log(`${gate.pass?"PREPARADO":"PENDIENTE"}: ${gate.name}`);
console.log("ESTADO: prototipo de ingeniería. Cuentas y sincronización aplazadas por decisión del usuario; no se anuncian como disponibles.");
console.log("La documentación y las pruebas de software no liberan una beta profesional ni una campaña.");
if(process.argv.includes("--strict")&&gates.some(g=>!g.pass))process.exitCode=1;
