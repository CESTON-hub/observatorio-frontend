import { coberturaRegiones } from "@/lib/data";

// Mapa estilizado de Colombia por regiones naturales (formas simplificadas para el demo;
// en producción se reemplaza por un choropleth con GeoJSON del DANE).
const escala = (v: number) => {
  // 70% → azul claro, 100% → azul oscuro
  const t = Math.max(0, Math.min(1, (v - 70) / 30));
  const from = [191, 219, 254]; // blue-200
  const to = [12, 31, 77]; // navy
  const c = from.map((f, i) => Math.round(f + (to[i] - f) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

const regionesMapa: { nombre: string; d: string; label: [number, number] }[] = [
  // Formas simplificadas sobre un lienzo 200x240
  { nombre: "Caribe", d: "M52 8 L120 2 L138 30 L112 52 L66 46 L44 30 Z", label: [88, 28] },
  { nombre: "Pacífico", d: "M44 30 L66 46 L60 110 L52 158 L30 150 L24 84 Z", label: [42, 100] },
  { nombre: "Andina", d: "M66 46 L112 52 L118 96 L104 150 L52 158 L60 110 Z", label: [86, 104] },
  { nombre: "Orinoquía", d: "M112 52 L138 30 L196 64 L178 118 L118 96 Z", label: [152, 76] },
  { nombre: "Amazonía", d: "M104 150 L118 96 L178 118 L160 200 L110 236 L92 190 Z", label: [134, 164] },
  { nombre: "Insular", d: "M18 14 a7 7 0 1 0 0.1 0 Z", label: [18, 34] },
];

export function ColombiaMap() {
  return (
    <div>
      <svg viewBox="0 0 210 245" className="mx-auto h-64 w-auto">
        {regionesMapa.map((r) => (
          <g key={r.nombre}>
            <path
              d={r.d}
              fill={escala(coberturaRegiones[r.nombre])}
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <title>{`${r.nombre}: ${coberturaRegiones[r.nombre]}% de cobertura`}</title>
            </path>
            {r.nombre !== "Insular" && (
              <text x={r.label[0]} y={r.label[1]} textAnchor="middle" fontSize="8.5" fontWeight="600"
                fill={coberturaRegiones[r.nombre] > 90 ? "#ffffff" : "#0c1f3d"}>
                {r.nombre}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-3 flex items-center justify-between text-xs text-navy/50">
        <span>72%</span>
        <div className="mx-3 h-2 flex-1 rounded-full"
          style={{ background: "linear-gradient(to right, rgb(191,219,254), rgb(12,31,77))" }} />
        <span>99%</span>
      </div>
    </div>
  );
}
