"use client";

import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { ciudadPorDepartamento } from "@/lib/actores";

const WIDTH = 300;
const HEIGHT = 360;

type Props = {
  ciudadSeleccionada: string;
  onSeleccionarCiudad: (ciudad: string) => void;
};

export function MapaCiudades({ ciudadSeleccionada, onSeleccionarCiudad }: Props) {
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    fetch("/data/colombia-departamentos.json")
      .then((r) => r.json())
      .then((topo: Topology) => {
        const key = Object.keys(topo.objects)[0];
        const fc = feature(topo, topo.objects[key] as GeometryCollection) as unknown as FeatureCollection<Geometry>;
        if (!cancelado) setGeo(fc);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const { path, etiquetas } = useMemo(() => {
    if (!geo) return { path: null, etiquetas: [] as { ciudad: string; x: number; y: number }[] };
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], geo);
    const p = geoPath(projection);
    // Un pin por ciudad, ubicado en el centroide de su departamento principal.
    const vistas = new Set<string>();
    const etq: { ciudad: string; x: number; y: number }[] = [];
    for (const f of geo.features) {
      const depto = (f.properties as Record<string, string>)?.DPTO_CNMBR ?? "";
      const ciudad = ciudadPorDepartamento[depto];
      if (ciudad && !vistas.has(ciudad)) {
        vistas.add(ciudad);
        const [x, y] = projection(geoCentroid(f as Feature)) ?? [0, 0];
        etq.push({ ciudad, x, y });
      }
    }
    return { path: p, etiquetas: etq };
  }, [geo]);

  if (!geo || !path) {
    return <div className="flex h-72 items-center justify-center text-xs text-navy/40">Cargando mapa…</div>;
  }

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto h-72 w-auto">
        {geo.features.map((f, i) => {
          const depto = (f.properties as Record<string, string>)?.DPTO_CNMBR ?? "";
          const ciudad = ciudadPorDepartamento[depto];
          const seleccionable = Boolean(ciudad);
          const activa = ciudad && ciudad === ciudadSeleccionada;
          const enHover = ciudad && ciudad === hover;
          const d = path(f);
          if (!d) return null;

          let fill = "#e7eaee"; // no seleccionable
          if (seleccionable) fill = "#c7d2e0"; // seleccionable base
          if (enHover) fill = "#94a8c4";
          if (activa) fill = "#e30613"; // ciudad seleccionada

          return (
            <path
              key={i}
              d={d}
              fill={fill}
              stroke="#fff"
              strokeWidth={0.6}
              strokeLinejoin="round"
              style={{ cursor: seleccionable ? "pointer" : "default" }}
              onClick={() => ciudad && onSeleccionarCiudad(ciudad === ciudadSeleccionada ? "" : ciudad)}
              onMouseEnter={() => seleccionable && setHover(ciudad)}
              onMouseLeave={() => setHover(null)}
            >
              <title>{seleccionable ? ciudad : depto}</title>
            </path>
          );
        })}

        {etiquetas.map((e) => {
          const activa = e.ciudad === ciudadSeleccionada;
          return (
            <g
              key={e.ciudad}
              onClick={() => onSeleccionarCiudad(activa ? "" : e.ciudad)}
              onMouseEnter={() => setHover(e.ciudad)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={e.x} cy={e.y} r={activa ? 4 : 3} fill={activa ? "#e30613" : "#0c1f3d"} stroke="#fff" strokeWidth={1} />
              <text
                x={e.x}
                y={e.y - 6}
                textAnchor="middle"
                fontSize={9}
                fontWeight={activa ? 700 : 600}
                fill={activa ? "#e30613" : "#0c1f3d"}
                style={{ pointerEvents: "none" }}
              >
                {e.ciudad}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-2 text-center text-xs text-navy/50">
        {ciudadSeleccionada ? (
          <>
            Ciudad seleccionada: <span className="font-semibold text-navy">{ciudadSeleccionada}</span> · haz clic de nuevo para quitar
          </>
        ) : (
          "Haz clic en una ciudad del mapa para filtrar"
        )}
      </p>
    </div>
  );
}
