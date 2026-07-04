"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AciemLogo } from "./AciemLogo";
import { useAuth } from "@/lib/auth";
import {
  IconHome,
  IconSearch,
  IconBarChart,
  IconGrid,
  IconMegaphone,
  IconBook,
  IconStar,
  IconBuilding,
  IconShare,
  IconCalculator,
  IconCheckCircle,
  IconSliders,
  IconShield,
  IconChevronDown,
  IconLogOut,
  IconMenu,
  IconClose,
} from "./icons";

const principales = [
  { href: "/", label: "Inicio", icon: IconHome },
  { href: "/buscar", label: "Buscador", icon: IconSearch },
  { href: "/indicadores", label: "Indicadores", icon: IconBarChart },
  { href: "/dashboard", label: "Dashboard", icon: IconGrid },
  { href: "/convocatorias", label: "Convocatorias", icon: IconMegaphone },
  { href: "/publicaciones", label: "Publicaciones", icon: IconBook },
  { href: "/experiencias", label: "Experiencias", icon: IconStar },
];

const gestion = [
  { href: "/registro", label: "Registrar organización", icon: IconBuilding },
  { href: "/interdependencias", label: "Interdependencias", icon: IconShare },
  { href: "/escenarios", label: "Escenarios y decisiones", icon: IconCalculator },
  { href: "/admin/validacion", label: "Cola de validación", icon: IconCheckCircle },
  { href: "/admin/reglas", label: "Reglas heurísticas", icon: IconSliders },
  { href: "/admin/administracion", label: "Administración", icon: IconShield },
];

function iniciales(nombre: string) {
  const p = nombre.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

function ItemNav({ href, label, icon: Icon, activo }: { href: string; label: string; icon: typeof IconHome; activo: boolean }) {
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
        activo ? "bg-aciem/10 text-aciem" : "text-navy/70 hover:bg-black/5"
      }`}
    >
      <Icon className={activo ? "text-aciem" : "text-navy/45"} />
      {label}
    </Link>
  );
}

function ContenidoSidebar({ onNavegar }: { onNavegar?: () => void }) {
  const pathname = usePathname();
  const { usuario, cerrarSesion } = useAuth();
  const [gestionAbierta, setGestionAbierta] = useState(true);
  const [menuUsuario, setMenuUsuario] = useState(false);

  return (
    <div className="flex h-full flex-col" onClick={(e) => {
      if ((e.target as HTMLElement).closest("a")) onNavegar?.();
    }}>
      {/* Marca */}
      <div className="flex items-center gap-2.5 border-b border-black/8 px-4 py-4">
        <AciemLogo className="h-8 w-auto shrink-0" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] font-bold text-navy">Observatorio</p>
          <p className="truncate text-[11px] text-navy/50">de Datos · ACIEM</p>
        </div>
      </div>

      {/* Navegación */}
      <nav aria-label="Principal" className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {principales.map((l) => (
            <ItemNav key={l.href} {...l} activo={pathname === l.href} />
          ))}
        </div>

        <div>
          <button
            onClick={() => setGestionAbierta((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy/40 hover:text-navy/60"
          >
            Gestión
            <IconChevronDown className={`transition-transform ${gestionAbierta ? "" : "-rotate-90"}`} />
          </button>
          {gestionAbierta && (
            <div className="mt-0.5 space-y-0.5">
              {gestion.map((l) => (
                <ItemNav key={l.href} {...l} activo={pathname === l.href} />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Usuario */}
      {usuario && (
        <div className="relative border-t border-black/8 p-3">
          {menuUsuario && (
            <>
              <button className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={() => setMenuUsuario(false)} tabIndex={-1} />
              <div className="absolute bottom-full left-3 z-50 mb-2 w-[calc(100%-1.5rem)] rounded-xl border border-black/8 bg-white p-1.5 shadow-lg">
                <button
                  onClick={() => {
                    setMenuUsuario(false);
                    cerrarSesion();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-down hover:bg-black/5"
                >
                  <IconLogOut />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
          <button onClick={() => setMenuUsuario((v) => !v)} className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-black/5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
              {iniciales(usuario.nombre)}
            </span>
            <span className="min-w-0 flex-1 text-left leading-tight">
              <span className="block truncate text-[13px] font-semibold text-navy">{usuario.nombre}</span>
              <span className="block truncate text-[11px] text-navy/45">{usuario.email}</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [movilAbierto, setMovilAbierto] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMovilAbierto(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = movilAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [movilAbierto]);

  return (
    <>
      {/* Barra superior móvil */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-black/8 bg-white/95 px-4 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <AciemLogo className="h-7 w-auto" />
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-navy">Observatorio</span>
        </Link>
        <button
          onClick={() => setMovilAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={movilAbierto}
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-black/5"
        >
          <IconMenu />
        </button>
      </header>

      {/* Sidebar de escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-black/8 bg-white md:block">
        <ContenidoSidebar />
      </aside>

      {/* Drawer móvil */}
      {movilAbierto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/40" aria-hidden onClick={() => setMovilAbierto(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            <div className="flex items-center justify-end p-2">
              <button
                onClick={() => setMovilAbierto(false)}
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy hover:bg-black/5"
              >
                <IconClose />
              </button>
            </div>
            <div className="h-[calc(100%-3.25rem)]">
              <ContenidoSidebar onNavegar={() => setMovilAbierto(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
