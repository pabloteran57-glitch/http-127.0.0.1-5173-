import coverage from "../../data/setup-coverage.json";
import type {CustomRig} from "../lib/types";

export default function SetupChecklist({context}:{context:CustomRig["context"]}){
  const target=coverage.setup_targets.find(target=>target.id===context);
  return <details className="selection-review setup-checklist"><summary>Preparar el setup completo <span>{coverage.families.length} áreas</span></summary>
    <div className="review-checks"><p>Lista de comprobación, no aprobación automática. Los pendientes de tus piezas se muestran en «Revisar montaje y conexiones».</p>
      {target&&<p>{target.note}</p>}
      {coverage.families.map(family=><details key={family.id}><summary>{family.label}</summary><p>{family.required_check}</p></details>)}
      <p>4346 lateral, kit de hombro 2896C y trípode AD-01 3751B tienen cadenas candidatas acotadas. No son montajes universales ni ensayos físicos; otros agarres y apoyos siguen en investigación.</p>
    </div>
  </details>;
}
