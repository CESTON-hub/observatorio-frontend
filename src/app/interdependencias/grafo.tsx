"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { nodosProyecto, dependencias, leerReglas, evaluarAlertas } from "@/lib/gestion";

const grosorPorTipo = { estatica: 3, logica: 2, coordinacion: 1.4 };
const etiquetaTipo = { estatica: "Estática", logica: "Lógica (co-avance)", coordinacion: "Coordinación de equipos" };

export function GrafoInterdependencias() {
  const [activo, setActivo] = useState<string | null>(null);
  const reglas = useMemo(() => leerReglas(), []);
  const alertas = useMemo(() => evaluarAlertas(reglas), [reglas]);
  const alertasPorProyecto = useMemo(() => {
    const m = new Map<string, typeof alertas>();
    for (const a of alertas) {
      const l = m.get(a.proyecto.id) ?? [];
      l.push(a);
      m.set(a.proyecto.id, l);
    }
    return m;
  }, [alertas]);

  const relacionados = (id: string) => {
    const predecesores = dependencias.filter((d) => d.destino === id).map((d) => d.origen);
    const sucesores = dependencias.filter((d) => d.origen === id).map((d) => d.destino);
    return new Set([...predecesores, ...sucesores]);
  };

  const vecinos = activo ? relacionados(activo) : new Set<string>();

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-black/6 bg-white p-4 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
        <svg viewBox="0 0 520 380" className="w-full">
          {dependencias.map((d, i) => {
            const o = nodosProyecto.find((n) => n.id === d.origen)!;
            const dest = nodosProyecto.find((n) => n.id === d.destino)!;
            const resaltada = activo && (d.origen === activo || d.destino === activo);
            return (
              <line
                key={i}
                x1={o.x} y1={o.y} x2={dest.x} y2={dest.y}
                stroke={resaltada ? "#e30613" : "#c7d0dc"}
                strokeWidth={grosorPorTipo[d.tipo] * (resaltada ? 1.4 : 1)}
                opacity={activo && !resaltada ? 0.25 : 1}
              >
                <title>{`${etiquetaTipo[d.tipo]}: ${o.nombre} → ${dest.nombre}`}</title>
              </line>
            );
          })}

          {nodosProyecto.map((n) => {
            const tieneAlerta = (alertasPorProyecto.get(n.id)?.length ?? 0) > 0;
            const esActivo = n.id === activo;
            const esVecino = vecinos.has(n.id);
            const atenuado = activo && !esActivo && !esVecino;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setActivo(n.id)}
                onMouseLeave={() => setActivo(null)}
                style={{ cursor: "pointer" }}
                opacity={atenuado ? 0.35 : 1}
              >
                <circle cx={n.x} cy={n.y} r={esActivo ? 30 : 26} fill={tieneAlerta ? "#fee2e2" : "#eef1f5"} stroke={tieneAlerta ? "#d92d20" : "#0c1f3d"} strokeWidth={esActivo ? 2.5 : 1.5} />
                {tieneAlerta && <text x={n.x + 20} y={n.y - 18} fontSize={14}>⚠️</text>}
                <text x={n.x} y={n.y + 42} textAnchor="middle" fontSize={10} fontWeight={esActivo ? 700 : 600} fill="#0c1f3d">
                  {n.nombre.length > 22 ? n.nombre.slice(0, 20) + "…" : n.nombre}
                </text>
                <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={9} fill="#0c1f3d">
                  {n.tdp > 0 ? "+" : ""}{n.tdp}%
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-black/6 pt-3 text-xs text-navy/50">
          <span><span className="inline-block h-0.5 w-5 bg-navy/30 align-middle" /> Estática</span>
          <span><span className="inline-block h-[3px] w-5 bg-navy/20 align-middle" /> Lógica</span>
          <span><span className="inline-block h-px w-5 bg-navy/15 align-middle" /> Coordinación</span>
          <span className="ml-auto">⚠️ = proyecto con alerta activa</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Alertas heurísticas</p>
        <div className="mt-3 space-y-2">
          {alertas.length === 0 && (
            <p className="rounded-xl border border-dashed border-black/12 p-4 text-center text-xs text-navy/45">
              Sin alertas con las reglas activas actualmente.
            </p>
          )}
          {alertas.map((a, i) => (
            <div key={i} className="rounded-xl border border-down/20 bg-down/5 p-3">
              <p className="text-xs font-semibold text-navy">{a.proyecto.nombre}</p>
              <p className="text-[11px] text-navy/55">{a.proyecto.organizacion}</p>
              <p className="mt-1 text-[11px] font-medium text-down">
                {a.regla.nombre}: {a.regla.indicador} {a.regla.operador} {a.regla.umbral} (actual: {a.valor})
              </p>
            </div>
          ))}
        </div>
        <Link href="/admin/reglas" className="mt-3 block text-xs font-semibold text-aciem hover:underline">
          Configurar reglas heurísticas →
        </Link>
      </div>
    </div>
  );
}
