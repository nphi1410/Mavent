import React from "react";

const AttendingSummaryBoard = () => {
  const fakeData = [
    { name: "Total Attended", value: 25 },
    { name: "Total Attended as Participant", value: 20 },
    { name: "This Month Attended", value: 8 },
    { name: "This Month as Participant", value: 12 },
    { name: "Average Attended / Month", value: 4 },
    { name: "Last Registered", value: "2025-06-01" },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎯 Attendance Summary</h2>
        <p className="text-sm text-gray-500">Overview of your event participation</p>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {fakeData.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-1">{item.name}</p>
            <p className="text-3xl font-semibold text-indigo-600">
              {typeof item.value === "number"
                ? item.value
                : new Date(item.value).toLocaleDateString("vi-VN", { dateStyle: "medium" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendingSummaryBoard;
