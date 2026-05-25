import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const data = [
    { day: "Mon", risk: 30 },
    { day: "Tue", risk: 45 },
    { day: "Wed", risk: 60 },
    { day: "Thu", risk: 40 },
    { day: "Fri", risk: 80 },
    { day: "Sat", risk: 55 },
    { day: "Sun", risk: 70 },
  ];

  return (
    <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
      <h1 className="text-5xl text-center text-white mb-10 font-bold">
        AI Analytics Dashboard
      </h1>

      <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800">
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}