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
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) {
      onFilter({
        page: currentPage,
        searchTitle,
        eventId,
      });
    } else {
      didInit.current = true;
    }
  }, [currentPage, searchTitle, eventId]);

  const goToPage = (page) => {
    if (page >= 0 && page < (totalPagesFromApi ?? Infinity)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="sticky top-16 z-10 bg-white border p-4 rounded-md shadow-sm mb-4">
      <div className="grid grid-cols-5 items-center gap-3">
        <Search
          searchTitle={searchTitle}
          setSearchTitle={(value) => {
            setSearchTitle(value);
            setCurrentPage(0);
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
          onChange={(e) => {
            setEventId(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>
    </div>
  );
};

export default MeetingFilter;
