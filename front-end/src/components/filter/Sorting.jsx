import React from "react";

const Sorting = ({ value, onChange}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className='border px-3 py-2 rounded-md'
    >
      <option value="">Sort</option>
      <option value="START_DATE_DESC">Upcoming event</option>
      <option value="START_DATE_ASC">Old event</option>
      <option value="RATING_DESC">Rating from high to low</option>
      <option value="RATING_ASC">Rating from low to high</option>
      <option value="SCALE_DESC">Scale from high to low</option>
      <option value="SCALE_ASC">Scale from low to high</option>
    </select>
  );
};

export default Sorting;
