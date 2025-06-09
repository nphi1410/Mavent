import React from 'react';

const Search = ({ searchTitle, setSearchTitle, setCurrentPage }) => {
  const handleChange = (e) => {
    setSearchTitle(e.target.value);
    setCurrentPage(1);
  };

  return (
    <input
      type="text"
      placeholder="Search by title"
      value={searchTitle}
      onChange={handleChange}
      className="border px-3 py-2 rounded-md col-span-2"
    />
  );
};

export default Search;
