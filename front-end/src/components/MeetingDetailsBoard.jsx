import {
  faCalendarAlt,
  faClock,
  faClipboard,
  faMapMarkerAlt,
  faLink,
  faUserTie,
  faBuilding,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UpNextMeetingBoard = ({ nextMeeting }) => {
  if (!nextMeeting) {
    return (
      <div className="w-full h-full p-6 text-center text-gray-500 bg-white rounded-2xl shadow-md flex items-center justify-center">
        No upcoming meeting.
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} />
          Up Next Meeting
        </h2>
        {nextMeeting.meetingLink && (
          <a
            href={nextMeeting.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faLink} className="w-4 h-4" />
            Join Meeting
          </a>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
        {nextMeeting.title}
      </h3>

      {/* Grid Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <DetailRow icon={faList} label="Event" value={nextMeeting.eventName} />
        <DetailRow icon={faBuilding} label="Department" value={nextMeeting.departmentName} />
        <DetailRow icon={faUserTie} label="Organizer" value={nextMeeting.organizerName} />
        <DetailRow icon={faClock} label="Status" value={nextMeeting.status} />
        <DetailRow icon={faCalendarAlt} label="Start Time" value={formatDate(nextMeeting.meetingDatetime)} />
        <DetailRow icon={faCalendarAlt} label="End Time" value={formatDate(nextMeeting.endDatetime)} />
        <DetailRow icon={faMapMarkerAlt} label="Location" value={nextMeeting.location || "No location"} />
        <DetailRow icon={faClipboard} label="Notes" value={nextMeeting.notes} />
        <DetailRow icon={faClipboard} label="Description" value={nextMeeting.description} />
        <DetailRow icon={faCalendarAlt} label="Created At" value={formatDate(nextMeeting.createdAt)} />
        <DetailRow icon={faCalendarAlt} label="Updated At" value={formatDate(nextMeeting.updatedAt)} />
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <FontAwesomeIcon icon={icon} className="text-indigo-500 w-4 h-4 mt-1 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">{label}</p>
      <p className="text-gray-800 font-medium break-words">{value || "-"}</p>
    </div>
  </div>
);

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  });
};

export default UpNextMeetingBoard;
