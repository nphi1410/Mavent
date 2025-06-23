import React from "react";

const SelectJoiningEvent = ({ list, listName, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="border px-3 py-2 rounded-md"
    >
      <option value="">Select by {listName}</option>
      {list.map((item) => (
        <option key={item.eventId} value={item.eventId}>
          {item.name}
        </option>
      ))}
    </select>
  );
};

export default SelectJoiningEvent;
