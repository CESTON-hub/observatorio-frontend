"use client";

import { useEffect, useState } from "react";
import { leerReglas, guardarReglas, type ReglaHeuristica } from "@/lib/gestion";

const etiquetaIndicador: Record<ReglaHeuristica["indicador"], string> = {
  TDP: "Desviación presupuestaria (TDP)",
  IEH: "Índice de ejecución de hitos (IEH)",
  CCE: "Capacidad de carga del equipo (CCE)",
};

export function PanelReglas() {
  const [reglas, setReglas] = useState<ReglaHeuristica[]>([]);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => setReglas(leerReglas()), []);

  const actualizar = (id: string, cambios: Partial<ReglaHeuristica>) => {
    setReglas((rs) => rs.map((r) => (r.id === id ? { ...r, ...cambios } : r)));
  };

  const guardar = () => {
    guardarReglas(reglas);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <div className="mt-6 space-y-3">
      {reglas.map((r) => (
        <div key={r.id} className="rounded-2xl border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-navy">
              <input
                type="checkbox"
                checked={r.activa}
                onChange={(e) => actualizar(r.id, { activa: e.target.checked })}
                className="h-4 w-4 rounded accent-aciem"
              />
              {r.nombre}
            </label>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                r.severidad === "alta" ? "bg-down/10 text-down" : "bg-amber-100 text-amber-800"
              }`}
            >
              {r.severidad}
            </span>
          </div>
          <p className="mt-1 text-xs text-navy/50">{etiquetaIndicador[r.indicador]}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-navy/60">Disparar alerta cuando el valor sea</span>
            <select
              value={r.operador}
              onChange={(e) => actualizar(r.id, { operador: e.target.value as ReglaHeuristica["operador"] })}
              className="h-8 rounded-lg border border-black/10 px-2 text-sm"
              disabled={!r.activa}
            >
              <option value=">">mayor que</option>
              <option value="<">menor que</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={r.umbral}
              onChange={(e) => actualizar(r.id, { umbral: Number(e.target.value) })}
              disabled={!r.activa}
              className="h-8 w-24 rounded-lg border border-black/10 px-2 text-sm"
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={guardar} className="rounded-full bg-aciem px-5 py-2.5 text-sm font-semibold text-white hover:bg-aciem-dark">
          Guardar reglas
        </button>
        {guardado && <span className="text-sm font-medium text-up">✓ Reglas actualizadas</span>}
      </div>
    </div>
  );
}
