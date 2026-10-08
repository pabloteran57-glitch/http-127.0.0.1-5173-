import { lazy, Suspense, useEffect, useRef, useState } from "react";
import registry from "../../data/pilot-model-assets.json";
import intake from "../../data/catalog-intake.json";
import { pilotModelIssues, type PilotModelAsset } from "../lib/pilot-model-assets";

const PartModelDialog = lazy(() => import("./PartModelDialog"));
const models = (registry.assets as PilotModelAsset[]).filter(asset => pilotModelIssues(asset, intake.products.find(product => product.id === asset.part_id)).length === 0);

export default function PilotModels() {
  const [selected, setSelected] = useState<PilotModelAsset | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { if (!selected) trigger.current?.focus(); }, [selected]);
  return <>
    <p>Estas piezas ya están en Crear rig: FX30, FE 20mm F1.8 G y NP-FZ100 para el piloto a mano y horizontal. Aquí puedes inspeccionar sus modelos propios aproximados por separado.</p>
    <div className="pilot-model-cards">{models.map(asset => {
      const product = intake.products.find(item => item.id === asset.part_id)!;
      const dimensions = product.dimensions;
      const size = "diameter_mm" in dimensions ? `Ø ${dimensions.diameter_mm} × ${dimensions.length_mm} mm` : `${dimensions.width_mm} × ${dimensions.height_mm} × ${dimensions.depth_mm} mm`;
      return <button key={asset.id} className="pilot-model-card" onClick={event => { trigger.current = event.currentTarget; setSelected(asset); }} aria-label={`Inspeccionar ${product.exact_product_name} en 3D`}>
        <img src={asset.image.path} alt="" width={400} height={280} loading="lazy" />
        <strong>{product.model_number}</strong><span>{size}{dimensions.approximate ? " aprox." : ""}</span><span>{product.weight_g} g{product.weight_approximate ? " aprox." : ""}{product.category === "camera" ? " · cuerpo solo" : ""}</span><span className="pilot-model-cta">Inspeccionar en 3D</span>
      </button>;
    })}</div>
    {!models.length && <p role="status">Los modelos esperan una revisión válida; tus rigs siguen disponibles.</p>}
    <p className="pilot-model-disclaimer">Montajes y holguras pendientes de ensayo. Añade únicamente las piezas que quieras; tus rigs existentes no cambian.</p>
    {selected && <Suspense fallback={<p role="status">Abriendo inspección 3D…</p>}><PartModelDialog asset={selected} label={selected.exact_product_name} research onClose={() => setSelected(null)} /></Suspense>}
  </>;
}
