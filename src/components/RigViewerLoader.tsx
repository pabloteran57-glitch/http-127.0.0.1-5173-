import { Component, lazy, Suspense, useState, type ComponentProps, type ComponentType, type ReactNode } from "react";

type ViewerProps = ComponentProps<typeof import("./RigViewer").default>;
export type ViewerModuleLoader = () => Promise<{ default: ComponentType<ViewerProps> }>;
const loadViewer: ViewerModuleLoader = () => import("./RigViewer");

class ModuleBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void; onRetry: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() {
    return this.state.failed ? <div className="viewer-fallback viewer-recovery" role="status"><p>No se pudo cargar el visor. Tus piezas y la guía siguen disponibles.</p><button className="quiet-button" onClick={this.props.onRetry}>Reintentar visor</button></div> : this.props.children;
  }
}

export default function RigViewerLoader({ loadingMessage = "Abriendo tu rig...", load = loadViewer, ...props }: ViewerProps & { loadingMessage?: string; load?: ViewerModuleLoader }) {
  const [Viewer, setViewer] = useState(() => lazy(load));
  const [attempt, setAttempt] = useState(0);
  const retry = () => {
    props.onInteract?.(); props.onScenePreparing?.();
    setViewer(() => lazy(load)); setAttempt(value => value + 1);
  };
  return <ModuleBoundary key={attempt} onUnavailable={props.onUnavailable} onRetry={retry}><Suspense fallback={<div className="viewer-fallback" role="status"><span className="loading-ring"/>{loadingMessage}</div>}><Viewer {...props}/></Suspense></ModuleBoundary>;
}
