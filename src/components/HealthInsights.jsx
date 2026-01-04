import {
    Area,
    AreaChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { healthEducationCards, healthMetricsTimeline } from "../data/platformData";

const HealthInsights = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.5em] text-slate-500 font-semibold">
              Blood Health Intelligence
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Live Health Parameters & Alerts</h2>
            <p className="text-slate-400 max-w-2xl">
              Monitor serum creatinine, hemoglobin, platelet count, WBC, and RBC trends. BloodBridge
              surfaces alerts when donors fall outside safe ranges before donation eligibility changes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Weekly Lab Snapshot</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={healthMetricsTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPlatelet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <ReferenceLine y={12.5} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: 'Min Hb', fill: '#22c55e' }} />
                <Area
                  type="monotone"
                  dataKey="hemoglobin"
                  stroke="#e11d48"
                  fillOpacity={1}
                  fill="url(#colorHb)"
                  name="Hemoglobin (g/dL)"
                />
                <Area
                  type="monotone"
                  dataKey="platelet"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#colorPlatelet)"
                  name="Platelet (K/µL)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {healthEducationCards.map((card) => (
              <article key={card.title} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-lg hover:border-slate-700 transition-colors">
                <h3 className="text-xl font-bold text-gray-100">{card.title}</h3>
                <p className="text-sm text-slate-400">{card.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">Safe</p>
                    <p className="text-emerald-400 font-bold">{card.safe}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-[0.3em]">Alert</p>
                    <p className="text-amber-400 font-bold">{card.alert}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthInsights;

