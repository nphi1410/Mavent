import React, { useEffect, useState } from "react";
import SelectStatus from "./SelectStatus";
import Sorting from "./Sorting";
import SelectTags from "./SelectTags";
import Search from "./Search";
import Pagination from "./Pagination";

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
  const size = 10;

  useEffect(() => {
    const tagIds = selectedTags.map((tag) => tag.tagId);
    const filters = {
      name: searchTitle || undefined,
      status: statusFilter || undefined,
      tagIds: tagIds,
      sortType: sortOption || undefined,
      page: currentPage,
      size,
    };

    console.log("Filters:", filters);
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
        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage + 1} // display as 1-based
          totalPages={totalPagesFromApi || 0}
          onPageChange={(page) => goToPage(page - 1)} // convert to 0-based
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
