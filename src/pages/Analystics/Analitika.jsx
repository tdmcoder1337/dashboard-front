import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", blue: 5, purple: 2 },
  { month: "Feb", blue: 18, purple: 4 },
  { month: "Mar", blue: 7, purple: 10 },
  { month: "Apr", blue: 25, purple: 8 },
  { month: "May", blue: 15, purple: 20 },
  { month: "Jun", blue: 12, purple: 14 },
  { month: "Jul", blue: 18, purple: 11 },
  { month: "Aug", blue: 14, purple: 16 },
  { month: "Sep", blue: 11, purple: 20 },
  { month: "Oct", blue: 16, purple: 8 },
];

export default function Analytics() {
  return (
    <div className="bg-[#111827] p-5 rounded-2xl w-full h-[400px]">
      <h2 className="text-white text-xl mb-5">
        Sales Analytics
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="blue"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="purple"
            stroke="#a855f7"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}