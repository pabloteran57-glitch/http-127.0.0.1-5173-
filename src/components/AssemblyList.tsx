import { useState } from "react";
import { assemblySteps } from "../data";
export default function AssemblyList() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  return <div className="assembly-panel">
    <div className="assembly-progress"><span className="mono">{checked.size.toString().padStart(2, "0")} / 13 REVISADOS EN ESTA SESIÓN</span><span>Lista de comprobaciones, no certificación automática</span><progress value={checked.size} max={13} /></div>
    {assemblySteps.map(step => <div className="assembly-row" key={step.number}>
      <label className="step-check"><input type="checkbox" aria-label={`Revisar paso ${step.number}`} checked={checked.has(step.number)} onChange={e => setChecked(prev => { const next = new Set(prev); e.target.checked ? next.add(step.number) : next.delete(step.number); return next; })} /><span>{step.number.toString().padStart(2, "0")}</span></label>
      <details><summary>{step.title}<span>+</span></summary><div className="step-detail"><p><b>Montar:</b> {step.mount}</p><p><b>Ubicación:</b> {step.where}</p><ul>{step.verify.map(v => <li key={v}>{v}</li>)}</ul><p className="rebalance"><b>Equilibrio:</b> {step.rebalance}</p></div></details>
    </div>)}
  </div>;
}

