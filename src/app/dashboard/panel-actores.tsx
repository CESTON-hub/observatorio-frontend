"use client";

import { useMemo, useState } from "react";
import {
  PAIS,
  municipiosPorCiudad,
  sectoresCiiu,
  ciiusDeSector,
  filtrarActores,
  conteoPor,
  etiquetaTamano,
  etiquetaTipoActor,
  type TipoActor,
  type TamanoEmpresa,
  type TipoInstitucion,
} from "@/lib/actores";
import { MapaCiudades } from "@/components/MapaCiudades";

function Barra({ nombre, cantidad, total, resaltar }: { nombre: string; cantidad: number; total: number; resaltar?: boolean }) {
  const pct = total > 0 ? Math.round((cantidad / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="truncate text-navy/70">{nombre}</span>
        <span className="ml-2 shrink-0 font-semibold text-navy">{cantidad}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-black/6">
        <div
          className={`h-2 rounded-full ${resaltar ? "bg-aciem" : "bg-navy/70"}`}
          style={{ width: `${Math.max(pct, cantidad > 0 ? 4 : 0)}%` }}
        />
      </div>
    </div>
  );
}

export function PanelActores() {
  const [ciudad, setCiudad] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [sector, setSector] = useState("");
  const [ciiu, setCiiu] = useState("");
  const [tipoActor, setTipoActor] = useState<TipoActor | "">("");
  const [tamanoEmpresa, setTamanoEmpresa] = useState<TamanoEmpresa | "">("");
  const [tipoInstitucion, setTipoInstitucion] = useState<TipoInstitucion | "">("");

  const municipiosDisponibles = ciudad ? municipiosPorCiudad[ciudad] : [];
  const ciiusDisponibles = ciiusDeSector(sector || undefined);

  const resultado = useMemo(
    () =>
      filtrarActores({
        ciudad: ciudad || undefined,
        municipio: municipio || undefined,
        sector: sector || undefined,
        ciiu: ciiu || undefined,
        tipoActor: (tipoActor || undefined) as TipoActor | undefined,
        tamanoEmpresa: (tamanoEmpresa || undefined) as TamanoEmpresa | undefined,
        tipoInstitucion: (tipoInstitucion || undefined) as TipoInstitucion | undefined,
      }),
    [ciudad, municipio, sector, ciiu, tipoActor, tamanoEmpresa, tipoInstitucion]
  );

  const total = resultado.length;
  const totalEmpresas = resultado.filter((a) => a.tipoActor === "empresa").length;
  const porSector = conteoPor(resultado, (a) => a.sector);
  const porCiiu = conteoPor(resultado, (a) => `${a.ciiu.codigo} · ${a.ciiu.nombre}`);
  const porTipoActor = conteoPor(resultado, (a) => etiquetaTipoActor[a.tipoActor]);
  const empresasPorTamano = conteoPor(
    resultado.filter((a) => a.tipoActor === "empresa"),
    (a) => (a.tamanoEmpresa ? etiquetaTamano[a.tamanoEmpresa] : undefined)
  );
  const actoresEducacion = resultado.filter((a) => a.tipoActor === "institucion_educativa");
  const eduPorTipo = conteoPor(
    actoresEducacion,
    (a) => (a.tipoInstitucion === "publica" ? "Pública" : a.tipoInstitucion === "privada" ? "Privada" : undefined)
  );

  const reiniciar = () => {
    setCiudad("");
    setMunicipio("");
    setSector("");
    setCiiu("");
    setTipoActor("");
    setTamanoEmpresa("");
    setTipoInstitucion("");
  };

  const haySeleccion = ciudad || municipio || sector || ciiu || tipoActor || tamanoEmpresa || tipoInstitucion;
  const selectCls = "h-9 rounded-full border border-black/10 bg-white px-3 text-xs font-medium text-navy/70 outline-none";

  return (
    <div className="mt-6 rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy">Caracterización de actores registrados</p>
          <p className="text-xs text-navy/45">Filtra por ubicación, sector, actividad económica (CIIU) y tipo de actor</p>
        </div>
        {haySeleccion && (
          <button onClick={reiniciar} className="text-xs font-semibold text-aciem hover:underline">
            Reiniciar selección
          </button>
        )}
      </div>

      {/* Ubicación interactiva: País > Ciudad (mapa) > Municipio (chips) */}
      <div className="mt-4 grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-black/6 bg-background p-4">
          <MapaCiudades
            ciudadSeleccionada={ciudad}
            onSeleccionarCiudad={(c) => {
              setCiudad(c);
              setMunicipio("");
            }}
          />
        </div>

        <div>
          {/* Breadcrumb de ubicación */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-navy/8 px-3 py-1.5 font-semibold text-navy/70">🌎 {PAIS}</span>
            <span aria-hidden className="text-navy/25">›</span>
            <span className={`rounded-full px-3 py-1.5 font-semibold ${ciudad ? "bg-aciem/10 text-aciem" : "bg-black/5 text-navy/45"}`}>
              {ciudad || "Todas las ciudades"}
            </span>
            {municipio && (
              <>
                <span aria-hidden className="text-navy/25">›</span>
                <span className="rounded-full bg-navy px-3 py-1.5 font-semibold text-white">{municipio}</span>
              </>
            )}
          </div>

          {/* Municipios de la ciudad seleccionada */}
          {ciudad ? (
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/40">
                Municipios de {ciudad}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setMunicipio("")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    municipio === "" ? "bg-navy text-white" : "border border-black/10 text-navy/70 hover:bg-black/5"
                  }`}
                >
                  Todos
                </button>
                {municipiosDisponibles.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMunicipio(municipio === m ? "" : m)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      municipio === m ? "bg-aciem text-white" : "border border-black/10 text-navy/70 hover:bg-black/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-black/12 px-4 py-6 text-center text-xs text-navy/45">
              Selecciona una ciudad en el mapa para elegir un municipio.
            </p>
          )}
        </div>
      </div>

      {/* Sector, CIIU y tipo de actor */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={sector}
          onChange={(e) => {
            setSector(e.target.value);
            setCiiu("");
          }}
          className={selectCls}
        >
          <option value="">Sector económico: todos</option>
          {sectoresCiiu.map((s) => (
            <option key={s.sector} value={s.sector}>{s.sector}</option>
          ))}
        </select>
        <select value={ciiu} onChange={(e) => setCiiu(e.target.value)} className={selectCls}>
          <option value="">Actividad económica (CIIU): todas</option>
          {ciiusDisponibles.map((c) => (
            <option key={c.codigo} value={c.codigo}>{c.codigo} · {c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(["empresa", "institucion_educativa", "gobierno"] as TipoActor[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTipoActor(tipoActor === t ? "" : t);
              setTamanoEmpresa("");
              setTipoInstitucion("");
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tipoActor === t ? "bg-navy text-white" : "border border-black/10 text-navy/70 hover:bg-black/5"
            }`}
          >
            {etiquetaTipoActor[t]}
          </button>
        ))}

        {tipoActor === "empresa" && (
          <>
            <span className="text-navy/25">·</span>
            {(["micro", "pequena", "mediana", "grande"] as TamanoEmpresa[]).map((t) => (
              <button
                key={t}
                onClick={() => setTamanoEmpresa(tamanoEmpresa === t ? "" : t)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  tamanoEmpresa === t ? "bg-aciem text-white" : "border border-black/10 text-navy/60 hover:bg-black/5"
                }`}
              >
                {etiquetaTamano[t]}
              </button>
            ))}
          </>
        )}

        {tipoActor === "institucion_educativa" && (
          <>
            <span className="text-navy/25">·</span>
            {(["publica", "privada"] as TipoInstitucion[]).map((t) => (
              <button
                key={t}
                onClick={() => setTipoInstitucion(tipoInstitucion === t ? "" : t)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  tipoInstitucion === t ? "bg-aciem text-white" : "border border-black/10 text-navy/60 hover:bg-black/5"
                }`}
              >
                {t === "publica" ? "Pública" : "Privada"}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Resultados */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/45">Empresas registradas</p>
          <p className="mt-1 text-3xl font-semibold text-navy">{totalEmpresas}</p>
        </div>
        <div className="rounded-xl bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/45">Total de actores en la selección</p>
          <p className="mt-1 text-3xl font-semibold text-navy">{total}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Por sector económico</p>
          <div className="mt-3 space-y-2.5">
            {porSector.length === 0 && <p className="text-xs text-navy/40">Sin datos para esta selección.</p>}
            {porSector.slice(0, 6).map((s) => (
              <Barra key={s.nombre} nombre={s.nombre} cantidad={s.cantidad} total={total} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Por tipo de actor</p>
          <div className="mt-3 space-y-2.5">
            {porTipoActor.map((s) => (
              <Barra key={s.nombre} nombre={s.nombre} cantidad={s.cantidad} total={total} resaltar />
            ))}
          </div>

          {empresasPorTamano.length > 0 && (
            <>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/40">Empresas por tamaño</p>
              <div className="mt-2 space-y-2.5">
                {empresasPorTamano.map((s) => (
                  <Barra key={s.nombre} nombre={s.nombre} cantidad={s.cantidad} total={totalEmpresas} />
                ))}
              </div>
            </>
          )}

          {eduPorTipo.length > 0 && (
            <>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy/40">Instituciones educativas</p>
              <div className="mt-2 space-y-2.5">
                {eduPorTipo.map((s) => (
                  <Barra key={s.nombre} nombre={s.nombre} cantidad={s.cantidad} total={actoresEducacion.length} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Por actividad económica (código CIIU)</p>
        <div className="mt-3 space-y-2.5">
          {porCiiu.length === 0 && <p className="text-xs text-navy/40">Sin datos para esta selección.</p>}
          {porCiiu.slice(0, 8).map((c) => (
            <Barra key={c.nombre} nombre={c.nombre} cantidad={c.cantidad} total={total} />
          ))}
        </div>
      </div>
    </div>
  );
}
