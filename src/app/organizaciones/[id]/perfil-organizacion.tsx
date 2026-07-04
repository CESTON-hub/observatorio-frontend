"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { etiquetaTipo, etiquetaDisponibilidad, leerReclamos, type OrganizacionDir, type CapacidadDir } from "@/lib/directorio";
import { leerEdiciones, guardarEdicion } from "@/lib/gestion";
import { PanelReclamo } from "./panel-reclamo";

export function PerfilOrganizacion({ org }: { org: OrganizacionDir }) {
  const { usuario } = useAuth();
  const [esEditor, setEsEditor] = useState(false);
  const [descripcion, setDescripcion] = useState(org.descripcion);
  const [capacidadesExtra, setCapacidadesExtra] = useState<CapacidadDir[]>([]);
  const [editando, setEditando] = useState(false);
  const [nuevaCap, setNuevaCap] = useState({ nombre: "", descripcion: "" });
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const reclamo = leerReclamos()[org.id];
    setEsEditor(Boolean(usuario && reclamo?.reclamadaPor === usuario.email));
    const edicion = leerEdiciones()[org.id];
    if (edicion) {
      if (edicion.descripcion) setDescripcion(edicion.descripcion);
      if (edicion.capacidadesExtra) setCapacidadesExtra(edicion.capacidadesExtra);
    }
  }, [org.id, usuario]);

  const guardar = () => {
    guardarEdicion(org.id, { descripcion, capacidadesExtra });
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const agregarCapacidad = () => {
    if (!nuevaCap.nombre.trim()) return;
    setCapacidadesExtra((c) => [...c, { nombre: nuevaCap.nombre.trim(), descripcion: nuevaCap.descripcion.trim(), disponibilidad: "servicio" }]);
    setNuevaCap({ nombre: "", descripcion: "" });
  };

  const capacidadesVisibles = [...org.capacidades, ...capacidadesExtra];

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
      <Link href="/buscar" className="text-sm font-medium text-aciem hover:underline">
        ← Volver al buscador
      </Link>

      <div className="mt-4 rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)] sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/60">{etiquetaTipo[org.tipo]}</span>
          <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/60">{org.sector}</span>
          <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/60">📍 {org.territorio}</span>
          {esEditor && (
            <button
              onClick={() => setEditando((v) => !v)}
              className="ml-auto rounded-full border border-navy/20 px-3 py-1 text-xs font-semibold text-navy hover:bg-navy/5"
            >
              {editando ? "Cancelar edición" : "✏️ Editar perfil"}
            </button>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-navy">{org.razonSocial}</h1>

        {editando ? (
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-navy outline-none focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
          />
        ) : (
          <p className="mt-2 text-sm leading-6 text-navy/70">{descripcion}</p>
        )}

        {guardado && (
          <p className="mt-2 rounded-lg bg-up/10 px-3 py-2 text-xs font-medium text-up">
            ✓ Cambios guardados. Un analista revisará las modificaciones sustanciales antes de re-publicarlas (CU-04).
          </p>
        )}

        <PanelReclamo orgId={org.id} estado={org.estado} datosDe={org.datosDe} />

        {/* Capacidades */}
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Capacidades y equipos</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {capacidadesVisibles.map((c) => (
            <div key={c.nombre} className="rounded-xl border border-black/6 bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{c.nombre}</p>
                <span className="shrink-0 rounded-full bg-navy/8 px-2 py-0.5 text-[10px] font-semibold uppercase text-navy/60">
                  {etiquetaDisponibilidad[c.disponibilidad]}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-navy/60">{c.descripcion}</p>
            </div>
          ))}
        </div>

        {editando && (
          <div className="mt-3 rounded-xl border border-dashed border-black/15 p-4">
            <p className="text-xs font-semibold text-navy/60">Agregar capacidad o equipo</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                value={nuevaCap.nombre}
                onChange={(e) => setNuevaCap((n) => ({ ...n, nombre: e.target.value }))}
                placeholder="Nombre del equipo/servicio"
                className="h-10 rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-navy/30"
              />
              <input
                value={nuevaCap.descripcion}
                onChange={(e) => setNuevaCap((n) => ({ ...n, descripcion: e.target.value }))}
                placeholder="Descripción breve"
                className="h-10 rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-navy/30"
              />
              <button onClick={agregarCapacidad} className="h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-800">
                Agregar
              </button>
            </div>
          </div>
        )}

        {/* Líneas de investigación */}
        {org.lineas.length > 0 && (
          <>
            <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Líneas de investigación</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {org.lineas.map((l) => (
                <li key={l} className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-navy/70">{l}</li>
              ))}
            </ul>
          </>
        )}

        {/* Proyectos */}
        {org.proyectos.length > 0 && (
          <>
            <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Proyectos</h2>
            <ul className="mt-3 space-y-2">
              {org.proyectos.map((p) => (
                <li key={p.nombre} className="flex flex-wrap items-center gap-2 rounded-xl border border-black/6 bg-background px-4 py-3 text-sm">
                  <span className={`h-2 w-2 rounded-full ${p.estado === "en_proceso" ? "bg-up" : "bg-navy/30"}`} />
                  <span className="font-medium text-navy">{p.nombre}</span>
                  <span className="text-xs text-navy/50">📍 {p.territorio}</span>
                  <span className="ml-auto text-xs text-navy/50">{p.estado === "en_proceso" ? "En proceso" : "Planeado"}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Contacto */}
        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Contacto</h2>
        <div className="mt-3 rounded-xl border border-black/6 bg-background p-4 text-sm">
          <p className="font-semibold text-navy">{org.contacto.nombre}</p>
          <p className="text-xs text-navy/50">{org.contacto.cargo}</p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-navy/70">
            <a href={`mailto:${org.contacto.email}`} className="hover:text-aciem">✉️ {org.contacto.email}</a>
            <span>☎️ {org.contacto.telefono}</span>
          </div>
          {org.contacto.visibilidad === "solo_registrados" && (
            <p className="mt-2 text-[11px] text-navy/40">Contacto visible por ser usuario registrado del observatorio.</p>
          )}
        </div>

        {editando && (
          <button onClick={guardar} className="mt-6 w-full rounded-full bg-aciem py-3 text-sm font-semibold text-white hover:bg-aciem-dark sm:w-auto sm:px-8">
            Guardar cambios
          </button>
        )}
      </div>
    </div>
  );
}
