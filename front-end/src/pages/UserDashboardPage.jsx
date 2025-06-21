import React, { useEffect, useState } from "react";
import EventBarChart from "../components/chart/EventBarChart";
import EventAccountRoleTable from "../components/EventAccountRoleTable";
import { getAttendingEvent } from "../services/eventService";
import AttendingSummaryBoard from "../components/AttendingSummaryBoard";

const UserDashboardPage = () => {
  const [eventData, setEventData] = useState([]);
  useEffect(() => {
    const fetchAttendingEvents = async () => {
      const accountId = sessionStorage.getItem("accountId");
      if (!accountId) return;

      const pageable = {
        page: 0,
        size: 10,
      };

      try {
        const data = await getAttendingEvent(accountId, pageable);
        if (data) {
          setEventData(data.content);
        }
      } catch (err) {
        console.error("Failed to fetch attending events", err);
      }
    };

    fetchAttendingEvents();
  }, []);

  return (
    <div className="px-6 py-4">
      <div className="chart-row flex gap-4 mb-6 h-[400px] items-center">
        <div className="w-2/5 h-full">
          <EventBarChart />
        </div>
        <div className="w-3/5 h-full">
          <AttendingSummaryBoard />
        </div>
      </div>
      {/*currently attending events */}
      <EventAccountRoleTable eventData={eventData} />
    </div>
  );
};

export default UserDashboardPage;
