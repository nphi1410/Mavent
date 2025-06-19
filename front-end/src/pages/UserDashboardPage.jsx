import React, { useEffect, useState } from "react";
import EventBarChart from "../components/chart/EventBarChart";
import EventAccountRoleTable from "../components/EventAccountRoleTable";

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
      <div className="chart-row flex gap-4 mb-6 h-[400px]">
        <div className="w-1/3">
          <EventBarChart />
        </div>
        <div className="w-2/3">
        </div>
      </div>
      {/*currently attending events */}
      <EventAccountRoleTable eventData={eventData} />
    </div>
  );
};

export default UserDashboardPage;
