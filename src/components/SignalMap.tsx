import { cableById, cablesData } from "../data";
import type { Variant } from "../lib/types";
import { connectionKind } from "../lib/ui";

export default function SignalMap({ variant, bench }: { variant: Variant; bench: boolean }) {
  const ids = bench ? cablesData.profiles.requested_dual_feed_bench : variant.cable_profile_ids;
  return <div className="signal-map">
    <div className="signal-header"><span className="eyebrow">{bench ? "TOPOLOGÍA SOLICITADA / BANCO" : "TOPOLOGÍA / PERFIL ACTIVO"}</span><span className="status parked">ESQUEMA, NO RUTA FÍSICA</span></div>
    <div className="signal-rows">{ids.map(id => {
      const c = cableById[id];
      const color = cablesData.color_coding[c.type === "data" ? "control" : c.type];
      return <div className="signal-row" key={id} style={{ "--route-color": color } as React.CSSProperties}>
        <span className="signal-device">{c.source}</span><span className="signal-link"><i /><small>{connectionKind(c.type)}</small><b>→</b></span><span className="signal-device">{c.destination}</span>
      </div>;
    })}</div>
    <p className="signal-caption">{bench ? "FX3: una salida HDMI. El distribuidor usa entrada cautiva, dos salidas y fuente incluida de 5 V. RavenEye: batería interna. Ensayar señal 1080p progresiva y EDID. Sin soporte aprobado para gimbal." : "El HDMI y la alimentación del monitor cruzan del conjunto móvil al soporte fijo. La curva 3D no valida holgura ni giro continuo. Verificar cada ángulo en banco."}</p>
  </div>;
}

