import { GeneradorPerfil } from "./generador";
import { ListaBoletines, RedactorBoletin } from "./boletines-cliente";

export const metadata = { title: "Publicaciones · Observatorio de Datos ACIEM" };

export default function PublicacionesPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-navy">Publicaciones e informes</h1>
      <p className="mt-1 text-sm text-navy/50">
        Boletines estadísticos, notas metodológicas y perfiles territoriales generados desde los datos del observatorio.
      </p>

      {/* Marco metodológico */}
      <div className="mt-6 rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Marco conceptual y metodológico</h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background p-4">
          <div>
            <p className="text-sm font-semibold text-navy">Documento fundacional del Observatorio (v1.1)</p>
            <p className="text-xs text-navy/55">Metodología de los indicadores, fichas técnicas y taxonomías del ecosistema.</p>
          </div>
          <button className="rounded-full border border-black/12 px-4 py-2 text-sm font-medium text-navy hover:bg-black/5">
            📄 Ver documento
          </button>
        </div>
      </div>

      {/* Boletines */}
      <div className="mt-6 rounded-2xl border border-black/6 bg-white p-6 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-navy/50">Historial de boletines estadísticos</h2>
        <ListaBoletines />
      </div>

      <RedactorBoletin />
      <GeneradorPerfil />
    </div>
  );
}
