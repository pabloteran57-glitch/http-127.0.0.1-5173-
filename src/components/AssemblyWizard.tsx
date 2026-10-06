import { lazy, Suspense, useEffect, useState } from "react";
import { assemblyContent, cablesData, layoutData, plannerData, referencesData } from "../data";
import { assemblyFrame } from "../lib/planner";
import { assemblyTimeline, nextPlaybackIndex } from "../lib/assembly";
import { connectionName, partName } from "../lib/ui";
import { publicDemo } from "../lib/publication";
import type { Variant } from "../lib/types";
import type { ViewAngle } from "./RigViewer";
import Icon from "./Icon";

const RigViewer = lazy(() => import("./RigViewer"));
type Timeline = ReturnType<typeof assemblyTimeline>;
interface Props { variant: Variant; chosenIds: string[]; active: boolean; onEdit: () => void }

export default function AssemblyWizard(props: Props) {
  const revision = [props.variant.id, [...props.chosenIds].sort().join(","), [...props.variant.active_part_ids].sort().join(","), [...props.variant.cable_profile_ids].sort().join(","), props.variant.viewer.mode].join("|");
  const [reviews, setReviews] = useState<Record<string, number[]>>({});
  const timeline = assemblyTimeline(props.variant, plannerData, cablesData.cables, assemblyContent);
  const checks = reviews[revision] ?? [];
  const review = (number: number, checked: boolean) => setReviews(previous => {
    const next = new Set(previous[revision] ?? []);
    checked ? next.add(number) : next.delete(number);
    return { ...previous, [revision]: [...next] };
  });
  if (!timeline.length) return <section className="assembly-empty"><Icon name="assemble"/><h2>El montaje empieza con tu cámara</h2><p>Elige un núcleo montable. Los accesorios pendientes se conservan en tu lista, pero no se presentan como instalados.</p><button className="primary-button" onClick={props.onEdit}>Elegir mis piezas</button></section>;
  return <AssemblySession key={revision} {...props} timeline={timeline} checks={checks} onReview={review}/>;
}

function AssemblySession({ variant, chosenIds, active, onEdit, timeline, checks, onReview }: Props & { timeline: Timeline; checks: number[]; onReview: (number: number, checked: boolean) => void }) {
  const [cursor, setCursor] = useState({ index: 0, epoch: 0, started: performance.now() });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [angle, setAngle] = useState<ViewAngle>("iso");
  const [resetKey, setResetKey] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [selectedCableId, setSelectedCableId] = useState<string | null>(null);
  const [ready, setReady] = useState<{ token: string; ms: number } | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const step = timeline[cursor.index];
  const token = `${cursor.index}:${cursor.epoch}`;
  const frame = assemblyFrame(variant, step.number, plannerData, cablesData.cables);
  const nodes = layoutData.nodes.filter(n => frame.variant.active_part_ids.includes(n.id));
  const visualCount = nodes.filter(n => !frame.context_ids.includes(n.id)).length;
  const newVisible = frame.new_ids.some(id => nodes.some(n => n.id === id));
  const playable = timeline.filter(s => s.playable);
  const reviewed = playable.filter(s => checks.includes(s.number)).length;
  const pending = chosenIds.filter(id => !variant.active_part_ids.includes(id));
  const prepared = !visualCount || ready?.token === token;
  const next = nextPlaybackIndex(timeline, cursor.index);
  const completed = next === -1 && step.playable;

  const move = (index: number) => {
    setCursor(previous => ({ index, epoch: previous.epoch + 1, started: performance.now() }));
    setSelectedId("");
    setSelectedCableId(null);
  };
  const focusScene = () => requestAnimationFrame(() => document.getElementById("assembly-visual")?.scrollIntoView({ block: "start", behavior: "auto" }));
  const go = (index: number) => { setPlaying(false); move(index); focusScene(); };
  useEffect(() => {
    if (!active) { setPlaying(false); setReady(null); }
    else setCursor(previous => ({ ...previous, epoch: previous.epoch + 1, started: performance.now() }));
  }, [active]);
  useEffect(() => {
    const pauseWhenHidden = () => { if (document.visibilityState !== "visible") setPlaying(false); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);
  useEffect(() => {
    if (!playing || !active || !prepared || unavailable || !step.playable) return;
    const timer = window.setTimeout(() => {
      if (document.visibilityState !== "visible") { setPlaying(false); return; }
      if (next === -1) setPlaying(false);
      else move(next);
    }, 4500 / speed);
    return () => window.clearTimeout(timer);
  }, [playing, active, prepared, unavailable, token, next, speed, step.playable]);

  const manualId = step.number === 5 && step.part_ids.includes("smallrig-3203b") ? "smallrig-3203b-manual"
    : step.number === 6 && step.part_ids.includes("smallrig-3026b") ? "smallrig-3026b-manual" : null;
  const manual = referencesData.documents.find(d => d.id === manualId);
  const focusId = nodes.some(n => n.id === selectedId) ? selectedId : frame.new_ids[0] ?? "";
  const stageText = step.kind === "optional" ? "Modo opcional" : `Etapa ${playable.findIndex(s => s.number === step.number) + 1} de ${playable.length}`;

  return <div className="assembly-workspace visual-assembly" data-assembly-step={step.number} data-playing={playing} data-ready={prepared}>
    <aside className="step-navigation" aria-label="Etapas de tu rig"><p className="eyebrow">TU MONTAJE / {playable.length} ETAPAS</p>
      {timeline.map((s, i) => <button key={s.number} data-step-number={s.number} aria-current={cursor.index === i ? "step" : undefined} onClick={() => go(i)}><span>{checks.includes(s.number) ? <Icon name="check"/> : s.playable ? String(i + 1).padStart(2, "0") : "+"}</span><div>{s.title}{!s.playable && <small>Opcional · fuera de reproducción</small>}</div></button>)}
    </aside>
    <div className="assembly-main"><section id="assembly-visual" className="assembly-visual" aria-label="Ensamblaje visual por etapas">
      <div className="assembly-view-toolbar"><span><b>{step.playable ? String(cursor.index + 1).padStart(2, "0") : "+"}</b>{step.title}</span><div><select aria-label="Vista del ensamblaje" value={angle} onChange={e => { setPlaying(false); setAngle(e.target.value as ViewAngle); }}><option value="iso">Vista 3/4</option><option value="side">Lateral</option><option value="front">Frontal</option></select><button className="icon-button" aria-label="Recentrar ensamblaje" onClick={() => { setPlaying(false); setResetKey(k => k + 1); }}><Icon name="reset"/></button></div></div>
      {!active ? <div className="viewer-fallback">Visor en pausa mientras configuras el plan.</div> : visualCount ? <Suspense fallback={<div className="viewer-fallback"><span className="loading-ring"/>Preparando tu montaje...</div>}><RigViewer variant={frame.variant} exploded={false} showLabels={false} showCables selectedId={focusId} onSelect={id => { setPlaying(false); setSelectedCableId(null); setSelectedId(id); }} angle={angle} selectedCableId={selectedCableId} resetKey={resetKey} highlightIds={frame.new_ids} contextIds={frame.context_ids} reveal framing={variant.active_part_ids.includes("dji-rs4-pro-combo") ? "gimbal" : "handheld"} sceneKey={token} onSceneReady={() => setReady({ token, ms: Math.round(performance.now() - cursor.started) })} onUnavailable={() => { setUnavailable(true); setPlaying(false); }} onInteract={() => setPlaying(false)}/></Suspense> : <div className="rig-empty-canvas"><Icon name="assemble"/><h3>Comprobación sin modelo adicional</h3><p>Esta etapa no añade geometría de accesorios no elegidos.</p></div>}
      <div className="assembly-stage-note"><span className="new-parts-dot"/>{newVisible ? "Nuevas piezas resaltadas" : step.cable_ids.length ? "Conexiones añadidas · elige una ruta para verla" : "Comprobación · sin añadir piezas"}{frame.context_ids.length > 0 && <span> · Soporte translúcido: sólo contexto</span>}<small>{visualCount} piezas representadas · Transición ilustrativa, no inserción física</small></div>
      <div className="assembly-playback"><button className="quiet-button" disabled={!active || cursor.index === 0} onClick={() => go(cursor.index - 1)}>Anterior</button><button className="primary-button playback-button" disabled={!active || unavailable} aria-pressed={playing} onClick={() => {
        if (playing) setPlaying(false);
        else { if (completed || !step.playable) move(0); setPlaying(true); }
      }}><Icon name={playing ? "pause" : "play"}/>{playing ? "Pausar" : completed || !step.playable ? "Reproducir de nuevo" : "Reproducir"}</button><button className="quiet-button" disabled={!active || cursor.index === timeline.length - 1} onClick={() => go(cursor.index + 1)}>Siguiente<Icon name="arrow"/></button></div>
      <div className="assembly-transport"><button className="icon-button" aria-label="Reiniciar montaje" disabled={!active} onClick={() => go(0)}><Icon name="reset"/></button><label className="assembly-seek"><span>{stageText}</span><input type="range" aria-label="Ir a etapa del montaje" min={0} max={timeline.length - 1} step={1} value={cursor.index} disabled={!active} onChange={e => go(Number(e.target.value))}/></label><label className="assembly-speed"><span>Ritmo</span><select aria-label="Ritmo de reproducción" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={.5}>0,5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
      <p className="playback-status" role="status">{unavailable ? "El visor no está disponible. Puedes continuar con la guía y sus comprobaciones." : playing && !prepared ? "Esperando a que la escena esté lista..." : playing ? "Reproduciendo · gira la vista o elige una pieza para pausar." : completed ? "Ensamblaje visual listo. Las comprobaciones físicas siguen pendientes." : step.kind === "optional" ? "Extracción opcional. No forma parte de la reproducción automática." : "Avanza a tu ritmo o reproduce las etapas de tu selección."}</p>
    </section>
    <article className="step-focus"><div className="assembly-progress"><span>{stageText}</span><span>{reviewed} / {playable.length} revisadas</span><div role="progressbar" aria-label="Etapas revisadas en este perfil" aria-valuemin={0} aria-valuemax={playable.length} aria-valuenow={reviewed}><i style={{ width: `${reviewed / playable.length * 100}%` }}/></div></div><h2>{step.title}</h2><p className="frame-note">{step.note}</p>
      <div className="step-part-chips">{step.part_ids.map(id => nodes.some(n => n.id === id) ? <button key={id} aria-pressed={focusId === id} onClick={() => { setPlaying(false); setSelectedCableId(null); setSelectedId(id); focusScene(); }}>{partName(id)}</button> : <span key={id} title="Sin modelo 3D de montaje">{partName(id)}</span>)}{step.cable_ids.map(id => <button key={id} className="cable-chip" aria-pressed={selectedCableId === id} onClick={() => { setPlaying(false); setSelectedCableId(id); focusScene(); }}>{connectionName(id)}</button>)}</div>
      <details className="assembly-mount-details"><summary>Ubicación y montaje</summary>{step.blocks.map((block, i) => <div className="step-location" key={i}><small>QUÉ PREPARAR</small><strong>{block.mount}</strong><small>DÓNDE</small><p>{block.where}</p></div>)}</details>
      <h3>Antes de continuar</h3><ul className="check-list">{[...new Set(step.blocks.flatMap(b => b.verify))].map(item => <li key={item}>{item}</li>)}</ul><p className="rebalance"><b>Equilibrio:</b> {step.rebalance}</p>
      {!publicDemo && manualId && <img className="assembly-reference" src={manualId === "smallrig-3203b-manual" ? "/references/3203b-diagram-5.png" : "/references/3026b-diagram-7.png"} alt={manualId === "smallrig-3203b-manual" ? "Abrazadera 3203B documentada en el manual" : "Orientación y límite estático publicado del 3026B"}/>}
      {manual && <a className="assembly-source" href={manual.url} target="_blank" rel="noreferrer">Consultar manual oficial · página {step.number === 5 ? "5" : "7"}</a>}
      <label className="step-confirm"><input type="checkbox" checked={checks.includes(step.number)} onChange={e => onReview(step.number, e.target.checked)}/><span>He revisado esta etapa<small>Revisión de lectura, no certificación física.</small></span></label>
      {ready?.token === token && <details className="assembly-timing"><summary>Diagnóstico del visor</summary><p data-scene-ready-ms={ready.ms}>Preparación hasta dos fotogramas de escena: {ready.ms} ms, aproximadamente. No mide fluidez sostenida ni finalización GPU.</p></details>}
    </article>
    {pending.length > 0 && <details className="assembly-pending"><summary>{pending.length} {pending.length === 1 ? "elemento elegido pendiente" : "elementos elegidos pendientes"} de montaje</summary><p>No se añaden al ensamblaje sin resolver sus dependencias.</p><ul>{pending.map(id => <li key={id}>{partName(id)}</li>)}</ul><button className="quiet-button" onClick={onEdit}>Revisar mis piezas</button></details>}
    </div>
  </div>;
}
