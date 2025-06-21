import React from "react";

const MeetingDetailsModal = ({ meeting, onClose }) => {
  if (!meeting) return null;

  console.log("Meeting details:", meeting);

  return (
    <div className="relative flex w-full max-w-3xl border border-gray-300 rounded-xl overflow-hidden">
      <button
        onClick={onClose}
        className="absolute right-2 text-red-600 hover:text-red-800 text-4xl"
      >
        &times;
      </button>
      {/* Main content */}
      <div className="flex-1 p-6 bg-gradient-to-r from-indigo-50 via-white to-white">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">
          📝 Meeting Details
        </h2>
        <p className="text-lg font-semibold text-gray-800">{meeting.title}</p>
        <p className="text-sm text-gray-500 mb-4">
          Status:{" "}
          <span className="font-medium text-black">{meeting.status}</span>
        </p>

        <div className="text-sm space-y-1">
          <Detail label="Event ID" value={meeting.eventId} />
          <Detail label="Department ID" value={meeting.departmentId} />
          <Detail label="Location" value={meeting.location} />
          <Detail label="Meeting Link" value={meeting.meetingLink} />
          <Detail label="Organizer" value={meeting.organizerAccountId} />
          <Detail
            label="Start Time"
            value={formatDate(meeting.meetingDatetime)}
          />
          <Detail label="End Time" value={formatDate(meeting.endDatetime)} />
          <Detail label="Description" value={meeting.description} />
          <Detail label="Notes" value={meeting.notes} />
          <Detail label="Created At" value={formatDate(meeting.createdAt)} />
          <Detail label="Updated At" value={formatDate(meeting.updatedAt)} />
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, style = "" }) => {
  const isLink = typeof value === "string" && /^https?:\/\/\S+$/i.test(value);

  return (
    <p>
      <span className="font-semibold">{label}:</span>{" "}
      {value ? (
        isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-600 underline hover:text-blue-800 ${style}`}
          >
            {value}
          </a>
        ) : (
          <span className="text-gray-800">{value}</span>
        )
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </p>
  );
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("vi-VN", { hour12: false });
};

export default MeetingDetailsModal;
