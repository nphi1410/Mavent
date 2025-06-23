import React, { useEffect, useRef, useState } from "react";
import Search from "./Search";
import Pagination from "./Pagination";
import SelectJoiningEvent from "./SelectJoiningEvent";
import { useSearchParams } from "react-router-dom";

const MeetingFilter = ({ onFilter, totalPagesFromApi }) => {
  const [searchParams] = useSearchParams();
  const [searchTitle, setSearchTitle] = useState("");
  const [eventId, setEventId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const didInitRef = useRef(false);
  const size = 10;

  // First-load sync from URL
  useEffect(() => {
    if (didInitRef.current) return;

    const titleParam = searchParams.get("searchTitle");
    const pageParam = searchParams.get("page");
    const eventIdParam = searchParams.get("eventId");

    if (titleParam) setSearchTitle(titleParam);
    if (pageParam) setCurrentPage(parseInt(pageParam));
    if (eventIdParam) setEventId(eventIdParam);

    didInitRef.current = true;
  }, [searchParams]);

  // Trigger filter when inputs change
  useEffect(() => {
    if (!didInitRef.current) return;

    const filters = {
      searchTitle: searchTitle || undefined,
      eventId: eventId || undefined,
      page: currentPage,
      size,
    };

    onFilter(filters);
  }, [searchTitle, eventId, currentPage]);

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
            setCurrentPage(0); // Reset page on new search
          }}
        />
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPagesFromApi || 1}
          onPageChange={(page) => goToPage(page - 1)}
        />
        <SelectJoiningEvent
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
