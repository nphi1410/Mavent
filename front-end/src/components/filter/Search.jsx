import React, { useState, useEffect } from 'react';

const Search = ({ setSearchTitle }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTitle(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search by title"
      value={inputValue}
      onChange={handleChange}
      className="border px-3 py-2 rounded-md col-span-2"
    />
  );
};

export default Search;
