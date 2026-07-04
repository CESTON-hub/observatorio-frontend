import { PanelReglas } from "./panel-reglas";

export const metadata = { title: "Reglas heurísticas · Observatorio de Datos ACIEM" };

export default function ReglasPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">Reglas heurísticas</h1>
        <span className="rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-semibold uppercase text-white">Rol: Analista</span>
      </div>
      <p className="mt-1 text-sm text-navy/50">
        Umbrales de alerta configurables sobre el portafolio de proyectos (TDP, IEH, CCE). Se aplican en{" "}
        <a href="/interdependencias" className="font-medium text-aciem hover:underline">interdependencias</a> para marcar proyectos en estado crítico.
      </p>
      <PanelReglas />
    </div>
  );
}
