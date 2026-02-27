"use client";
import { PieChart, Pie, Tooltip, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

export function ReferralPie({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-64"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={90} /><Tooltip /></PieChart></ResponsiveContainer></div>;
}

export function TrendLine({ data }: { data: { label: string; value: number }[] }) {
  return <div className="h-64"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="label" /><YAxis /><Tooltip /><Line dataKey="value" stroke="#0f766e" /></LineChart></ResponsiveContainer></div>;
}
