"use client";

import { useEffect, useState } from "react";
import { leerCuentas, tiposActor } from "@/lib/auth";
import { leerRoles, asignarRol, leerSectoresExtra, agregarSectorExtra, quitarSectorExtra, type Rol } from "@/lib/gestion";
import { sectoresCiiu } from "@/lib/actores";

const roles: Rol[] = ["registrado", "analista", "admin"];
const etiquetaRol: Record<Rol, string> = { registrado: "Registrado", analista: "Analista", admin: "Admin" };

export function PanelAdministracion() {
  const [tab, setTab] = useState<"usuarios" | "taxonomias">("usuarios");
  const [cuentas, setCuentas] = useState(leerCuentas());
  const [rolesMap, setRolesMap] = useState<Record<string, Rol>>({});
  const [sectoresExtra, setSectoresExtra] = useState<string[]>([]);
  const [nuevoSector, setNuevoSector] = useState("");

  useEffect(() => {
    setCuentas(leerCuentas());
    setRolesMap(leerRoles());
    setSectoresExtra(leerSectoresExtra());
  }, []);

  const cambiarRol = (email: string, rol: Rol) => {
    asignarRol(email, rol);
    setRolesMap((r) => ({ ...r, [email]: rol }));
  };

  const agregarSector = () => {
    if (!nuevoSector.trim()) return;
    agregarSectorExtra(nuevoSector.trim());
    setSectoresExtra(leerSectoresExtra());
    setNuevoSector("");
  };

  const quitarSector = (s: string) => {
    quitarSectorExtra(s);
    setSectoresExtra(leerSectoresExtra());
  };

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("usuarios")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "usuarios" ? "bg-navy text-white" : "border border-black/10 text-navy/70"}`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setTab("taxonomias")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === "taxonomias" ? "bg-navy text-white" : "border border-black/10 text-navy/70"}`}
        >
          Taxonomías
        </button>
      </div>

      {tab === "usuarios" ? (
        <div className="mt-5 space-y-3">
          {cuentas.length === 0 && (
            <p className="rounded-2xl border border-dashed border-black/12 bg-white p-8 text-center text-sm text-navy/50">
              No hay cuentas registradas en este navegador todavía.
            </p>
          )}
          {cuentas.map((c) => (
            <div key={c.email} className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/6 bg-white p-4 shadow-[0_1px_2px_rgba(12,31,61,0.05)]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{c.nombre}</p>
                <p className="truncate text-xs text-navy/50">{c.email}</p>
              </div>
              <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[11px] font-medium text-navy/60">
                {tiposActor.find((t) => t.id === c.tipoActor)?.label ?? c.tipoActor}
              </span>
              <select
                value={rolesMap[c.email] ?? "analista"}
                onChange={(e) => cambiarRol(c.email, e.target.value as Rol)}
                className="h-9 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-navy outline-none"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{etiquetaRol[r]}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Sectores de la taxonomía base</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sectoresCiiu.map((s) => (
              <span key={s.sector} className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-navy/70">{s.sector}</span>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-navy/50">Sectores agregados por administración</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sectoresExtra.length === 0 && <p className="text-xs text-navy/40">Ninguno todavía.</p>}
            {sectoresExtra.map((s) => (
              <span key={s} className="flex items-center gap-2 rounded-full bg-aciem/10 px-3 py-1.5 text-xs font-medium text-aciem">
                {s}
                <button onClick={() => quitarSector(s)} aria-label={`Quitar ${s}`} className="text-aciem/60 hover:text-aciem">✕</button>
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={nuevoSector}
              onChange={(e) => setNuevoSector(e.target.value)}
              placeholder="Ej. Ingeniería Industrial"
              className="h-10 flex-1 rounded-xl border border-black/10 bg-white px-3.5 text-sm outline-none focus:border-navy/30"
            />
            <button onClick={agregarSector} className="rounded-xl bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-800">
              Agregar sector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
