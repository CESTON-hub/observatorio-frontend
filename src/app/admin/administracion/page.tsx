import { PanelAdministracion } from "./panel";

export const metadata = { title: "Administración · Observatorio de Datos ACIEM" };

export default function AdministracionPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">Administración</h1>
        <span className="rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-semibold uppercase text-white">Rol: Admin</span>
      </div>
      <p className="mt-1 text-sm text-navy/50">Gestión de roles de usuario y de las taxonomías del observatorio (sectores).</p>
      <PanelAdministracion />
    </div>
  );
}
