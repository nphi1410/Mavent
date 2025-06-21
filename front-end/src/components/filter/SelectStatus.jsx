import React from 'react';

const SelectStatus = ({ value, onChange}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className='border px-3 py-2 rounded-md'
    >
      <option value="">Select by Status</option>
      <option value="RECRUITING">RECRUITING</option>
      <option value="UPCOMING">UPCOMING</option>
      <option value="ONGOING">ONGOING</option>
      <option value="ENDED">ENDED</option>
      <option value="CANCELLED">CANCELLED</option>
      <option value="PENDING">PENDING</option>
      <option value="REVIEWING">REVIEWING</option>
    </select>
  );
};

export default SelectStatus;
