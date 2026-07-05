"use client";

import { useAuth } from "@/lib/auth";
import { AuthScreen } from "./AuthScreen";
import { Sidebar } from "./Sidebar";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { listo, usuario } = useAuth();

  if (!listo) {
    return <div className="min-h-screen bg-[#f6f7f9]" />;
  }

  if (!usuario) {
    return <AuthScreen />;
  }

  return (
    <>
      <Sidebar />
      <main className="min-h-full md:ml-64">{children}</main>
    </>
  );
}
