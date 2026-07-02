"use client";

import { useMemo, useState } from "react";
import { categorias, indicadores } from "@/lib/data";
import { IndicadorCard } from "@/components/cards";

const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function ExploradorIndicadores({
  categoriaInicial,
  consultaInicial,
}: {
  categoriaInicial: string;
  consultaInicial: string;
}) {
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [consulta, setConsulta] = useState(consultaInicial);
  const [periodo, setPeriodo] = useState("2014–2024");
  const [region, setRegion] = useState("Nacional");

  const visibles = useMemo(() => {
    let lista = indicadores;
    if (categoria !== "todas") lista = lista.filter((i) => i.categoria === categoria);
    if (consulta.trim()) {
      const q = normalizar(consulta);
      lista = lista.filter(
        (i) => normalizar(i.nombre).includes(q) || normalizar(i.categoriaNombre).includes(q)
      );
    }
    return lista;
  }, [categoria, consulta]);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Filtros */}
      <aside className="h-fit rounded-2xl border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
        <p className="flex items-center gap-2 text-sm font-semibold text-navy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 5h16M7 12h10M10 19h4" />
          </svg>
          Filtros
        </p>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/40">Categoría</p>
        <div className="mt-2 space-y-1">
          {[{ id: "todas", nombre: "Todas" }, ...categorias].map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoria(c.id)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                categoria === c.id ? "bg-aciem text-white" : "text-navy/70 hover:bg-black/5"
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/40">Período</p>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="mt-2 w-full rounded-lg border border-black/8 bg-background px-3 py-2 text-sm text-navy/70 outline-none"
        >
          <option>2014–2024</option>
          <option>Último año</option>
          <option>Últimos 5 años</option>
        </select>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/40">Región</p>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="mt-2 w-full rounded-lg border border-black/8 bg-background px-3 py-2 text-sm text-navy/70 outline-none"
        >
          <option>Nacional</option>
          <option>Andina</option>
          <option>Caribe</option>
          <option>Pacífico</option>
          <option>Orinoquía</option>
          <option>Amazonía</option>
          <option>Insular</option>
        </select>
      </aside>

      {/* Resultados */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-navy">
            {visibles.length} {visibles.length === 1 ? "indicador" : "indicadores"}
          </p>
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar indicador..."
            className="h-9 w-56 rounded-full border border-black/8 bg-white px-4 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-navy/25"
          />
        </div>
        {visibles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/12 bg-white p-12 text-center text-sm text-navy/50">
            Sin resultados para esta selección. Prueba otra categoría u otro término.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visibles.map((ind) => (
              <IndicadorCard key={ind.id} ind={ind} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
