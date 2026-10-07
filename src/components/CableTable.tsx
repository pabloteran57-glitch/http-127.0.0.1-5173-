import { cableById, cablesData } from "../data";
import type { Variant } from "../lib/types";
export default function CableTable({ variant, bench = false }: { variant: Variant; bench?: boolean }) {
  const ids = bench ? cablesData.profiles.requested_dual_feed_bench : variant.cable_profile_ids;
  return <div className="connection-grid">{ids.map(id => {
    const c = cableById[id];
    const tone = cablesData.color_coding[c.type === "data" ? "control" : c.type];
    return <details key={id} className="connection-card">
      <summary><span className="route-dot" style={{ background: tone }} /><div><span>{c.source}</span><strong>→ {c.destination}</strong></div><span className="mono">+</span></summary>
      <div className="connection-detail"><p className="mono">{c.cable_id}</p><p>{c.connector_a} → {c.connector_b}</p><p>{c.voltage_or_signal_standard}</p><p><b>Longitud:</b> {c.ideal_length_estimate}</p><p><b>Ruta:</b> {c.routing_path}</p><p><b>Retención:</b> {c.strain_relief_requirement}</p><p className="risk-text">{c.risk_notes.join(" ")}</p></div>
    </details>;
  })}</div>;
}
