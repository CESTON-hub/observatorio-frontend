import { notFound } from "next/navigation";
import { organizaciones } from "@/lib/directorio";
import { PerfilOrganizacion } from "./perfil-organizacion";

export function generateStaticParams() {
  return organizaciones.map((o) => ({ id: o.id }));
}

export default async function OrganizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = organizaciones.find((o) => o.id === id);
  if (!org) notFound();

  return <PerfilOrganizacion org={org} />;
}
