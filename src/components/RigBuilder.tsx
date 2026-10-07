import { useDeferredValue, useEffect, useRef, useState } from "react";
import { layoutData, partById, partsData, plannerData } from "../data";
import { availableSupportIds, completionIds, mountDependencies, selectionPresentation, type RigResolution } from "../lib/planner";
import type { CustomRig } from "../lib/types";
import { partName } from "../lib/ui";
import { builderEntries } from "../lib/inventory";
import ui from "../../data/ui-content.json";
import Icon, { type IconName } from "./Icon";
import ProductVisual, { officialVisualLink } from "./ProductVisual";

type BuilderView = "catalog" | "selected" | "settings";
const modeledIds = layoutData.nodes.map(node => node.id);
const stateNames = {visual: "En visor", list: "En tu lista", pending: "Montaje pendiente"};

export default function RigBuilder({open, onClose, rig, resolution, onChange, onSave, dirty, message}: {
  open: boolean; onClose: () => void; rig: CustomRig; resolution: RigResolution;
  onChange: (r: CustomRig) => void; onSave: () => void; dirty: boolean; message: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scrollBody = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<BuilderView>("catalog");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query);

  useEffect(() => {
    if (open && !dialog.current?.open) {
      setView("catalog"); setCategory("all"); setQuery("");
      dialog.current?.showModal();
    }
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);

  const switchView = (next: BuilderView) => {
    setView(next); setQuery(""); scrollBody.current?.scrollTo({top: 0});
  };
  const toggle = (id: string) => onChange({...rig, part_ids: rig.part_ids.includes(id) ? rig.part_ids.filter(p => p !== id) : [...rig.part_ids, id]});
  const add = (ids: string[]) => onChange({...rig, part_ids: [...rig.part_ids, ...ids.filter(id => !rig.part_ids.includes(id))]});
  const entries = builderEntries(partsData.parts, rig.part_ids, plannerData.categories, view === "selected" ? "selected" : "catalog", category, search, partName);
  const rows = selectionPresentation(rig.part_ids, resolution.variant, modeledIds);
  const stateById = Object.fromEntries(rows.map(row => [row.id, row.state]));
  const visibleCount = rows.filter(row => row.state === "visual").length;
  const listCount = rows.filter(row => row.state === "list").length;

  const renderCard = (id: string) => {
    const part = partById[id], chosen = rig.part_ids.includes(id), state = stateById[id];
    const supports = availableSupportIds(mountDependencies(id,plannerData,rig), rig, plannerData);
    const reference = officialVisualLink(id);
    const completion=plannerData.completion_rules?.[id];
    const completionParts=completionIds(id,rig,plannerData,resolution.variant.cable_profile_ids);
    return <article key={id} className={`piece-card ${chosen ? "is-chosen" : ""} ${state === "pending" ? "is-pending" : ""}`} data-builder-part={id} data-selection-state={state ?? "unchosen"}>
      <button type="button" className="piece-choice" aria-label={`${chosen ? "Quitar" : "Añadir"} ${partName(id)}`} aria-pressed={chosen} onClick={() => toggle(id)}>
        <ProductVisual id={id}/>
        <span className="piece-copy"><small>{part.brand} / {part.model_number ?? "Catálogo actual"}</small><strong>{partName(id)}</strong><span>{(ui.builder.roles as Record<string, string>)[id]??part.rig_role}</span></span>
        <span className="piece-badge"><Icon name={chosen ? "check" : "plus"}/>{chosen ? "Elegida · toca para quitar" : "Añadir al rig"}</span>
      </button>
      <div className="piece-card-footer"><a href={reference.href} target="_blank" rel="noreferrer" aria-label={`${reference.label}: ${partName(id)}`}>{reference.label}<Icon name="arrow"/></a>{chosen && <span className="piece-selection-state">{stateNames[state]}</span>}</div>
      {chosen&&completion&&<div className="monitor-placement"><strong>¿Dónde irá el monitor?</strong><label>Montaje<select aria-label={`Montaje de ${partName(id)}`} value={rig.context} onChange={e=>onChange({...rig,context:e.target.value as CustomRig["context"]})}>{ui.builder.contexts.map(context=><option key={context.id} value={context.id}>{context.label}</option>)}</select></label><p>{rig.context==="gimbal"?"NATO lateral del gimbal → 3026B. Fuera de la cámara móvil.":"NATO de la jaula → 2906B. Si elegiste el asa XLR, se usa su riel 4830 → 2906B."}</p><small>Cambiar el montaje conserva todas tus elecciones; las que no correspondan quedan pendientes.</small></div>}
      {completionParts.length>0&&<div className="piece-pending"><p>Para completar esta pieza: {completionParts.map(partName).join(", ")}.</p><button type="button" className="quiet-button" onClick={()=>add(completionParts)}>{completion?.label} ({completionParts.length})</button></div>}
      {chosen && state === "pending" && <div className="piece-pending"><p>{resolution.issues.find(issue => issue.part_id === id)?.message}</p>{supports.length > 0 && !completion && <><p>Añadirá: {supports.map(partName).join(", ")}.</p><button type="button" className="quiet-button" onClick={() => add(supports)}>Añadir soporte ({supports.length})</button></>}</div>}
    </article>;
  };

  return <dialog ref={dialog} className="builder-dialog guided-builder direct-builder" aria-labelledby="builder-title" onCancel={onClose} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">TU EQUIPO, TU PLAN</p><h2 id="builder-title">{view === "catalog" ? "Añade piezas a tu rig" : view === "selected" ? "Tus piezas elegidas" : "Datos del rig"}</h2></div><button type="button" className="icon-button" aria-label="Cerrar editor de rig" onClick={onClose}><Icon name="close"/></button></div>
    <nav className="builder-tabs" aria-label="Vistas del editor">{ui.builder.views.map(item => <button type="button" key={item.id} aria-pressed={view === item.id} onClick={() => switchView(item.id as BuilderView)}>{item.label}{item.id === "selected" && <span>{rig.part_ids.length}</span>}</button>)}</nav>
    <div ref={scrollBody} className="guided-builder-body">
      {view === "settings" ? <section className="builder-start">
        <label className="rig-name-field">Nombre del rig<input aria-label="Nombre del rig" value={rig.name} maxLength={80} onChange={e => onChange({...rig, name: e.target.value})}/></label>
        <h3>¿Cómo vas a rodar?</h3><div className="use-choices">{ui.builder.contexts.map(context => <button type="button" key={context.id} aria-pressed={rig.context === context.id} onClick={() => onChange({...rig, context: context.id as CustomRig["context"]})}><Icon name={context.icon as IconName}/><strong>{context.label}</strong><span>{context.detail}</span></button>)}</div>
        <h3>Encuadre</h3><div className="orientation-choices"><button type="button" aria-pressed={rig.orientation === "landscape"} onClick={() => onChange({...rig, orientation: "landscape"})}><span className="format-outline landscape"/>Horizontal</button><button type="button" aria-pressed={rig.orientation === "vertical"} onClick={() => onChange({...rig, orientation: "vertical"})}><span className="format-outline portrait"/>Vertical 9:16</button></div>
        <p className="builder-tip"><Icon name="info"/>Cambiar estos datos no añade ni elimina tus elecciones. Puedes guardar un plan incompleto.</p>
        <button type="button" className="quiet-button return-to-catalog" onClick={() => switchView("catalog")}>Volver a las piezas</button>
      </section> : <section className="builder-catalog">
        <label className="builder-context-picker">Montaje del rig<select aria-label="Montaje del rig" value={rig.context} onChange={e=>onChange({...rig,context:e.target.value as CustomRig["context"]})}>{ui.builder.contexts.map(context=><option key={context.id} value={context.id}>{context.label}</option>)}</select><span>{ui.builder.contexts.find(context=>context.id===rig.context)?.detail} Cambiar no añade piezas.</span></label>
        <label className="search-field"><Icon name="search"/><input aria-label="Buscar piezas en el editor" placeholder={view === "selected" ? "Buscar en tus piezas elegidas…" : "Buscar cámara, lente o accesorio…"} value={query} onChange={e => {setQuery(e.target.value); if (view === "catalog") setCategory("all");}}/></label>
        {view === "catalog" && <><label className="mobile-category-picker">Categoría<select aria-label="Categoría de piezas" value={category} onChange={e => {setCategory(e.target.value); setQuery(""); scrollBody.current?.scrollTo({top: 0});}}><option value="all">Todas las piezas</option>{plannerData.categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label><div className="catalog-categories" aria-label="Categorías del catálogo"><button type="button" aria-pressed={category === "all" && !query} onClick={() => {setCategory("all"); setQuery("");}}>Todas</button>{plannerData.categories.map(c => <button type="button" key={c.id} aria-pressed={category === c.id && !query} onClick={() => {setCategory(c.id); setQuery("");}}>{c.label}<span aria-hidden="true">{c.part_ids.filter(id => rig.part_ids.includes(id)).length || ""}</span></button>)}</div></>}
        <p className="catalog-count">{view === "catalog" ? `${entries.length} ${entries.length === 1 ? "pieza disponible · toca para añadirla" : "piezas disponibles · toca una para añadirla"}` : `${entries.length} de ${rig.part_ids.length} elegidas · toca una para quitarla`}</p>
        <div className="piece-grid">{entries.map(part => renderCard(part.id))}</div>
        {entries.length === 0 && <div className="empty-state"><p>{query ? "No hay coincidencias en esta vista." : "Aún no has elegido piezas."}</p><button type="button" className="quiet-button" onClick={() => {switchView("catalog"); setCategory("all");}}>Ver todas las piezas</button></div>}
        {view === "selected" && <>
          <details className="selection-review"><summary>Revisar montaje y conexiones <span>{resolution.issues.length} pendientes</span></summary><div className="selection-totals"><strong>{visibleCount}<span>Con modelo en visor</span></strong><strong>{listCount}<span>Sólo en tu lista</span></strong><strong>{resolution.parked_ids.length}<span>Sin soporte activo</span></strong></div><div className="review-checks"><h3>Antes de rodar</h3><p>Guardar no valida el montaje. Comprueba soportes, alimentación y holguras reales antes de encender.</p>{resolution.issues.map(issue => {
            const suggestions = availableSupportIds(issue.add_ids, rig, plannerData);
            return <details key={issue.id}><summary>{issue.part_id ? partName(issue.part_id) : issue.id === "monitor-power" ? "Alimentación del monitor" : issue.id === "vertical-monitor" ? "Monitor en vertical" : issue.id === "monitor-video" ? "Señal del monitor" : issue.message}</summary><p>{issue.message}</p>{suggestions.length > 0 && <><p>Añadirá: {suggestions.map(partName).join(", ")}.</p><button type="button" className="quiet-button" onClick={() => add(suggestions)}>Añadir estas piezas ({suggestions.length})</button></>}</details>;
          })}</div></details>
        </>}
        <details className="visual-policy"><summary>Sobre las imágenes y el catálogo</summary><p>{ui.builder.image_policy}</p><p>{partsData.parts.length} entradas: catálogo original y accesorios de monitor verificados. La selección no activa montajes no documentados.</p></details>
      </section>}
    </div>
    <div className="builder-actions">{message && <p className="builder-feedback" role="status">{message}</p>}{!rig.name.trim() && <p className="builder-feedback" role="status">Escribe un nombre en Datos del rig para guardar.</p>}<span aria-live="polite">{rig.part_ids.length} {rig.part_ids.length === 1 ? "pieza elegida" : "piezas elegidas"} · {dirty ? "Sin guardar" : "Guardado local"}</span><button type="button" className="quiet-button" onClick={onClose}>Ver rig</button><button type="button" className="primary-button" onClick={onSave} disabled={!rig.name.trim() || !dirty}><Icon name="check"/>{dirty ? "Guardar rig" : "Guardado"}</button></div>
  </dialog>;
}
