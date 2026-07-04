"use client";

import { useAuth } from "@/lib/auth";
import { AuthScreen } from "./AuthScreen";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

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
      <div className="flex min-h-full flex-col md:ml-64">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
