import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import SelectStatus from "./SelectStatus";
import Sorting from "./Sorting";
import SelectTags from "./SelectTags";
import Search from "./Search";

const EventFilter = ({ onFilter, totalPagesFromApi }) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOption, setSortOption] = useState(""); // e.g. "START_DATE_ASC"
  const [currentPage, setCurrentPage] = useState(0); // zero-based for backend
  const size = 10;

  // Call onFilter whenever filter/sort/page changes
  useEffect(() => {
    const tagIds = selectedTags.map(tag => (typeof tag === "object" ? tag.id : tag));

    const filters = {
      name: searchTitle || undefined,
      status: statusFilter || undefined,
      tagIds,
      sortType: sortOption || undefined,
      page: currentPage,
      size,
    };

    console.log("Filters:", filters);
    onFilter(filters); // pass query string to onFilter
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
    <div className="sticky top-16 z-10 bg-white border border-gray-300 p-4 m-6 shadow-sm rounded-md">
      <div className="grid grid-cols-4 items-center gap-3 justify-between">
        {/* Search */}
        <Search
          searchTitle={searchTitle}
          setSearchTitle={(value) => {
            setSearchTitle(value);
          }}
          setCurrentPage={setCurrentPage}
        />

        {/* Tags Selection */}
        <SelectTags
          selectedTags={selectedTags}
          onChange={(newTags) => {
            setSelectedTags(newTags);
            setCurrentPage(0);
          }}
        />

        {/* Sorting */}
        <Sorting
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(0);
          }}
          className="col-span-2"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage + 1} // UI 1-based
          totalPages={totalPagesFromApi || 1}
          onPageChange={(page) => goToPage(page - 1)} // convert UI to zero-based
        />

        {/* Status selection */}
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
