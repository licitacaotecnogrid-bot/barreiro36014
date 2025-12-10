import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { eventos } from "@/data/mock";

const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const eventsByMonth = months.map((m, i) => ({
  name: m,
  total: eventos.filter(e => new Date(e.data).getMonth() === i).length,
}));

const statusData = [
  { name: "Confirmado", value: eventos.filter(e=>e.status==="Confirmado").length, color: "#16a34a" },
  { name: "Pendente", value: eventos.filter(e=>e.status==="Pendente").length, color: "#eab308" },
  { name: "Cancelado", value: eventos.filter(e=>e.status==="Cancelado").length, color: "#dc2626" },
];

export default function Relatorios() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-medium">Eventos por mês</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventsByMonth}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-medium">Status dos eventos</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={96} innerRadius={60}>
                {statusData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
