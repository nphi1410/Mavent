import React, { useEffect, useRef } from "react";
import Search from "./Search";
import Pagination from "./Pagination";
import SelectJoiningEvent from "./SelectJoiningEvent";

const MeetingFilter = ({
  onFilter,
  totalPagesFromApi,
  currentPage,
  setCurrentPage,
  searchTitle,
  setSearchTitle,
  eventId,
  setEventId,
  joiningEvents,
}) => {
  const didInitRef = useRef(false);
  const size = 10;
  // Prevent initial effect run
  useEffect(() => {
    didInitRef.current = true;
  }, []);

  // Trigger filter when searchTitle or page changes, but skip first render
  useEffect(() => {
    if (!didInitRef.current) return;

    const filters = {
      searchTitle: searchTitle || undefined,
      eventId: eventId || undefined,
      page: currentPage,
      size,
    };

    onFilter(filters);
  }, [searchTitle, currentPage, eventId]);

  

  const goToPage = (page) => {
    if (page >= 0 && (totalPagesFromApi == null || page < totalPagesFromApi)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="sticky top-16 z-10 bg-white border border-gray-300 p-4 shadow-sm rounded-md mb-4">
      <div className="grid grid-cols-5 items-center gap-3">
        <Search
          searchTitle={searchTitle}
          setSearchTitle={(value) => {
            setSearchTitle(value);
            setCurrentPage(0); // Reset to first page on new search
          }}
        />
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPagesFromApi || 1}
          onPageChange={(page) => goToPage(page - 1)}
        />

        <SelectJoiningEvent
          list={joiningEvents}
          listName="Event"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MeetingFilter;
