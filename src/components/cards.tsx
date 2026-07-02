import type { Indicador } from "@/lib/data";
import { Sparkline } from "./charts";

export function Variacion({ valor, positivoEsBueno, sufijo = "" }: { valor: number; positivoEsBueno: boolean; sufijo?: string }) {
  const buena = positivoEsBueno ? valor >= 0 : valor < 0;
  const flecha = valor >= 0 ? "↗" : "↘";
  return (
    <span className={`text-xs font-semibold ${buena ? "text-up" : "text-down"}`}>
      {flecha} {valor > 0 ? "+" : ""}{valor}%{sufijo}
    </span>
  );
}

export function KpiCard({ etiqueta, valor, unidad, variacion, positiva, nota }:
  { etiqueta: string; valor: string; unidad: string; variacion: string; positiva: boolean; nota: string }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/45">{etiqueta}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-navy">
        {valor} <span className="text-sm font-normal text-navy/45">{unidad}</span>
      </p>
      <p className={`mt-1.5 text-xs font-semibold ${positiva ? "text-up" : "text-down"}`}>
        {positiva ? "↗" : "↘"} {variacion}
      </p>
      <p className="mt-1 text-xs text-navy/45">{nota}</p>
    </div>
  );
}

export function IndicadorCard({ ind }: { ind: Indicador }) {
  const buena = ind.positivoEsBueno ? ind.variacion >= 0 : ind.variacion < 0;
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(12,31,61,0.05)] transition-shadow hover:shadow-md">
      <span className="inline-block rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/60">
        {ind.categoriaNombre}
      </span>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-navy">{ind.nombre}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-navy">
            {ind.valor} <span className="text-sm font-normal text-navy/45">{ind.unidad}</span>
          </p>
          <p className={`mt-1 text-xs font-semibold ${buena ? "text-up" : "text-down"}`}>
            {ind.variacion >= 0 ? "↗" : "↘"} {ind.variacion > 0 ? "+" : ""}{ind.variacion}% interanual
          </p>
        </div>
        <div className="h-16 w-32 shrink-0">
          <Sparkline serie={ind.serie} positiva={buena} />
        </div>
      </div>
    </div>
  );
}
