import Link from "next/link";
import { busquedasPopulares, categorias, indicadores, statsHome } from "@/lib/data";
import { SerieDestacada } from "@/components/charts";

const destacado = indicadores.find((i) => i.id === "participacion-renovables")!;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[896px] px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-aciem" />
            Actualizado · Julio 2026
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-[44px] font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-[52px]">
            Datos para entender la ingeniería y la energía en Colombia
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55">
            El Observatorio de ACIEM centraliza indicadores técnicos, estadísticas sectoriales y análisis
            sobre ingeniería, energía e infraestructura nacional.
          </p>
          <form action="/indicadores" className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                name="q"
                placeholder='Buscar: "Energía solar", "Cobertura eléctrica"...'
                className="h-[50px] w-full rounded-2xl border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/40"
              />
            </div>
          </form>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <span className="text-xs text-white/30">Populares:</span>
            {busquedasPopulares.map((b) => (
              <Link key={b} href={`/indicadores?q=${encodeURIComponent(b)}`} className="font-medium text-white/60 underline underline-offset-4 hover:text-white">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Barra de stats */}
      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto flex max-w-[1129px] flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 py-4">
          {statsHome.map((s) => (
            <p key={s.etiqueta} className="text-sm text-navy/50">
              <span className="mr-1.5 text-base font-bold text-navy">{s.valor}</span>
              {s.etiqueta}
            </p>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-[1129px] px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-navy">Explorar por categoría</h2>
            <p className="mt-1 text-sm text-navy/50">Selecciona un sector para ver sus indicadores</p>
          </div>
          <Link href="/indicadores" className="text-sm font-medium text-aciem hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/indicadores?categoria=${c.id}`}
              className="group rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)] transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ backgroundColor: `${c.color}14` }}>
                  {c.icono}
                </span>
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/55">
                  {c.indicadores} indicadores
                </span>
              </div>
              <p className="mt-4 text-[15px] font-semibold text-navy">{c.nombre}</p>
              <p className="mt-1.5 text-sm leading-5 text-navy/55">{c.descripcion}</p>
              <p className="mt-4 text-sm font-medium text-aciem opacity-80 group-hover:opacity-100">Explorar →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Indicador destacado */}
      <section className="border-t border-black/6 bg-white">
        <div className="mx-auto grid max-w-[1129px] items-center gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em]">
              <span className="rounded-full bg-aciem/10 px-3 py-1 text-aciem">Indicador destacado</span>
              <span className="text-navy/40">Energía · 2024</span>
            </div>
            <h2 className="mt-4 text-[28px] font-semibold leading-tight tracking-tight text-navy">
              Las renovables superan el 33% de la matriz energética colombiana
            </h2>
            <p className="mt-4 text-sm leading-6 text-navy/60">
              Por primera vez en la historia del sector eléctrico colombiano, las fuentes de energía renovable
              no convencional —solar fotovoltaica y eólica— aportan más del 33% de la capacidad instalada
              total del Sistema Interconectado Nacional.
            </p>
            <p className="mt-3 text-sm leading-6 text-navy/60">
              Este hito representa un cambio estructural en la composición de la matriz, que históricamente
              dependía en un 70–80% de la generación hidroeléctrica. La diversificación reduce la
              vulnerabilidad del sistema frente a fenómenos climáticos como El Niño.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: "4.8 GW", n: "Capacidad solar", d: "+1.2 GW" },
                { v: "1.2 GW", n: "Capacidad eólica", d: "+0.3 GW" },
                { v: "50%", n: "Meta 2030", d: "CONPES 4075" },
              ].map((x) => (
                <div key={x.n} className="rounded-xl bg-background p-4">
                  <p className="text-lg font-bold text-navy">{x.v}</p>
                  <p className="mt-0.5 text-[11px] text-navy/50">{x.n}</p>
                  <p className="text-[11px] font-semibold text-up">{x.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/indicadores" className="rounded-full bg-aciem px-5 py-2.5 text-sm font-medium text-white hover:bg-aciem-dark">
                Ver indicador completo
              </Link>
              <button className="rounded-full border border-black/12 px-5 py-2.5 text-sm font-medium text-navy hover:bg-black/5">
                ⬇ Descargar datos
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white p-6 shadow-[0_2px_10px_rgba(12,31,61,0.06)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-navy">Participación de Energías Renovables</p>
                <p className="text-xs text-navy/45">% del total generado · Sistema Interconectado Nacional</p>
              </div>
              <span className="rounded-full bg-up/10 px-2.5 py-1 text-xs font-bold text-up">↗ +11.2%</span>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-navy">
              33.2<span className="text-lg text-navy/45">%</span>
            </p>
            <div className="mt-2 h-56">
              <SerieDestacada serie={destacado.serie} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-black/6 pt-3 text-xs">
              <span className="text-navy/45">◍ Fuente: XM – UPME</span>
              <Link href="/dashboard" className="font-semibold text-aciem hover:underline">
                Ver detalle ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
