import Link from "next/link";
import { AciemLogo } from "./AciemLogo";

const columnas = [
  {
    titulo: "Datos",
    items: [
      { label: "Indicadores", href: "/indicadores" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Metodología", href: "#" },
      { label: "Descargar CSV", href: "#" },
    ],
  },
  {
    titulo: "Institución",
    items: [
      { label: "Sobre ACIEM", href: "#" },
      { label: "Publicaciones", href: "#" },
      { label: "Eventos", href: "#" },
      { label: "Prensa", href: "#" },
    ],
  },
  {
    titulo: "Contacto",
    items: [
      { label: "aciem@aciem.org", href: "mailto:aciem@aciem.org" },
      { label: "Bogotá, Colombia", href: "#" },
      { label: "@aciem_colombia", href: "#" },
      { label: "Canal YouTube", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="mx-auto grid max-w-[1129px] gap-10 px-6 py-12 md:grid-cols-[1fr_auto]">
        <div className="max-w-xs space-y-4">
          <AciemLogo className="h-9 w-auto" />
          <p className="text-sm leading-6 text-navy/70">
            Asociación Colombiana de Ingenieros. Observatorio de Datos de Ingeniería y Energía para Colombia.
          </p>
          <p className="text-xs text-navy/40">© 2026 ACIEM Colombia. Todos los derechos reservados.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {columnas.map((c) => (
            <div key={c.titulo}>
              <p className="mb-3 text-sm font-semibold text-navy">{c.titulo}</p>
              <ul className="space-y-2">
                {c.items.map((i) => (
                  <li key={i.label}>
                    <Link href={i.href} className="text-sm text-navy/60 hover:text-aciem">
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
