import { GrafoInterdependencias } from "./grafo";

export const metadata = { title: "Interdependencias del ecosistema · Observatorio de Datos ACIEM" };

export default function InterdependenciasPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Interdependencias del ecosistema</h1>
      <p className="mt-1 text-sm text-navy/50">
        Relaciones entre proyectos de la cartera. El grosor de la línea indica el tipo de dependencia; pasa el cursor
        sobre un nodo para ver sus predecesores y sucesores directos.
      </p>
      <GrafoInterdependencias />
    </div>
  );
}
