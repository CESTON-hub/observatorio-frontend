import { Suspense } from "react";
import { kpis } from "@/lib/data";
import { KpiCard } from "@/components/cards";
import { ExploradorIndicadores } from "./explorador";

export const metadata = { title: "Indicadores · Observatorio de Datos ACIEM" };

export default function IndicadoresPage() {
  return (
    <div className="mx-auto max-w-[1129px] px-6 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.etiqueta} {...k} />
        ))}
      </div>
      <Suspense>
        <ExploradorIndicadores />
      </Suspense>
    </div>
  );
}
