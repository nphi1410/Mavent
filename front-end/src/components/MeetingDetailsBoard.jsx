import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

const UpNextMeetingBoard = ({ nextMeeting }) => {

  if (!nextMeeting) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-2xl shadow-md">
        No upcoming meeting.
      </div>
    );
  }

  return (
    <div
      className="h-full p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer"
    >
      <h2 className="text-2xl font-semibold mb-3 text-blue-700">🕒 Up Next</h2>

      <h3 className="text-lg font-bold mb-2">{nextMeeting.title}</h3>

      <div className="flex items-center text-sm text-gray-600 gap-2 mb-1">
        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
        {new Date(nextMeeting.meetingDatetime).toLocaleString("vi-VN")}
      </div>

      <div className="flex items-center text-sm text-gray-600 gap-2 mb-3">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
        {nextMeeting.location || "No location"}
      </div>

      {nextMeeting.meetingLink && (
        <a
          href={nextMeeting.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
        >
          <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
          Join Meeting
        </a>
      )}
    </div>
  );
};

export default UpNextMeetingBoard;
