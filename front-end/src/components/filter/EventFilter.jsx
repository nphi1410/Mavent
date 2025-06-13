import React, { useEffect, useState, useRef } from "react";
import SelectStatus from "./SelectStatus";
import Sorting from "./Sorting";
import SelectTags from "./SelectTags";
import Search from "./Search";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";
import { getTags } from "../../services/tagService";

const EventFilter = ({
  onFilter,
  totalPagesFromApi,
  currentPage,
  setCurrentPage,
}) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [tags, setTags] = useState([]);
  const [searchParams] = useSearchParams();
  const size = 10;

  const didInitRef = useRef(false); // <-- 👈 track if first load has been done

  // Fetch tags once
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getTags({ eventId: null });
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Load filters from URL on first load after tags are fetched
  useEffect(() => {
    if (tags.length === 0 || didInitRef.current) return;

    const tagFromUrl = searchParams.get("tagId");
    const type = searchParams.get("type");

    const matchingTag = tags.find((t) => String(t.tagId) === String(tagFromUrl));
    if (matchingTag) {
      setSelectedTags([matchingTag]);
    }

    const filters = {
      type: type || undefined,
      tagIds: matchingTag ? [matchingTag.tagId || matchingTag.id] : [],
      isTrending: true,
      page: currentPage ?? 0,
      size,
    };

    onFilter(filters);
    didInitRef.current = true; // mark as initialized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  // Handle filter updates by user interaction
  useEffect(() => {
    if (!didInitRef.current) return; // skip first auto call

    const tagIds = selectedTags.map((tag) => tag.tagId || tag);
    const filters = {
      name: searchTitle || undefined,
      status: statusFilter || undefined,
      tagIds,
      sortType: sortOption || undefined,
      page: currentPage,
      size,
    };

    onFilter(filters);
  }, [
    searchTitle,
    statusFilter,
    selectedTags,
    sortOption,
    currentPage,
    onFilter,
  ]);

  const goToPage = (page) => {
    if (page >= 0 && (totalPagesFromApi == null || page < totalPagesFromApi)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="sticky top-16 z-10 bg-white border border-gray-300 p-4 shadow-sm rounded-md mb-4">
      <div className="grid grid-cols-4 items-center gap-3">
        <Search
          searchTitle={searchTitle}
          setSearchTitle={(value) => {
            setSearchTitle(value);
            setCurrentPage(0);
          }}
        />
        <SelectTags
          tags={tags}
          selectedTags={selectedTags}
          onChange={(newTags) => {
            setSelectedTags(newTags);
            setCurrentPage(0);
          }}
        />
        <Sorting
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(0);
          }}
          className="col-span-2"
        />
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPagesFromApi || 0}
          onPageChange={(page) => goToPage(page - 1)}
        />
        <SelectStatus
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>
    </div>
  );
};

export default EventFilter;
