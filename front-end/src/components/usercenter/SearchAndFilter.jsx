import React from 'react';

const SearchAndFilter = ({ filters, setFilters, searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <select
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        className="px-4 py-2 border rounded-md"
      >
        <option>All Roles</option>
        <option>MEMBER</option>
        <option>LEADER</option>
        <option>MANAGER</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="px-4 py-2 border rounded-md"
      >
        <option>All Events</option>
        <option>UPCOMING</option>
        <option>ONGOING</option>
        <option>FINISHED</option>
      </select>

      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 border rounded-md flex-grow"
      />
    </div>
  );
};

export default SearchAndFilter;