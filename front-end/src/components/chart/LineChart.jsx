import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const LineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Users",
        data: [50, 70, 60, 90, 120],
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointHoverRadius: 6,
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for filling container
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151", // gray-700
          font: {
            size: 13,
            family: "Inter, sans-serif",
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "#111827", // gray-900
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280", // gray-500
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
        },
        grid: {
          color: "#e5e7eb", // gray-200
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white border border-gray-200 shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
        Monthly Registered Users
      </h2>
      <div className="relative w-full h-[calc(100%-2rem)]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
