// Datos de demostración del Observatorio de Datos ACIEM.
// En producción provienen de la API GraphQL (ver docs-observatorio/docs/arquitectura/backend-spec.md).

export type Categoria = {
  id: string;
  nombre: string;
  descripcion: string;
  indicadores: number;
  icono: string;
  color: string;
};

export const categorias: Categoria[] = [
  { id: "energia", nombre: "Energía Eléctrica", descripcion: "Generación, consumo y tarifas eléctricas nacionales", indicadores: 142, icono: "⚡", color: "#2563eb" },
  { id: "petroleo", nombre: "Petróleo y Gas", descripcion: "Reservas, producción y exportaciones de hidrocarburos", indicadores: 98, icono: "🛢️", color: "#d97706" },
  { id: "renovables", nombre: "Energías Renovables", descripcion: "Solar, eólica, biomasa y pequeñas centrales hidráulicas", indicadores: 87, icono: "🌱", color: "#0e9f6e" },
  { id: "agua", nombre: "Agua y Saneamiento", descripcion: "Cobertura, calidad y gestión del recurso hídrico", indicadores: 73, icono: "💧", color: "#0891b2" },
  { id: "telecom", nombre: "Telecomunicaciones", descripcion: "Conectividad, banda ancha y penetración móvil", indicadores: 65, icono: "📡", color: "#7c3aed" },
  { id: "vial", nombre: "Infraestructura Vial", descripcion: "Red vial, concesiones y estado de vías en Colombia", indicadores: 58, icono: "🛣️", color: "#c41414" },
];

export type Indicador = {
  id: string;
  categoria: string;
  categoriaNombre: string;
  nombre: string;
  valor: string;
  unidad: string;
  variacion: number; // % interanual
  positivoEsBueno: boolean;
  serie: { anio: number; valor: number }[];
  fuente: string;
};

const serie = (vals: number[]) => vals.map((valor, i) => ({ anio: 2014 + i, valor }));

export const indicadores: Indicador[] = [
  { id: "consumo-electrico", categoria: "energia", categoriaNombre: "Energía", nombre: "Consumo de Energía Eléctrica", valor: "79.3", unidad: "TWh", variacion: 3.4, positivoEsBueno: true, serie: serie([61.2, 63.5, 64.8, 65.9, 68.1, 70.2, 66.9, 71.4, 74.0, 76.7, 79.3]), fuente: "XM · Total SIN · 2024" },
  { id: "participacion-renovables", categoria: "renovables", categoriaNombre: "Renovables", nombre: "Participación de Renovables", valor: "33.2", unidad: "%", variacion: 11.2, positivoEsBueno: true, serie: serie([5.1, 6.0, 7.2, 8.5, 10.3, 12.8, 15.6, 19.4, 24.1, 29.8, 33.2]), fuente: "XM – UPME · % del total generado" },
  { id: "capacidad-instalada", categoria: "energia", categoriaNombre: "Energía", nombre: "Capacidad Instalada SIN", valor: "23.4", unidad: "GW", variacion: 5.8, positivoEsBueno: true, serie: serie([15.5, 16.4, 16.6, 16.8, 17.3, 17.8, 17.5, 18.4, 19.9, 22.1, 23.4]), fuente: "XM · Sistema nacional · 2024" },
  { id: "perdidas-sistema", categoria: "energia", categoriaNombre: "Energía", nombre: "Pérdidas del Sistema", valor: "11", unidad: "%", variacion: -2.8, positivoEsBueno: false, serie: serie([15.8, 15.2, 14.9, 14.1, 13.6, 13.2, 13.9, 12.8, 12.1, 11.3, 11.0]), fuente: "SUI · 2024" },
  { id: "produccion-petroleo", categoria: "petroleo", categoriaNombre: "Petróleo", nombre: "Producción de Petróleo", valor: "784", unidad: "Mbd", variacion: -4.2, positivoEsBueno: true, serie: serie([990, 1006, 886, 854, 865, 886, 781, 736, 754, 818, 784]), fuente: "ANH · Miles de barriles/día" },
  { id: "cobertura-electrica", categoria: "energia", categoriaNombre: "Energía", nombre: "Cobertura Electricidad Nacional", valor: "97.2", unidad: "%", variacion: 2.1, positivoEsBueno: true, serie: serie([90.1, 91.0, 92.2, 93.1, 94.0, 94.8, 95.2, 95.8, 96.3, 96.8, 97.2]), fuente: "UPME · Hogares con acceso" },
  { id: "internet-fijo", categoria: "telecom", categoriaNombre: "Telecomunicaciones", nombre: "Penetración Internet Fijo", valor: "42.8", unidad: "%", variacion: 8.5, positivoEsBueno: true, serie: serie([18.2, 20.5, 23.1, 25.4, 27.9, 30.6, 34.2, 36.8, 38.9, 40.7, 42.8]), fuente: "MinTIC · 2024" },
  { id: "acueducto-urbano", categoria: "agua", categoriaNombre: "Agua", nombre: "Cobertura Acueducto Urbano", valor: "97.8", unidad: "%", variacion: 1.5, positivoEsBueno: true, serie: serie([94.0, 94.4, 94.9, 95.3, 95.8, 96.1, 96.4, 96.8, 97.1, 97.5, 97.8]), fuente: "DANE – SUI · 2024" },
];

export const kpis = [
  { etiqueta: "Consumo Eléctrico", valor: "79.3", unidad: "TWh", variacion: "+3.4% vs. año anterior", positiva: true, nota: "Total SIN · 2024" },
  { etiqueta: "Participación Renovable", valor: "33.2", unidad: "%", variacion: "+11.2% vs. año anterior", positiva: true, nota: "% del total generado" },
  { etiqueta: "Producción Petróleo", valor: "784", unidad: "Mbd", variacion: "−4.2% vs. año anterior", positiva: false, nota: "Miles de barriles/día" },
  { etiqueta: "Cobertura Eléctrica", valor: "97.2", unidad: "%", variacion: "+0.2% vs. año anterior", positiva: true, nota: "Hogares nacionales" },
];

export const statsHome = [
  { valor: "523", etiqueta: "indicadores disponibles" },
  { valor: "8", etiqueta: "sectores temáticos" },
  { valor: "32", etiqueta: "departamentos" },
  { valor: "2024", etiqueta: "datos hasta" },
];

// Dashboard: energía y capital humano por región
export const regiones = [
  { region: "Andina", energia: 46.2, ingenieros: 12.4 },
  { region: "Caribe", energia: 16.8, ingenieros: 4.1 },
  { region: "Pacífico", energia: 9.3, ingenieros: 2.8 },
  { region: "Orinoquía", energia: 12.6, ingenieros: 1.9 },
  { region: "Amazonía", energia: 2.1, ingenieros: 0.5 },
  { region: "Insular", energia: 0.9, ingenieros: 0.2 },
];

// Dashboard: evolución de la matriz energética
export const matriz = serie([5.1, 6.0, 7.2, 8.5, 10.3, 12.8, 15.6, 19.4, 24.1, 29.8, 33.2]).map((d, i) => ({
  anio: d.anio,
  renovables: d.valor,
  hidroelectrica: [79.5, 78.9, 78.2, 79.1, 77.4, 75.8, 74.2, 72.6, 70.9, 68.4, 66.1][i],
}));

// Dashboard: cobertura eléctrica por región (mapa)
export const coberturaRegiones: Record<string, number> = {
  Andina: 99.1, Caribe: 96.4, Pacífico: 89.2, Orinoquía: 91.7, Amazonía: 72.4, Insular: 95.8,
};

export const busquedasPopulares = ["Consumo eléctrico", "Energías renovables", "Cobertura nacional", "Petróleo Colombia"];
