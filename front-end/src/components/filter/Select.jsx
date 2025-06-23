import React from "react";

const Select = ({ list, listName, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="border px-3 py-2 rounded-md"
    >
      <option value="">Select by {listName}</option>
      {list.map((item,idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default Select;
