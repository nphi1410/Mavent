import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getMeetingByAccountId } from "../../services/meetingService";
import { getJoiningEvent } from "../../services/eventService";
import { useNavigate, useSearchParams } from "react-router-dom";
import MeetingFilter from "../../components/filter/MeetingFilter";
import ClockCard from "../../components/visual/CLockCard";
import MeetingDetailsBoard from "../../components/meeting/MeetingDetailsBoard";
import MeetingTable from "../../components/meeting/MeetingTable";

const MeetingListPage = () => {
  const navigate = useNavigate();
  const accountId = useMemo(() => sessionStorage.getItem("accountId"), []);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(0);
  const [joiningEvents, setJoiningEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const didInit = useRef(false);

  // Extract search params
  const pageParam = parseInt(searchParams.get("page") || "0");
  const titleParam = searchParams.get("searchTitle") || "";
  const eventIdParam = searchParams.get("eventId") || "";

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [searchTitle, setSearchTitle] = useState(titleParam);
  const [eventId, setEventId] = useState(eventIdParam);

  // 👇 Sync from URL only once on load
  useEffect(() => {
    if (!didInit.current) {
      setCurrentPage(pageParam);
      setSearchTitle(titleParam);
      setEventId(eventIdParam);
      didInit.current = true;
    }
  }, [pageParam, titleParam, eventIdParam]);

  // 👇 Fetch meetings
  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        page: currentPage,
        size: 10,
        searchTitle:
          !searchTitle || searchTitle === "undefined" ? undefined : searchTitle,
        eventId: !eventId || eventId === "undefined" ? undefined : eventId,
      };
      const data = await getMeetingByAccountId(accountId, filters);
      setMeetings(data.content);
      setTotalPagesFromApi(data.page.totalPages);
    } catch (error) {
      console.error("Fetch meetings failed:", error);
    } finally {
      setLoading(false);
    }
  }, [accountId, currentPage, searchTitle, eventId]);

  useEffect(() => {
    if (didInit.current) fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    if (accountId) {
      getJoiningEvent(accountId).then(setJoiningEvents);
    }
  }, [accountId]);

  useEffect(() => {
    if (eventId && joiningEvents.length > 0) {
      const matched = joiningEvents.find(
        (e) => String(e.eventId) === String(eventId)
      );
      setSelectedEvent(matched || null);
    }
  }, [eventId, joiningEvents]);

  const canModifyMeeting =
    selectedEvent?.eventRole === "ADMIN" ||
    selectedEvent?.eventRole === "DEPARTMENT_MANAGER";

  const handleFilter = ({
    page,
    searchTitle: newTitle,
    eventId: newEventId1,
  }) => {
    const newPage = page ?? currentPage;
    const newSearchTitle = newTitle ?? searchTitle;
    const newEventId = newEventId1 ?? eventId;

    if (
      newPage === currentPage &&
      newSearchTitle === searchTitle &&
      newEventId === eventId
    )
      return;

    setSearchParams({
      page: newPage.toString(),
      searchTitle: newSearchTitle,
      eventId: newEventId,
    });

    setCurrentPage(newPage);
    setSearchTitle(newSearchTitle);
    setEventId(newEventId);
  };

  const handleForm = (id = null) => {
    navigate(`edit?meetingId=${id}&eventId=${eventId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📋 Meetings</h1>
        {canModifyMeeting && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={() => handleForm()}
          >
            + Add Meeting
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="w-full lg:w-1/3">
          <ClockCard />
        </div>
        <div className="w-full lg:w-2/3">
          {!loading && meetings.length > 0 && (
            <MeetingDetailsBoard nextMeeting={meetings[0]} />
          )}
        </div>
      </div>

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

      {loading ? (
        <div className="text-center text-gray-500">Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center text-gray-400 italic">
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
