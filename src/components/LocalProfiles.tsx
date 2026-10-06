import { useEffect, useRef, useState } from "react";
import { PROFILE_LIMIT, type LocalProfile } from "../lib/profiles";
import Icon from "./Icon";

interface Props { open: boolean; profiles: LocalProfile[]; activeId: string; message: string; busy: boolean; onClose: () => void; onSelect: (profile: LocalProfile) => void; onCreate: (name: string) => Promise<boolean>; onRefresh: () => void }
export default function LocalProfiles({ open, profiles, activeId, message, busy, onClose, onSelect, onCreate, onRefresh }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  return <dialog ref={dialog} className="local-profiles-dialog" aria-labelledby="local-profiles-title" onCancel={event => { if (busy) event.preventDefault(); else onClose(); }} onClose={onClose}>
    <div className="dialog-heading"><div><p className="eyebrow">BIBLIOTECAS EN ESTE NAVEGADOR</p><h2 id="local-profiles-title">Perfiles locales</h2></div><button className="icon-button" disabled={busy} aria-label="Cerrar perfiles locales" onClick={onClose}><Icon name="close" /></button></div>
    <div className="local-profiles-content">
      <p>Cada perfil tiene sus propios rigs, historial y borradores. Sin contraseña ni nube: cualquier persona que use este navegador puede abrirlos.</p>
      <div className="local-profile-list" aria-label="Elegir perfil local">{profiles.map(profile => <button key={profile.id} disabled={busy} aria-pressed={profile.id === activeId} onClick={() => onSelect(profile)}><span className="profile-avatar" aria-hidden="true">{profile.name.slice(0, 1).toLocaleUpperCase("es")}</span><span><strong>{profile.name}</strong><small>{profile.id === "initial" ? "Conserva los rigs anteriores" : "Biblioteca independiente"}</small></span>{profile.id === activeId ? <Icon name="check" /> : <Icon name="arrow" />}</button>)}</div>
      <form onSubmit={async event => { event.preventDefault(); if (await onCreate(name)) setName(""); }} className="local-profile-form"><label htmlFor="local-profile-name">Nuevo perfil</label><div><input id="local-profile-name" value={name} maxLength={40} autoComplete="off" placeholder="Nombre de la persona o equipo" onChange={event => setName(event.target.value)} disabled={busy} /><button className="primary-button" type="submit" disabled={busy || !name.trim() || profiles.length >= PROFILE_LIMIT}><Icon name="plus" />{busy ? "Creando…" : "Crear perfil"}</button></div></form>
      {message && <p role="status" className="profile-message">{message}</p>}
      <button className="quiet-button" disabled={busy} onClick={onRefresh}>Actualizar lista de perfiles</button>
      <p className="panel-footnote">El cambio sólo afecta a esta pestaña. Los cambios sin guardar se conservan como borradores recuperables antes de salir del perfil. No sustituyen un rig confirmado ni una copia de seguridad.</p>
    </div>
  </dialog>;
}
