import React, { useState, useEffect } from 'react';

const Search = ({ searchTitle, setSearchTitle }) => {
  const [inputValue, setInputValue] = useState(searchTitle || "");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTitle(inputValue);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  return (
    <input
      type="text"
      placeholder="Search by title"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="border px-3 py-2 rounded-md col-span-2"
    />
  );
};

export default Search;

