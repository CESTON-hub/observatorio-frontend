# Observatorio de Datos ACIEM — Frontend

Frontend de demostración del Observatorio ACIEM, implementado a partir de la guía de diseño en Figma (3 pantallas: Home, Indicadores, Dashboard).

Documentación de arquitectura del proyecto: [CESTON-hub/docs-observatorio](https://github.com/CESTON-hub/docs-observatorio).

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Recharts** para gráficos (sparklines, áreas, barras)
- **DM Sans** (tipografía del diseño) vía `next/font`
- Datos de demostración en [`src/lib/data.ts`](src/lib/data.ts) — en producción provienen de la API GraphQL definida en el backend-spec

## Pantallas

| Ruta | Contenido |
|---|---|
| `/` | Hero con buscador y búsquedas populares, barra de stats, categorías por sector, indicador destacado con gráfico |
| `/indicadores` | KPIs, filtros por categoría/período/región, grilla de indicadores con sparklines y búsqueda en vivo |
| `/dashboard` | Resumen ejecutivo: KPIs, energía y capital humano por región, mapa de cobertura por regiones, evolución de la matriz energética, lista de indicadores destacados |

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## Notas

- El logo ACIEM en `src/components/AciemLogo.tsx` es una marca provisional — reemplazar por el activo oficial.
- El mapa de Colombia (`src/components/ColombiaMap.tsx`) usa formas simplificadas por región; en producción se reemplaza por un choropleth con GeoJSON del DANE.
- Colores de marca: azul `#0c1f3d`, rojo ACIEM `#c41414` (definidos en `src/app/globals.css`).
