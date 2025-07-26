import React, { useEffect, useState } from "react";
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
import { getAttendingSummary, getSummary } from "../../services/EventService";

// Get last 6 months as 'YYYY-MM'
const getLastSixMonths = () => {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toISOString().slice(0, 7); // 'YYYY-MM'
    result.push(month);
  }
  return result;
};

const formatMonth = (yearMonth) =>
  new Date(yearMonth + "-01").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

const EventBarChart = ({ accountId }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const [attended, total] = await Promise.all([
          getAttendingSummary(accountId, "PARTICIPANT"),
          getSummary("CANCELLED"),
        ]);

        const lastSix = getLastSixMonths();

        const attendedMap = {};
        attended.forEach((item) => {
          attendedMap[item.yearMonth] = item.totalEvent;
        });

        const totalMap = {};
        total.forEach((item) => {
          totalMap[item.yearMonth] = item.totalEvent;
        });

        const finalData = lastSix.map((month) => {
          const totalCount = totalMap[month] || 0;
          const attendedCount = attendedMap[month] || 0;
          const missedCount = Math.max(totalCount - attendedCount, 0);
          return {
            month: formatMonth(month),
            attended: attendedCount,
            missed: missedCount,
          };
        });

        setChartData(finalData);
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [accountId]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📊 Monthly Attendance
        </h2>
        <p className="text-sm text-gray-500">
          Track your participation vs total events (last 6 months)
        </p>
      </div>

      <div className="h-72">
        {loading ? (
          <div className="text-gray-400 text-center py-10">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="attended"
                stackId="a"
                fill="#34d399"
                name="Attended"
              />
              <Bar dataKey="missed" stackId="a" fill="#fca5a5" name="Missed" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EventBarChart;
