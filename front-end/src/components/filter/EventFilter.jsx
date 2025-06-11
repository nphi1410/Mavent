import React, { useEffect, useState } from "react";
import SelectStatus from "./SelectStatus";
import Sorting from "./Sorting";
import SelectTags from "./SelectTags";
import Search from "./Search";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";

const EventFilter = ({
  onFilter,
  totalPagesFromApi,
  currentPage,
  setCurrentPage,
}) => {
  const [searchParams] = useSearchParams();
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const size = 10;

  // Load initial tagIds and filter state from URL
  useEffect(() => {
    const paramTagIds = searchParams.getAll("tagIds").map(Number);
    if (paramTagIds.length > 0) {
      setSelectedTags(paramTagIds.map((id) => ({ tagId: id })));
    }

    const type = searchParams.get("type") || "";
    const isTrending = searchParams.get("isTrending") === "true";

    const filters = {
      name: searchTitle || undefined,
      status: statusFilter || undefined,
      tagIds: paramTagIds,
      sortType: sortOption || undefined,
      page: currentPage,
      type,
      isTrending,
      size,
    };

    onFilter(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const tagIds = selectedTags.map((tag) => tag.tagId);
    const type = searchParams.get("type") || "";
    const isTrending = searchParams.get("isTrending") === "true";

    const filters = {
      name: searchTitle || undefined,
      status: statusFilter || undefined,
      tagIds,
      sortType: sortOption || undefined,
      page: currentPage,
      type,
      isTrending,
      size,
    };

    onFilter(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle, statusFilter, selectedTags, sortOption, currentPage]);

  const goToPage = (page) => {
    if (page >= 0 && (!totalPagesFromApi || page < totalPagesFromApi)) {
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
