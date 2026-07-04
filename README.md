# Observatorio de Datos ACIEM — Frontend

Frontend de demostración del Observatorio ACIEM, implementado a partir de la guía de diseño en Figma (3 pantallas: Home, Indicadores, Dashboard).

Documentación de arquitectura del proyecto: [CESTON-hub/docs-observatorio](https://github.com/CESTON-hub/docs-observatorio).

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Recharts** para gráficos (sparklines, áreas, barras)
- **d3-geo + topojson-client** para el mapa de Colombia (proyección Mercator real sobre geometría oficial de departamentos)
- **DM Sans** (tipografía del diseño) vía `next/font`
- Datos de demostración en [`src/lib/data.ts`](src/lib/data.ts) — en producción provienen de la API GraphQL definida en el backend-spec

## Pantallas

| Ruta | Contenido |
|---|---|
| Pantalla inicial | Login / registro estilo Ramp (`src/components/AuthScreen.tsx`). Bloquea el acceso hasta iniciar sesión o crear cuenta. |
| `/` | Hero con buscador y búsquedas populares, barra de stats, categorías por sector, indicador destacado con gráfico |
| `/buscar` | **CU-01** — Buscador de capacidades ("mini-Google"): interpreta la intención (contratar/investigar/financiación/territorio), recomienda entidades rankeadas con justificación y contacto |
| `/organizaciones/[id]` | **CU-04 + CU-05 + CU-18** — Perfil de organización; el editor puede modificar descripción y capacidades; reclamar perfil censado y confirmar datos vigentes |
| `/registro` | **CU-03** — Wizard de registro de organización por tipo de actor (5 pasos), termina en la cola de validación |
| `/indicadores` | **CU-06 + CU-07** — KPIs, filtros, sparklines, búsqueda en vivo y exportación CSV de las series visibles |
| `/dashboard` | **CU-02** — Caracterización de actores registrados: mapa interactivo País→Ciudad→Municipio, sector, CIIU y tipo de actor |
| `/convocatorias` | **CU-19** — Becas, financiación, proyectos e incentivos filtrables por tipo y estado (abierta/cerrada por fecha) |
| `/publicaciones` | **CU-08 + CU-09 + CU-13** — Marco metodológico, boletines (+ redactar y publicar uno nuevo) y generador de perfiles territoriales |
| `/experiencias` | **CU-10** — Banco de buenas prácticas con botones de salto analítico al dashboard |
| `/interdependencias` | **CU-14** — Grafo de dependencias entre proyectos con alertas heurísticas y resaltado de predecesores/sucesores al pasar el cursor |
| `/escenarios` | **CU-15** — Simulador de parámetros hipotéticos (presupuesto, personal) con proyección de riesgo y registro de acuerdos |
| `/admin/validacion` | **CU-11** — Cola de validación human-in-the-loop (rol analista): ítems del autoregistro y del ETL/IA con fuente original y confianza, aprobar/rechazar |
| `/admin/reglas` | **CU-12** — Configuración de umbrales de alerta (TDP, IEH, CCE) usados en interdependencias |
| `/admin/administracion` | **CU-16** — Asignación de roles a usuarios registrados y gestión de la taxonomía de sectores |

Los códigos CU-XX corresponden a los casos de uso de [docs-observatorio/docs/arquitectura/casos-de-uso.md](https://github.com/CESTON-hub/docs-observatorio/blob/main/docs/arquitectura/casos-de-uso.md) — todos están implementados excepto CU-17 (ingerir fuente externa), que es un proceso de backend/ETL sin interfaz de usuario. El directorio de demo y el motor de búsqueda por intención viven en [`src/lib/directorio.ts`](src/lib/directorio.ts); los flujos de gestión (reglas, roles, taxonomías, boletines, escenarios, interdependencias) en [`src/lib/gestion.ts`](src/lib/gestion.ts). Todo persiste en `localStorage`.

## Navegación

La navegación es un **sidebar fijo** a la izquierda en escritorio (`src/components/Sidebar.tsx`), inspirado en el patrón de Stripe Dashboard: marca arriba, enlaces principales, sección colapsable "Gestión" con los flujos de analista/admin, y la tarjeta de usuario abajo. En móvil colapsa a una barra superior con menú hamburguesa que abre un drawer con el mismo contenido.

## Autenticación (solo frontend)

`src/lib/auth.tsx` implementa un `AuthProvider` con cuentas y sesión persistidas en `localStorage` (sin backend todavía):

- **Primera vez**: el visitante ve el login y puede pulsar "Crea tu cuenta" → formulario con nombre, correo, contraseña y tipo de actor (empresa/gobierno/academia/emprendedor, alineado con el CU-03 de la documentación de arquitectura).
- **Visitas siguientes**: si hay sesión guardada, entra directo a la app (sin flash de login).
- El chip circular con las iniciales del usuario (arriba a la derecha del nav) abre un menú con "Cerrar sesión".
- Este mecanismo es una simulación para la demo — cuando exista el backend (ver `docs/arquitectura/backend-spec.md` del repo de documentación), se reemplaza por `POST /api/auth/registro` y `/api/auth/login` reales, manteniendo la misma interfaz de `useAuth()`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## Notas

- El logo en `src/components/AciemLogo.tsx` es una reconstrucción vectorial del logotipo oficial de ACIEM (dos triángulos rojos + wordmark) — reemplazar por el archivo de marca oficial (SVG/PNG en alta resolución) cuando esté disponible.
- El mapa de Colombia (`src/components/ColombiaMap.tsx`) usa la geometría oficial de los 33 departamentos (`public/data/colombia-departamentos.json`, TopoJSON simplificado desde el shapefile MGN del DANE) renderizada con `d3-geo` (proyección Mercator ajustada al viewport). Cada departamento se colorea según la cobertura de su región natural (`mapaDepartamentoARegion` en `src/lib/data.ts`); en producción el color vendría por departamento, no por región agregada.
- Colores de marca: azul `#0c1f3d`, rojo ACIEM `#E30613` (definidos en `src/app/globals.css`).
- `react-simple-maps` no soporta React 19 todavía (peer dep en 16/17/18) — por eso el mapa usa `d3-geo` + `topojson-client` directamente en vez de ese wrapper.
