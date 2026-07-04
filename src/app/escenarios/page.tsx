import { SimuladorEscenarios } from "./simulador";

export const metadata = { title: "Escenarios y decisiones · Observatorio de Datos ACIEM" };

export default function EscenariosPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Escenarios y decisiones</h1>
      <p className="mt-1 text-sm text-navy/50">
        Simula el impacto de una variable hipotética sobre la cartera de proyectos y registra el acuerdo con los
        interesados.
      </p>
      <SimuladorEscenarios />
    </div>
  );
}
