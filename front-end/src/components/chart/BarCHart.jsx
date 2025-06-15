import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

const getCurrentMonthDays = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
};

const generateFakeData = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 50) + 5);

const BarChart = () => {
  const labels = getCurrentMonthDays();
  const values = generateFakeData(labels.length);
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Users",
        data: values,
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ✅ allows filling parent height
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        ticks: { color: "#6b7280" },
        grid: { display: false },
        title: { display: true, text: "Day of Month" },
      },
      y: {
        ticks: { color: "#6b7280" },
        grid: { color: "#e5e7eb" },
        title: { display: true, text: "Users" },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white shadow rounded-xl border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        Daily Users in {currentMonth}
      </h2>
      <div className="relative w-full h-[calc(100%-2rem)]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
