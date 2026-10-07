import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import type { ModelAsset } from "../lib/model-assets";

const load = () => import("./PartModelDialog");
class DetailBoundary extends Component<{ children: ReactNode; onRetry: () => void; onClose: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div role="status" className="model-detail-recovery"><p>No se pudo abrir el detalle. Tu rig sigue intacto.</p><button className="quiet-button" onClick={this.props.onRetry}>Reintentar detalle</button><button className="quiet-button" onClick={this.props.onClose}>Cerrar detalle</button></div> : this.props.children; }
}

export default function PartModelLoader(props: { asset: ModelAsset; label: string; onClose: () => void }) {
  const [Detail, setDetail] = useState(() => lazy(load)), [attempt, setAttempt] = useState(0);
  return <DetailBoundary key={attempt} onClose={props.onClose} onRetry={() => { setDetail(() => lazy(load)); setAttempt(v => v + 1); }}><Suspense fallback={<p role="status">Abriendo detalle 3D...</p>}><Detail {...props} /></Suspense></DetailBoundary>;
}
