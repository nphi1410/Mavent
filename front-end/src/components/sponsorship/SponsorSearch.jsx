import React from "react";

const SponsorSearch = ({ name, setName, industry, setIndustry, setPage }) => {
  const handleNameChange = (e) => {
    setPage(0);
    setName(e.target.value);
  };

  const handleIndustryChange = (e) => {
    setPage(0);
    setIndustry(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Search by name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={industry}
          onChange={handleIndustryChange}
          placeholder="Search by industry"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SponsorSearch;
