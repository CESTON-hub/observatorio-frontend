"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type TipoActor = "empresa" | "gobierno" | "academia" | "emprendedor";

export type Cuenta = {
  nombre: string;
  email: string;
  password: string; // demo front-only: sin hashing ni backend real
  tipoActor: TipoActor;
};

type SesionUsuario = Omit<Cuenta, "password">;

type AuthContextValue = {
  listo: boolean;
  usuario: SesionUsuario | null;
  registrar: (datos: Cuenta) => { ok: true } | { ok: false; error: string };
  iniciarSesion: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  cerrarSesion: () => void;
  existeCuenta: (email: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const CUENTAS_KEY = "aciem_cuentas";
const SESION_KEY = "aciem_sesion";

const normalizarEmail = (email: string) => email.trim().toLowerCase();

export function leerCuentas(): Cuenta[] {
  try {
    const raw = localStorage.getItem(CUENTAS_KEY);
    return raw ? (JSON.parse(raw) as Cuenta[]) : [];
  } catch {
    return [];
  }
}

function guardarCuentas(cuentas: Cuenta[]) {
  localStorage.setItem(CUENTAS_KEY, JSON.stringify(cuentas));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [listo, setListo] = useState(false);
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);

  useEffect(() => {
    const email = localStorage.getItem(SESION_KEY);
    if (email) {
      const cuenta = leerCuentas().find((c) => c.email === email);
      if (cuenta) setUsuario({ nombre: cuenta.nombre, email: cuenta.email, tipoActor: cuenta.tipoActor });
    }
    setListo(true);
  }, []);

  const existeCuenta = (email: string) => leerCuentas().some((c) => c.email === normalizarEmail(email));

  const registrar: AuthContextValue["registrar"] = (datos) => {
    const email = normalizarEmail(datos.email);
    const cuentas = leerCuentas();
    if (cuentas.some((c) => c.email === email)) {
      return { ok: false, error: "Ya existe una cuenta con este correo. Inicia sesión." };
    }
    const nueva: Cuenta = { ...datos, email };
    guardarCuentas([...cuentas, nueva]);
    localStorage.setItem(SESION_KEY, email);
    setUsuario({ nombre: nueva.nombre, email: nueva.email, tipoActor: nueva.tipoActor });
    return { ok: true };
  };

  const iniciarSesion: AuthContextValue["iniciarSesion"] = (email, password) => {
    const correo = normalizarEmail(email);
    const cuenta = leerCuentas().find((c) => c.email === correo);
    if (!cuenta || cuenta.password !== password) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }
    localStorage.setItem(SESION_KEY, correo);
    setUsuario({ nombre: cuenta.nombre, email: cuenta.email, tipoActor: cuenta.tipoActor });
    return { ok: true };
  };

  const cerrarSesion = () => {
    localStorage.removeItem(SESION_KEY);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ listo, usuario, registrar, iniciarSesion, cerrarSesion, existeCuenta }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export const tiposActor: { id: TipoActor; label: string }[] = [
  { id: "empresa", label: "Empresa" },
  { id: "gobierno", label: "Gobierno" },
  { id: "academia", label: "Academia" },
  { id: "emprendedor", label: "Emprendedor" },
];
