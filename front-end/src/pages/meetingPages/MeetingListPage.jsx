import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getMeetingByAccountId } from "../../services/meetingService";
import { useNavigate } from "react-router-dom";
import MeetingDetailsBoard from "../../components/MeetingDetailsBoard";
import ClockCard from "../../components/visual/CLockCard";
import MeetingFilter from "../../components/filter/MeetingFilter";
import MeetingTable from "../../components/MeetingTable";
import { getJoiningEvent } from "../../services/eventService";

const MeetingListPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountId = useMemo(() => sessionStorage.getItem("accountId"), []);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTitle, setSearchTitle] = useState("");
  const [eventId, setEventId] = useState("");
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(0);
  const [joiningEvents, setJoiningEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const canModifyMeeting =
    selectedEvent?.eventRole === "ADMIN" ||
    selectedEvent?.eventRole === "DEPARTMENT_MANAGER";

  const navigate = useNavigate();

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        page: currentPage,
        size: 10,
        searchTitle: searchTitle || undefined,
        eventId: eventId || undefined,
      };
      const data = await getMeetingByAccountId(accountId, filters);
      setMeetings(data.content);
      setTotalPagesFromApi(data.totalPages);
    } catch (err) {
      console.error("Fetch meetings failed:", err);
    } finally {
      setLoading(false);
    }
  }, [accountId, currentPage, searchTitle, eventId]);

  // Run when any dependency changes
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    if (accountId) {
      getJoiningEvent(accountId).then((events) => {
        setJoiningEvents(events);
      });
    }
  }, [accountId]);

  useEffect(() => {
    if (eventId && joiningEvents.length > 0) {
      const event = joiningEvents.find(
        (e) => e.eventId.toString() === eventId.toString()
      );
      setSelectedEvent(event || null);
    }
  }, [eventId, joiningEvents]);

  useEffect(() => {
    console.log(selectedEvent);
  }, [selectedEvent]);

  // Only used to update state from filter input
  const handleFilter = ({ page, searchTitle }) => {
    if (page !== undefined && page !== currentPage) {
      setCurrentPage(page);
    }
    if (searchTitle !== undefined && searchTitle !== searchTitle) {
      setSearchTitle(searchTitle);
    }
    if (eventId !== undefined && eventId !== eventId) {
      setSearchTitle(searchTitle);
    }
  };

  const handleForm = (id = null) => {
    navigate(`edit?meetingId=${id}&eventId=${eventId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📋 Meetings</h1>
        {canModifyMeeting && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
            onClick={() => handleForm()}
          >
            + Add Meeting
          </button>
        )}
      </div>

      {/* Board Section */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 p-6">
        <div className="w-full lg:w-1/3">
          <ClockCard />
        </div>
        <div className="w-full lg:w-2/3">
          {!loading && meetings.length > 0 && (
            <MeetingDetailsBoard nextMeeting={meetings[0]} />
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div>
        {!loading && (
          <MeetingFilter
            onFilter={handleFilter}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPagesFromApi={totalPagesFromApi}
            searchTitle={searchTitle}
            setSearchTitle={setSearchTitle}
            eventId={eventId}
            setEventId={setEventId}
            joiningEvents={joiningEvents}
          />
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-500 text-center">Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="text-gray-400 text-center italic">
          No meetings found.
        </div>
      ) : (
        <MeetingTable
          meetings={meetings}
          fetchMeetings={fetchMeetings}
          handleForm={handleForm}
          canModifyMeeting={canModifyMeeting}
        />
      )}
    </div>
  );
};

export default MeetingListPage;
