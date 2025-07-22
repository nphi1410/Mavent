import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const MeetingDetailsModal = ({ meeting, onClose }) => {
  if (!meeting) return null;

  return (
    <div className="relative flex w-full max-w-4xl bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-red-600 hover:text-red-800 text-2xl z-10"
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[80vh] bg-gradient-to-r from-indigo-50 via-white to-white">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">
          📝 Meeting Details
        </h2>
        <p className="text-lg font-semibold text-gray-800">{meeting.title}</p>
        <p className="text-sm text-gray-500 mb-4">
          Status:{" "}
          <span className="font-medium text-black">{meeting.status}</span>
        </p>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Event" value={meeting.eventName} />
          <Detail label="Department" value={meeting.departmentName} />
          <Detail
            label="Organizer"
            value={meeting.organizerName || meeting.organizerAccountId}
          />
          <Detail label="Location" value={meeting.location} />
          <Detail label="Meeting Link" value={meeting.meetingLink} />
          <Detail
            label="Start Time"
            value={formatDate(meeting.meetingDatetime)}
          />
          <Detail label="End Time" value={formatDate(meeting.endDatetime)} />
          <Detail label="Created At" value={formatDate(meeting.createdAt)} />
          <Detail label="Updated At" value={formatDate(meeting.updatedAt)} />
        </div>

        {/* Description & Notes full width */}
        <div className="mt-4 space-y-2">
          <Detail
            label="Description"
            value={meeting.description}
            style="whitespace-pre-wrap"
          />
          <Detail
            label="Notes"
            value={meeting.notes}
            style="whitespace-pre-wrap"
          />
        </div>
      </div>
    </div>
  );
};

// Detail renderer
const Detail = ({ label, value, style = "" }) => {
  const isLink = typeof value === "string" && /^https?:\/\/\S+$/i.test(value);

  return (
    <p className=" text-gray-700">
      <span className="font-semibold">{label}:</span>{" "}
      {value ? (
        isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-blue-600 underline hover:text-blue-800 break-words ${style}`}
          >
            {value}
          </a>
        ) : (
          <span className={`text-gray-800 break-words ${style}`}>{value}</span>
        )
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </p>
  );
};

// Date formatter
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("vi-VN", { hour12: false });
};

export default MeetingDetailsModal;
