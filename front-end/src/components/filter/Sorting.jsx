import React from "react";

const Sorting = ({ value, onChange}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className='border px-3 py-2 rounded-md'
    >
      <option value="">Sort</option>
      <option value="START_DATE_DESC">Start date descending</option>
      <option value="START_DATE_ASC">Start date ascending</option>
      <option value="RATING_DESC">Rating descending</option>
      <option value="RATING_ASC">Rating ascending</option>
      <option value="SCALE_DESC">Scale descending</option>
      <option value="SCALE_ASC">Scale ascending</option>
    </select>
  );
};

export default Sorting;
