import React, { useEffect, useState, useCallback } from "react";
import EventBarChart from "../components/chart/EventBarChart";
import EventAccountRoleTable from "../components/EventAccountRoleTable";
import { getAttendingEvent } from "../services/EventService";
import AttendingSummaryBoard from "../components/AttendingSummaryBoard";
import EventRoleFilter from "../components/filter/EventRoleFilter";

const UserDashboardPage = () => {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);

  const accountId = sessionStorage.getItem("accountId");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // fetch event with filters
  const fetchAttendingEvents = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);

    const pageable = {
      page: currentPage,
      size: 10,
      searchTitle: searchTitle || undefined,
      role: selectedRole || undefined,
    };

    try {
      const data = await getAttendingEvent(accountId, pageable);
      if (data) {
        setEventData(data.content);
        setTotalPagesFromApi(data.page.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch attending events", err);
    } finally {
      setLoading(false);
    }
  }, [accountId, currentPage, searchTitle, selectedRole]);

  useEffect(() => {
    fetchAttendingEvents();
  }, [fetchAttendingEvents]);

  return (
    <div className="px-6 py-4">
      <div className="chart-row flex flex-col lg:flex-row gap-4 mb-6 items-stretch justify-center">
        <div className="w-full lg:w-2/5">
          <EventBarChart accountId={accountId} />
        </div>
        <div className="w-full lg:w-3/5">
          <AttendingSummaryBoard accountId={accountId} />
        </div>
      </div>

      {/* Filter section */}
      <div>
        <EventRoleFilter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPagesFromApi={totalPagesFromApi}
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          selectedRole={selectedRole}
          setSelectedRole={(role) => {
            setSelectedRole(role);
            setCurrentPage(0); // reset pagination on role change
          }}
          onFilter={fetchAttendingEvents}
        />
      </div>

      {/* Event table */}
      {loading ? (
        <div className="text-center text-gray-400 italic mt-6">
          Loading events...
        </div>
      ) : (
        <EventAccountRoleTable eventData={eventData} />
      )}
    </div>
  );
};

export default UserDashboardPage;
