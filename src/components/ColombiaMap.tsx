"use client";

import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import { coberturaRegiones, mapaDepartamentoARegion } from "@/lib/data";

const escala = (v: number) => {
  // 70% → azul claro, 100% → azul marino (navy de marca)
  const t = Math.max(0, Math.min(1, (v - 70) / 30));
  const from = [191, 219, 254]; // blue-200
  const to = [12, 31, 61]; // navy
  const c = from.map((f, i) => Math.round(f + (to[i] - f) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

const WIDTH = 320;
const HEIGHT = 340;

export function ColombiaMap() {
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null);

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

  if (!geo) {
    return <div className="flex h-64 items-center justify-center text-xs text-navy/40">Cargando mapa…</div>;
  }

  const projection = geoMercator().fitSize([WIDTH, HEIGHT], geo);
  const path = geoPath(projection);

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto h-64 w-auto">
        {geo.features.map((f, i) => {
          const nombre = (f.properties as Record<string, string>)?.DPTO_CNMBR ?? "";
          const region = mapaDepartamentoARegion[nombre] ?? "Andina";
          const valor = coberturaRegiones[region] ?? 90;
          const d = path(f);
          if (!d) return null;
          return (
            <path key={i} d={d} fill={escala(valor)} stroke="#fff" strokeWidth={0.6} strokeLinejoin="round">
              <title>{`${nombre} (${region}): ${valor}% de cobertura`}</title>
            </path>
          );
        })}
      </svg>
      <div className="mt-3 flex items-center justify-between text-xs text-navy/50">
        <span>72%</span>
        <div
          className="mx-3 h-2 flex-1 rounded-full"
          style={{ background: "linear-gradient(to right, rgb(191,219,254), rgb(12,31,61))" }}
        />
        <span>99%</span>
      </div>
    </div>
  );
}
