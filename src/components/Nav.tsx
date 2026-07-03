"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AciemLogo } from "./AciemLogo";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/indicadores", label: "Indicadores" },
  { href: "/dashboard", label: "Dashboard" },
];

function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase() || "?";
}

function MenuUsuario() {
  const { usuario, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  if (!usuario) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white hover:bg-navy-800"
        aria-label="Cuenta"
        aria-haspopup="menu"
        aria-expanded={abierto}
      >
        {iniciales(usuario.nombre)}
      </button>
      {abierto && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            onClick={() => setAbierto(false)}
            tabIndex={-1}
          />
          <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-black/8 bg-white p-1.5 shadow-lg">
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-semibold text-navy">{usuario.nombre}</p>
              <p className="truncate text-xs text-navy/50">{usuario.email}</p>
            </div>
            <div className="my-1 h-px bg-black/6" />
            <button
              role="menuitem"
              onClick={() => {
                setAbierto(false);
                cerrarSesion();
              }}
              className="w-full rounded-lg px-2.5 py-2 text-left text-sm font-medium text-down hover:bg-black/5"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function BotonBuscar({ className = "" }: { className?: string }) {
  return (
    <button aria-label="Buscar" className={`rounded-full p-2 text-navy/60 hover:bg-black/5 ${className}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </button>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { usuario } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cierra el menú móvil al cambiar de ruta.
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // Bloquea el scroll del fondo mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAbierto(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1129px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <AciemLogo className="h-8 w-auto shrink-0" />
          <span className="hidden border-l border-black/15 pl-3 text-[10px] font-semibold uppercase leading-[1.2] tracking-[0.14em] text-navy sm:block">
            Observatorio
            <br />
            de Datos
          </span>
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const activo = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={activo ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activo ? "bg-aciem text-white" : "text-navy/80 hover:bg-black/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <BotonBuscar />
          <Link
            href="/indicadores"
            className="flex items-center gap-2 rounded-full bg-aciem px-4 py-1.5 text-sm font-medium text-white hover:bg-aciem-dark"
          >
            Explorar datos
            <span aria-hidden>→</span>
          </Link>
          <MenuUsuario />
        </div>

        {/* Controles de móvil */}
        <div className="flex items-center gap-1 md:hidden">
          <BotonBuscar />
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-black/5"
          >
            {menuAbierto ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Panel de navegación móvil */}
      {menuAbierto && (
        <div id="menu-movil" className="border-t border-black/8 bg-white md:hidden">
          <nav aria-label="Principal (móvil)" className="flex flex-col px-4 py-3">
            {links.map((l) => {
              const activo = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={activo ? "page" : undefined}
                  className={`rounded-lg px-3 py-3 text-base font-medium ${
                    activo ? "bg-aciem/10 text-aciem" : "text-navy/80 hover:bg-black/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-black/6 px-4 py-3">
            <Link
              href="/indicadores"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-aciem px-4 py-3 text-sm font-semibold text-white hover:bg-aciem-dark"
            >
              Explorar datos
              <span aria-hidden>→</span>
            </Link>
          </div>
          {usuario && (
            <div className="border-t border-black/6 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                  {iniciales(usuario.nombre)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{usuario.nombre}</p>
                  <p className="truncate text-xs text-navy/50">{usuario.email}</p>
                </div>
              </div>
              <CerrarSesionMovil />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function CerrarSesionMovil() {
  const { cerrarSesion } = useAuth();
  return (
    <button
      onClick={cerrarSesion}
      className="mt-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-down hover:bg-black/5"
    >
      Cerrar sesión
    </button>
  );
}
