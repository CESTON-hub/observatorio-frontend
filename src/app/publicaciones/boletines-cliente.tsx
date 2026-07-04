"use client";

import { useEffect, useState } from "react";
import { boletines } from "@/lib/directorio";
import { useAuth } from "@/lib/auth";
import { leerBoletinesPublicados, publicarBoletin, type BoletinPublicado } from "@/lib/gestion";
import { indicadores } from "@/lib/data";

export function ListaBoletines() {
  const [publicados, setPublicados] = useState<BoletinPublicado[]>([]);
  useEffect(() => setPublicados(leerBoletinesPublicados()), []);

  const todos = [
    ...publicados.map((b) => ({ ...b, esNuevo: true })),
    ...boletines.map((b) => ({ ...b, esNuevo: false, publicadoPor: undefined as string | undefined })),
  ];

  return (
    <ul className="mt-3 divide-y divide-black/5">
      {todos.map((b) => (
        <li key={b.id} className="flex flex-wrap items-center gap-3 py-3">
          <span className="text-lg">📊</span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy">
              {b.titulo}
              {b.esNuevo && <span className="rounded-full bg-up/10 px-2 py-0.5 text-[10px] font-bold uppercase text-up">Nuevo</span>}
            </p>
            <p className="text-xs text-navy/55">{b.resumen}</p>
          </div>
          <span className="text-xs text-navy/45">{b.periodo}</span>
          <button className="rounded-full border border-black/12 px-3 py-1.5 text-xs font-medium text-navy hover:bg-black/5">
            Descargar
          </button>
        </li>
      ))}
    </ul>
  );
}

// CU-13: el analista redacta un boletín a partir de los indicadores vigentes y lo publica.
export function RedactorBoletin() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState("Julio 2026");
  const [indicadorId, setIndicadorId] = useState(indicadores[0].id);
  const [notas, setNotas] = useState("");
  const [publicado, setPublicado] = useState(false);

  const ind = indicadores.find((i) => i.id === indicadorId)!;
  const borradorResumen = `${ind.nombre} se ubicó en ${ind.valor} ${ind.unidad} (${ind.variacion > 0 ? "+" : ""}${ind.variacion}% interanual). ${notas}`.trim();

  const publicar = () => {
    publicarBoletin({
      titulo: `Boletín ${periodo} · ${ind.categoriaNombre}`,
      periodo,
      resumen: borradorResumen,
      publicadoPor: usuario?.email ?? "analista",
    });
    setPublicado(true);
    setNotas("");
    setTimeout(() => setPublicado(false), 2500);
  };

  return (
    <div className="mt-6 rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Redactar y publicar boletín</h2>
        <span className="rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-semibold uppercase text-white">Rol: Analista</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-navy/60">Período</label>
          <input value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="h-10 w-full rounded-xl border border-black/10 px-3.5 text-sm outline-none focus:border-navy/30" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-navy/60">Indicador base</label>
          <select value={indicadorId} onChange={(e) => setIndicadorId(e.target.value)} className="h-10 w-full rounded-xl border border-black/10 px-3.5 text-sm outline-none">
            {indicadores.map((i) => (
              <option key={i.id} value={i.id}>{i.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="mb-1.5 mt-3 block text-xs font-medium text-navy/60">Notas del analista (contexto adicional)</label>
      <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} placeholder="Ej: el crecimiento se explica por la entrada en operación de dos parques eólicos en La Guajira." className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-navy/30" />

      <div className="mt-3 rounded-xl bg-background p-3 text-xs text-navy/60">
        <span className="font-semibold text-navy">Vista previa: </span>{borradorResumen}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={publicar} className="rounded-full bg-aciem px-5 py-2.5 text-sm font-semibold text-white hover:bg-aciem-dark">
          Publicar boletín
        </button>
        {publicado && <span className="text-sm font-medium text-up">✓ Boletín publicado</span>}
      </div>
    </div>
  );
}
