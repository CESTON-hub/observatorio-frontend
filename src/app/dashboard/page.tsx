import Link from "next/link";
import { indicadores, kpis } from "@/lib/data";
import { KpiCard } from "@/components/cards";
import { EnergiaPorRegion, MatrizEnergetica, Sparkline } from "@/components/charts";
import { ColombiaMap } from "@/components/ColombiaMap";

export const metadata = { title: "Dashboard · Observatorio de Datos ACIEM" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1129px] px-6 py-8">
      {/* Encabezado */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Dashboard Sectorial</h1>
          <p className="mt-1 text-sm text-navy/50">Resumen ejecutivo de indicadores clave · Julio 2026</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-full border border-black/12 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-black/5">
            ⬇ Exportar PDF
          </button>
          <button className="rounded-full bg-aciem px-4 py-2 text-sm font-medium text-white hover:bg-aciem-dark">
            ↗ Compartir
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.etiqueta} {...k} />
        ))}
      </div>

      {/* Fila: barras por región + mapa */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-navy">Energía y Capital Humano por Región</p>
              <p className="text-xs text-navy/45">Consumo (TWh) e ingenieros registrados (mil) · 2024</p>
            </div>
            <Link href="/indicadores" className="text-xs font-semibold text-aciem hover:underline">
              Ver detalle ↗
            </Link>
          </div>
          <div className="h-72">
            <EnergiaPorRegion />
          </div>
        </div>
        <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
          <p className="text-sm font-semibold text-navy">Cobertura Eléctrica</p>
          <p className="mb-4 text-xs text-navy/45">Por región · 2024</p>
          <ColombiaMap />
        </div>
      </div>

      {/* Fila: matriz energética + destacados */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
          <p className="text-sm font-semibold text-navy">Evolución de la Matriz Energética</p>
          <p className="mb-4 text-xs text-navy/45">Renovables vs. Hidroeléctrica · 2014–2024</p>
          <div className="h-72">
            <MatrizEnergetica />
          </div>
        </div>
        <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-navy">Indicadores Destacados</p>
            <Link href="/indicadores" className="text-xs font-semibold text-aciem hover:underline">
              Ver todos →
            </Link>
          </div>
          <ul className="divide-y divide-black/5">
            {indicadores.map((ind) => {
              const buena = ind.positivoEsBueno ? ind.variacion >= 0 : ind.variacion < 0;
              return (
                <li key={ind.id} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{ind.nombre}</p>
                    <p className="text-xs text-navy/45">{ind.categoriaNombre}</p>
                  </div>
                  <div className="h-9 w-24 shrink-0">
                    <Sparkline serie={ind.serie} positiva={buena} />
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <p className="text-sm font-bold text-navy">
                      {ind.valor} <span className="text-[10px] font-normal text-navy/45">{ind.unidad}</span>
                    </p>
                    <p className={`text-xs font-semibold ${buena ? "text-up" : "text-down"}`}>
                      {ind.variacion > 0 ? "+" : ""}
                      {ind.variacion}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
