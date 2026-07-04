// Persistencia local (solo frontend) para los flujos de gestión de la documentación:
// CU-04 (editar perfil), CU-12 (reglas heurísticas), CU-13 (publicar boletín),
// CU-14 (interdependencias), CU-15 (escenarios), CU-16 (usuarios y taxonomías).

import type { CapacidadDir } from "./directorio";

// ---------------------------------------------------------------------------
// CU-04 — Ediciones de perfil de organización (capa sobre el directorio estático)

export type EdicionOrg = {
  descripcion?: string;
  capacidadesExtra?: CapacidadDir[];
  editadoEn: string;
};

const EDICIONES_KEY = "aciem_ediciones_org";

export function leerEdiciones(): Record<string, EdicionOrg> {
  try {
    return JSON.parse(localStorage.getItem(EDICIONES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function guardarEdicion(orgId: string, datos: Omit<EdicionOrg, "editadoEn">) {
  const e = leerEdiciones();
  e[orgId] = { ...datos, editadoEn: new Date().toISOString() };
  localStorage.setItem(EDICIONES_KEY, JSON.stringify(e));
}

// ---------------------------------------------------------------------------
// CU-12 — Reglas heurísticas (umbrales de alerta configurables)

export type ReglaHeuristica = {
  id: string;
  nombre: string;
  indicador: "TDP" | "IEH" | "CCE";
  operador: ">" | "<";
  umbral: number;
  severidad: "alta" | "media";
  activa: boolean;
};

const REGLAS_KEY = "aciem_reglas_heuristicas";

export const reglasPorDefecto: ReglaHeuristica[] = [
  { id: "r-tdp", nombre: "Desviación presupuestaria alta", indicador: "TDP", operador: ">", umbral: 10, severidad: "alta", activa: true },
  { id: "r-ieh", nombre: "Ejecución de hitos baja", indicador: "IEH", operador: "<", umbral: 0.8, severidad: "alta", activa: true },
  { id: "r-cce-alta", nombre: "Sobrecarga del equipo", indicador: "CCE", operador: ">", umbral: 90, severidad: "media", activa: true },
  { id: "r-cce-baja", nombre: "Subutilización del equipo", indicador: "CCE", operador: "<", umbral: 40, severidad: "media", activa: false },
];

export function leerReglas(): ReglaHeuristica[] {
  try {
    const raw = localStorage.getItem(REGLAS_KEY);
    return raw ? JSON.parse(raw) : reglasPorDefecto;
  } catch {
    return reglasPorDefecto;
  }
}

export function guardarReglas(reglas: ReglaHeuristica[]) {
  localStorage.setItem(REGLAS_KEY, JSON.stringify(reglas));
}

// ---------------------------------------------------------------------------
// CU-14 — Interdependencias del ecosistema (grafo de proyectos)

export type NodoProyecto = {
  id: string;
  nombre: string;
  organizacion: string;
  tdp: number; // % desviación presupuestaria
  ieh: number; // índice ejecución hitos (0–1)
  x: number;
  y: number;
};

export type Dependencia = { origen: string; destino: string; tipo: "estatica" | "logica" | "coordinacion" };

export const nodosProyecto: NodoProyecto[] = [
  { id: "p1", nombre: "Interventoría parque eólico Windpeshi", organizacion: "HMV Ingenieros", tdp: 4, ieh: 0.92, x: 90, y: 70 },
  { id: "p2", nombre: "Subestación colectora 500 kV", organizacion: "HMV Ingenieros", tdp: 13, ieh: 0.71, x: 320, y: 60 },
  { id: "p3", nombre: "Parque eólico Jouktai (100 MW)", organizacion: "Guajira Eólica", tdp: 18, ieh: 0.62, x: 210, y: 190 },
  { id: "p4", nombre: "Monitoreo IoT de subestaciones", organizacion: "U. de Antioquia", tdp: -2, ieh: 0.95, x: 430, y: 190 },
  { id: "p5", nombre: "Refuerzo sísmico de escuelas rurales", organizacion: "U. Nacional", tdp: 6, ieh: 0.88, x: 90, y: 300 },
  { id: "p6", nombre: "Telemetría de acueductos rurales", organizacion: "SensorTech", tdp: 1, ieh: 0.9, x: 320, y: 300 },
];

export const dependencias: Dependencia[] = [
  { origen: "p3", destino: "p1", tipo: "coordinacion" },
  { origen: "p3", destino: "p2", tipo: "estatica" },
  { origen: "p2", destino: "p4", tipo: "logica" },
  { origen: "p6", destino: "p4", tipo: "coordinacion" },
];

export function evaluarAlertas(reglas: ReglaHeuristica[]) {
  const alertas: { proyecto: NodoProyecto; regla: ReglaHeuristica; valor: number }[] = [];
  for (const p of nodosProyecto) {
    for (const r of reglas.filter((x) => x.activa)) {
      const valor = r.indicador === "TDP" ? p.tdp : r.indicador === "IEH" ? p.ieh : null;
      if (valor === null) continue;
      const disparo = r.operador === ">" ? valor > r.umbral : valor < r.umbral;
      if (disparo) alertas.push({ proyecto: p, regla: r, valor });
    }
  }
  return alertas;
}

// ---------------------------------------------------------------------------
// CU-15 — Escenarios y decisiones

export type Acuerdo = {
  id: string;
  parametro: string;
  proyeccion: string;
  decision: string;
  registradoPor: string;
  fecha: string;
};

const ACUERDOS_KEY = "aciem_acuerdos_escenarios";

export function leerAcuerdos(): Acuerdo[] {
  try {
    return JSON.parse(localStorage.getItem(ACUERDOS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function registrarAcuerdo(a: Omit<Acuerdo, "id" | "fecha">) {
  const lista = leerAcuerdos();
  lista.unshift({ ...a, id: `ac-${Date.now()}`, fecha: new Date().toISOString() });
  localStorage.setItem(ACUERDOS_KEY, JSON.stringify(lista));
}

// ---------------------------------------------------------------------------
// CU-16 — Administrar usuarios (roles) y taxonomías

export type Rol = "registrado" | "analista" | "admin";

const ROLES_KEY = "aciem_roles";

export function leerRoles(): Record<string, Rol> {
  try {
    return JSON.parse(localStorage.getItem(ROLES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function asignarRol(email: string, rol: Rol) {
  const r = leerRoles();
  r[email] = rol;
  localStorage.setItem(ROLES_KEY, JSON.stringify(r));
}

export function rolDe(email: string | undefined): Rol {
  if (!email) return "registrado";
  return leerRoles()[email] ?? "analista"; // demo: todo usuario autenticado puede actuar como analista
}

const SECTORES_EXTRA_KEY = "aciem_sectores_extra";

export function leerSectoresExtra(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SECTORES_EXTRA_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function agregarSectorExtra(nombre: string) {
  const s = leerSectoresExtra();
  if (!s.includes(nombre)) {
    s.push(nombre);
    localStorage.setItem(SECTORES_EXTRA_KEY, JSON.stringify(s));
  }
}

export function quitarSectorExtra(nombre: string) {
  localStorage.setItem(SECTORES_EXTRA_KEY, JSON.stringify(leerSectoresExtra().filter((s) => s !== nombre)));
}

// ---------------------------------------------------------------------------
// CU-13 — Boletines publicados por el analista (además de los sembrados)

export type BoletinPublicado = {
  id: string;
  titulo: string;
  periodo: string;
  resumen: string;
  publicadoPor: string;
  publicadoEn: string;
};

const BOLETINES_KEY = "aciem_boletines_publicados";

export function leerBoletinesPublicados(): BoletinPublicado[] {
  try {
    return JSON.parse(localStorage.getItem(BOLETINES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function publicarBoletin(b: Omit<BoletinPublicado, "id" | "publicadoEn">) {
  const lista = leerBoletinesPublicados();
  lista.unshift({ ...b, id: `bol-${Date.now()}`, publicadoEn: new Date().toISOString() });
  localStorage.setItem(BOLETINES_KEY, JSON.stringify(lista));
}
