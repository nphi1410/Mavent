import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", total: 10, attended: 6 },
  { month: "Feb", total: 12, attended: 9 },
  { month: "Mar", total: 8, attended: 7 },
  { month: "Apr", total: 15, attended: 10 },
  { month: "May", total: 9, attended: 7 },
  { month: "Jun", total: 14, attended: 11 },
];

const EventBarChart = () => (
  <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-800">📊 Monthly Attendance</h2>
      <p className="text-sm text-gray-500">Compare your participation vs total events</p>
    </div>

    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="attended" stackId="a" fill="#34d399" name="Attended" />
          <Bar dataKey="total" stackId="a" fill="#60a5fa" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default EventBarChart;
