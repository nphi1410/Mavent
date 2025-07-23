import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const MeetingAttendeeSelect = ({
  attendees = [],
  existedAttendees = [],
  name = "attendees",
  value = [],
  onChange,
}) => {
  const { control, setValue } = useFormContext();
  const departmentId = useWatch({ control, name: "departmentId" });

  const hasInitialized = useRef(false);
  const prevDepartmentId = useRef(null);

  // ✅ Initialize checked attendees from DB
  useEffect(() => {
    if (hasInitialized.current) return;

    const defaultIds = existedAttendees.map((a) => a.accountId);
    setValue(name, defaultIds);
    hasInitialized.current = true;
  }, [existedAttendees, name, setValue]);

  // ✅ On departmentId change (after init), override checked attendees
  useEffect(() => {
    if (!hasInitialized.current) return;
    if (prevDepartmentId.current === departmentId) return;
    prevDepartmentId.current = departmentId;

    if (!departmentId || departmentId === "") {
      // Check all attendees
      const all = attendees.map((a) => a.accountId);
      onChange(all);
    } else {
      const deptMembers = attendees
        .filter((a) => String(a.departmentId) === String(departmentId))
        .map((a) => a.accountId);
      onChange(deptMembers);
    }
  }, [departmentId, attendees]);

  const toggleCheckbox = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto border border-gray-300 rounded-lg p-2">
      {attendees.map((attendee) => (
        <label
          key={attendee.accountId}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={value.includes(attendee.accountId)}
            onChange={() => toggleCheckbox(attendee.accountId)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>{attendee.fullName || attendee.name || attendee.email}</span>
        </label>
      ))}
    </div>
  );
};

export default MeetingAttendeeSelect;
