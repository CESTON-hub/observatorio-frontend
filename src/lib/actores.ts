// Caracterización de actores registrados en el observatorio: empresas, instituciones
// educativas y gobierno, con ubicación (país > ciudad > municipio), sector económico,
// código CIIU y tamaño/tipo. Generado de forma determinística (sin Math.random) para
// que el conteo sea idéntico en servidor y cliente. En producción esto proviene de
// FACT_ECOSISTEMA y ORGANIZACION (ver docs-observatorio/docs/04-modelo-de-datos.md).

export const PAIS = "Colombia";

export const municipiosPorCiudad: Record<string, string[]> = {
  Bogotá: ["Bogotá D.C.", "Soacha", "Chía", "Cota", "Funza", "Mosquera"],
  Medellín: ["Medellín", "Itagüí", "Envigado", "Bello", "Sabaneta", "Copacabana"],
  Cali: ["Cali", "Yumbo", "Jamundí", "Palmira"],
  Barranquilla: ["Barranquilla", "Soledad", "Malambo", "Puerto Colombia"],
  Bucaramanga: ["Bucaramanga", "Floridablanca", "Girón", "Piedecuesta"],
};

export const ciudades = Object.keys(municipiosPorCiudad);

// Departamentos (DPTO_CNMBR del GeoJSON) que corresponden a cada ciudad/área.
// Bogotá incluye Bogotá D.C. y Cundinamarca (municipios del área metropolitana).
export const departamentosPorCiudad: Record<string, string[]> = {
  Bogotá: ["BOGOTÁ, D.C.", "CUNDINAMARCA"],
  Medellín: ["ANTIOQUIA"],
  Cali: ["VALLE DEL CAUCA"],
  Barranquilla: ["ATLÁNTICO"],
  Bucaramanga: ["SANTANDER"],
};

// Índice inverso: nombre de departamento → ciudad seleccionable.
export const ciudadPorDepartamento: Record<string, string> = Object.entries(departamentosPorCiudad).reduce(
  (acc, [ciudad, deptos]) => {
    for (const d of deptos) acc[d] = ciudad;
    return acc;
  },
  {} as Record<string, string>
);

export type TamanoEmpresa = "micro" | "pequena" | "mediana" | "grande";
export type TipoActor = "empresa" | "institucion_educativa" | "gobierno";
export type TipoInstitucion = "publica" | "privada";

export const etiquetaTamano: Record<TamanoEmpresa, string> = {
  micro: "Microempresa",
  pequena: "Pequeña",
  mediana: "Mediana",
  grande: "Grande",
};

export const etiquetaTipoActor: Record<TipoActor, string> = {
  empresa: "Empresa",
  institucion_educativa: "Institución educativa",
  gobierno: "Gobierno",
};

type Ciiu = { codigo: string; nombre: string };

export const sectoresCiiu: { sector: string; ciius: Ciiu[] }[] = [
  { sector: "Energía Eléctrica", ciius: [{ codigo: "D3510", nombre: "Generación, transmisión y distribución de energía eléctrica" }] },
  { sector: "Energías Renovables", ciius: [{ codigo: "D3510", nombre: "Generación de energía eléctrica de fuentes renovables" }] },
  { sector: "Petróleo y Gas", ciius: [{ codigo: "B0610", nombre: "Extracción de petróleo crudo" }, { codigo: "D3520", nombre: "Producción de gas; distribución por tubería" }] },
  { sector: "Ingeniería Civil", ciius: [{ codigo: "F4290", nombre: "Construcción de otras obras de ingeniería civil" }, { codigo: "M7110", nombre: "Actividades de arquitectura e ingeniería" }] },
  { sector: "Ingeniería Electrónica", ciius: [{ codigo: "C2610", nombre: "Fabricación de componentes y tableros electrónicos" }, { codigo: "C2790", nombre: "Fabricación de otros tipos de equipo eléctrico" }] },
  { sector: "Ingeniería Mecánica", ciius: [{ codigo: "C2825", nombre: "Fabricación de maquinaria para la metalurgia" }, { codigo: "C3312", nombre: "Mantenimiento y reparación de maquinaria" }] },
  { sector: "Agua y Saneamiento", ciius: [{ codigo: "E3600", nombre: "Captación, tratamiento y distribución de agua" }, { codigo: "E3700", nombre: "Evacuación y tratamiento de aguas residuales" }] },
  { sector: "Telecomunicaciones", ciius: [{ codigo: "J6110", nombre: "Telecomunicaciones alámbricas" }, { codigo: "J6120", nombre: "Telecomunicaciones inalámbricas" }] },
  { sector: "Infraestructura Vial", ciius: [{ codigo: "F4210", nombre: "Construcción de carreteras y vías férreas" }] },
];

const ciiuEducacion: Ciiu = { codigo: "P8530", nombre: "Educación superior" };
const ciiuGobierno: Ciiu = { codigo: "O8411", nombre: "Actividades de la administración pública" };

export type ActorRegistrado = {
  id: string;
  nombre: string;
  tipoActor: TipoActor;
  tamanoEmpresa?: TamanoEmpresa;
  tipoInstitucion?: TipoInstitucion;
  sector: string;
  ciiu: Ciiu;
  ciudad: string;
  municipio: string;
};

const prefijosEmpresa = ["Grupo", "Tecno", "Andina", "Nacional", "Cordillera", "Industrias", "Soluciones", "Ingeniería", "Sistemas", "Redes"];
const sufijosEmpresa = ["S.A.S.", "Ltda.", "S.A.", "& Cía. S.A.S."];
const tamanos: TamanoEmpresa[] = ["micro", "pequena", "mediana", "grande"];

function construirEmpresas(): ActorRegistrado[] {
  const lista: ActorRegistrado[] = [];
  let i = 0;
  for (const ciudad of ciudades) {
    const municipios = municipiosPorCiudad[ciudad];
    for (const municipio of municipios) {
      for (const { sector, ciius } of sectoresCiiu) {
        const ciiu = ciius[i % ciius.length];
        const tamano = tamanos[i % tamanos.length];
        const nombre = `${prefijosEmpresa[i % prefijosEmpresa.length]} ${sector.split(" ").slice(-1)[0]} ${municipio} ${sufijosEmpresa[i % sufijosEmpresa.length]}`;
        lista.push({
          id: `emp-${i}`,
          nombre,
          tipoActor: "empresa",
          tamanoEmpresa: tamano,
          sector,
          ciiu,
          ciudad,
          municipio,
        });
        i++;
      }
    }
  }
  return lista;
}

function construirInstituciones(): ActorRegistrado[] {
  const lista: ActorRegistrado[] = [];
  let i = 0;
  for (const ciudad of ciudades) {
    const municipios = municipiosPorCiudad[ciudad];
    for (const municipio of municipios.slice(0, 2)) {
      const publica = i % 2 === 0;
      lista.push({
        id: `edu-${i}`,
        nombre: publica ? `Universidad Pública de ${municipio}` : `Instituto Tecnológico de ${municipio}`,
        tipoActor: "institucion_educativa",
        tipoInstitucion: publica ? "publica" : "privada",
        sector: sectoresCiiu[i % sectoresCiiu.length].sector,
        ciiu: ciiuEducacion,
        ciudad,
        municipio,
      });
      i++;
    }
  }
  return lista;
}

function construirGobierno(): ActorRegistrado[] {
  const lista: ActorRegistrado[] = [];
  let i = 0;
  for (const ciudad of ciudades) {
    for (const municipio of municipiosPorCiudad[ciudad]) {
      lista.push({
        id: `gob-${i}`,
        nombre: `Alcaldía de ${municipio}`,
        tipoActor: "gobierno",
        sector: "Administración Pública",
        ciiu: ciiuGobierno,
        ciudad,
        municipio,
      });
      i++;
    }
  }
  return lista;
}

export const actoresRegistrados: ActorRegistrado[] = [
  ...construirEmpresas(),
  ...construirInstituciones(),
  ...construirGobierno(),
];

// ---------------------------------------------------------------------------
// Filtros y agregaciones para el panel del dashboard

export type FiltrosActores = {
  ciudad?: string;
  municipio?: string;
  sector?: string;
  ciiu?: string;
  tipoActor?: TipoActor;
  tamanoEmpresa?: TamanoEmpresa;
  tipoInstitucion?: TipoInstitucion;
};

export function filtrarActores(filtros: FiltrosActores): ActorRegistrado[] {
  return actoresRegistrados.filter((a) => {
    if (filtros.ciudad && a.ciudad !== filtros.ciudad) return false;
    if (filtros.municipio && a.municipio !== filtros.municipio) return false;
    if (filtros.sector && a.sector !== filtros.sector) return false;
    if (filtros.ciiu && a.ciiu.codigo !== filtros.ciiu) return false;
    if (filtros.tipoActor && a.tipoActor !== filtros.tipoActor) return false;
    if (filtros.tamanoEmpresa && a.tamanoEmpresa !== filtros.tamanoEmpresa) return false;
    if (filtros.tipoInstitucion && a.tipoInstitucion !== filtros.tipoInstitucion) return false;
    return true;
  });
}

export function conteoPor<T extends string>(lista: ActorRegistrado[], clave: (a: ActorRegistrado) => T | undefined) {
  const mapa = new Map<string, number>();
  for (const a of lista) {
    const k = clave(a);
    if (!k) continue;
    mapa.set(k, (mapa.get(k) ?? 0) + 1);
  }
  return [...mapa.entries()].map(([nombre, cantidad]) => ({ nombre, cantidad })).sort((a, b) => b.cantidad - a.cantidad);
}

export function ciiusDeSector(sector: string | undefined): Ciiu[] {
  if (!sector) {
    const vistos = new Set<string>();
    return sectoresCiiu
      .flatMap((s) => s.ciius)
      .filter((c) => (vistos.has(c.codigo) ? false : (vistos.add(c.codigo), true)));
  }
  return sectoresCiiu.find((s) => s.sector === sector)?.ciius ?? [];
}
