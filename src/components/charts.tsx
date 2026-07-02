"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { matriz, regiones } from "@/lib/data";

const UP = "#0e9f6e";
const DOWN = "#d92d20";

export function Sparkline({ serie, positiva }: { serie: { anio: number; valor: number }[]; positiva: boolean }) {
  const color = positiva ? UP : DOWN;
  const id = `sp-${color.slice(1)}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={serie} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="valor" stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SerieDestacada({ serie }: { serie: { anio: number; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={serie} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="dest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={UP} stopOpacity={0.2} />
            <stop offset="100%" stopColor={UP} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ec" vertical={false} />
        <XAxis dataKey="anio" tick={{ fontSize: 10, fill: "#8a93a3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#8a93a3" }} tickLine={false} axisLine={false} unit="%" />
        <Tooltip formatter={(v) => [`${v}%`, "Participación"]} labelFormatter={(a) => `Año ${a}`} />
        <Area type="monotone" dataKey="valor" stroke={UP} strokeWidth={2.5} fill="url(#dest)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EnergiaPorRegion() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={regiones} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ec" vertical={false} />
        <XAxis dataKey="region" tick={{ fontSize: 11, fill: "#8a93a3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#8a93a3" }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
        <Bar name="Energía (TWh)" dataKey="energia" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={34} />
        <Bar name="Ingenieros (mil)" dataKey="ingenieros" fill="#c41414" radius={[3, 3, 0, 0]} maxBarSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MatrizEnergetica() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={matriz} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
        <defs>
          <linearGradient id="ren" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={UP} stopOpacity={0.25} />
            <stop offset="100%" stopColor={UP} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="hid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ec" vertical={false} />
        <XAxis dataKey="anio" tick={{ fontSize: 10, fill: "#8a93a3" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#8a93a3" }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
        <Tooltip formatter={(v, n) => [`${v}%`, n]} labelFormatter={(a) => `Año ${a}`} />
        <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
        <Area name="Renovables (%)" type="monotone" dataKey="renovables" stroke={UP} strokeWidth={2.5} fill="url(#ren)" />
        <Area name="Hidroeléctrica (%)" type="monotone" dataKey="hidroelectrica" stroke="#2563eb" strokeWidth={2.5} fill="url(#hid)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
