import React, { useEffect, useState } from "react";
import {
  countAttendanceByAccountId,
  getEventRolesByAccount,
} from "../services/eventService";

const AttendingSummaryBoard = ({ accountId }) => {
  const [summary, setSummary] = useState({
    total: 0,
    totalParticipant: 0,
    thisMonth: 0,
    thisMonthParticipant: 0,
    avgPerMonth: 0,
    lastRegistered: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          total,
          totalParticipant,
          thisMonth,
          thisMonthParticipant,
          lastPage,
        ] = await Promise.all([
          countAttendanceByAccountId(accountId, null, false),
          countAttendanceByAccountId(accountId, "PARTICIPANT", false),
          countAttendanceByAccountId(accountId, null, true),
          countAttendanceByAccountId(accountId, "PARTICIPANT", true),
          getEventRolesByAccount(accountId, 0, 1, "createdAt,desc"),
        ]);

        const latestEvent = lastPage?.content?.[0]?.createdAt;

        setSummary({
          total,
          totalParticipant,
          thisMonth,
          thisMonthParticipant,
          avgPerMonth: Math.round(total / 6), // assuming 6 months avg
          lastRegistered: latestEvent || null,
        });
      } catch (err) {
        console.error("Error loading summary:", err);
      }
    };

    if (accountId) fetchData();
  }, [accountId]);

  const items = [
    { name: "Total Attended", value: summary.total },
    { name: "Total Attended as Participant", value: summary.totalParticipant },
    { name: "This Month Attended", value: summary.thisMonth },
    { name: "This Month as Participant", value: summary.thisMonthParticipant },
    { name: "Average Attended / Month", value: summary.avgPerMonth },
    { name: "Last Registered", value: summary.lastRegistered },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🎯 Attendance Summary
        </h2>
        <p className="text-sm text-gray-500">
          Overview of your event participation
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-1">{item.name}</p>
            <p className="text-3xl font-semibold text-indigo-600">
              {typeof item.value === "number"
                ? item.value
                : item.value
                ? new Date(item.value).toLocaleDateString("vi-VN", {
                    dateStyle: "medium",
                  })
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendingSummaryBoard;
