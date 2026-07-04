"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { nodosProyecto, leerAcuerdos, registrarAcuerdo, type Acuerdo } from "@/lib/gestion";

export function SimuladorEscenarios() {
  const { usuario } = useAuth();
  const [proyectoId, setProyectoId] = useState(nodosProyecto[0].id);
  const [cambioPresupuesto, setCambioPresupuesto] = useState(-15);
  const [reasignacionPersonal, setReasignacionPersonal] = useState(0);
  const [decision, setDecision] = useState("");
  const [acuerdos, setAcuerdos] = useState<Acuerdo[]>([]);

  const proyecto = nodosProyecto.find((p) => p.id === proyectoId)!;

  const proyeccion = useMemo(() => {
    // Modelo simplificado y transparente: cada -1% de presupuesto retrasa ~0.6 semanas;
    // cada punto de personal reasignado (positivo = quitar) retrasa ~0.4 semanas.
    const retrasoSemanas = Math.max(0, -cambioPresupuesto * 0.6 + reasignacionPersonal * 0.4);
    const iehProyectado = Math.max(0, Math.min(1, proyecto.ieh - retrasoSemanas * 0.015));
    const riesgo = iehProyectado < 0.7 ? "Alto" : iehProyectado < 0.85 ? "Medio" : "Bajo";
    return { retrasoSemanas: Math.round(retrasoSemanas * 10) / 10, iehProyectado: Math.round(iehProyectado * 100) / 100, riesgo };
  }, [proyecto, cambioPresupuesto, reasignacionPersonal]);

  useMemo(() => setAcuerdos(leerAcuerdos()), []);

  const guardarAcuerdo = () => {
    if (!decision.trim()) return;
    const parametro = `${proyecto.nombre}: presupuesto ${cambioPresupuesto > 0 ? "+" : ""}${cambioPresupuesto}%, reasignación de personal ${reasignacionPersonal}%`;
    const proyeccionTexto = `Retraso estimado ${proyeccion.retrasoSemanas} semanas · IEH proyectado ${proyeccion.iehProyectado} · Riesgo ${proyeccion.riesgo}`;
    registrarAcuerdo({ parametro, proyeccion: proyeccionTexto, decision: decision.trim(), registradoPor: usuario?.email ?? "anónimo" });
    setAcuerdos(leerAcuerdos());
    setDecision("");
  };

  const colorRiesgo = proyeccion.riesgo === "Alto" ? "text-down" : proyeccion.riesgo === "Medio" ? "text-amber-700" : "text-up";

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
        <p className="text-sm font-semibold text-navy">Parámetros hipotéticos</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy/60">Proyecto</label>
            <select
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-sm text-navy outline-none"
            >
              {nodosProyecto.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} — {p.organizacion}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-navy/60">
              <span>Cambio de presupuesto</span>
              <span className="font-semibold text-navy">{cambioPresupuesto > 0 ? "+" : ""}{cambioPresupuesto}%</span>
            </div>
            <input
              type="range"
              min={-40}
              max={20}
              value={cambioPresupuesto}
              onChange={(e) => setCambioPresupuesto(Number(e.target.value))}
              className="mt-1.5 w-full accent-aciem"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-medium text-navy/60">
              <span>Reasignación de personal a otro proyecto</span>
              <span className="font-semibold text-navy">{reasignacionPersonal}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={reasignacionPersonal}
              onChange={(e) => setReasignacionPersonal(Number(e.target.value))}
              className="mt-1.5 w-full accent-aciem"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/45">Retraso estimado</p>
            <p className="mt-1 text-2xl font-semibold text-navy">{proyeccion.retrasoSemanas} <span className="text-sm font-normal text-navy/45">sem.</span></p>
          </div>
          <div className="rounded-xl bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/45">IEH proyectado</p>
            <p className="mt-1 text-2xl font-semibold text-navy">{proyeccion.iehProyectado}</p>
          </div>
          <div className="rounded-xl bg-background p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/45">Riesgo de hitos críticos</p>
            <p className={`mt-1 text-2xl font-semibold ${colorRiesgo}`}>{proyeccion.riesgo}</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-navy/40">
          Modelo simplificado de demostración: no reemplaza la planificación de escenarios detallada del observatorio.
        </p>
      </div>

      <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
        <p className="text-sm font-semibold text-navy">Diálogo de interesados — registrar acuerdo</p>
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          rows={3}
          placeholder="Ej: Se aprueba el recorte del 15% condicionado a mantener el hito de cierre de octubre; se refuerza el equipo con 2 ingenieros del proyecto p4."
          className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-navy outline-none focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
        />
        <button onClick={guardarAcuerdo} className="mt-3 rounded-full bg-aciem px-5 py-2.5 text-sm font-semibold text-white hover:bg-aciem-dark">
          Registrar acuerdo
        </button>

        {acuerdos.length > 0 && (
          <div className="mt-5 space-y-3 border-t border-black/6 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Acuerdos registrados</p>
            {acuerdos.map((a) => (
              <div key={a.id} className="rounded-xl bg-background p-4 text-sm">
                <p className="font-medium text-navy">{a.parametro}</p>
                <p className="mt-1 text-xs text-navy/55">{a.proyeccion}</p>
                <p className="mt-2 text-navy/80">{a.decision}</p>
                <p className="mt-2 text-[11px] text-navy/40">{a.registradoPor} · {new Date(a.fecha).toLocaleString("es-CO")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
