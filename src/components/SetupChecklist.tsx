import coverage from "../../data/setup-coverage.json";
import type {CustomRig} from "../lib/types";

export default function SetupChecklist({context}:{context:CustomRig["context"]}){
  const target=coverage.setup_targets.find(target=>target.id===context);
  return <details className="selection-review setup-checklist"><summary>Preparar el setup completo <span>{coverage.families.length} áreas</span></summary>
    <div className="review-checks"><p>Lista de comprobación, no aprobación automática. Los pendientes de tus piezas se muestran en «Revisar montaje y conexiones».</p>
      {target&&<p>{target.note}</p>}
      {coverage.families.map(family=><details key={family.id}><summary>{family.label}</summary><p>{family.required_check}</p></details>)}
      <p>Empuñaduras laterales y setups de hombro están en verificación. Aún no son piezas o montajes seleccionables; no se sustituyen por brazos de gimbal.</p>
    </div>
  </details>;
}
