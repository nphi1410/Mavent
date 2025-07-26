import React, { useState } from "react";
import { deleteMeeting } from "../../services/MeetingService";
import { vietnameseDate } from "../../utils/DateConvert";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MeetingDetailsModal from "./MeetingDetailsModal";

const MeetingTable = ({
  meetings,
  fetchMeetings,
  handleForm,
  canModifyMeeting,
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleView = (id) => {
    const meeting = meetings.find((m) => m.meetingId === id);
    setSelectedMeeting(meeting);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      try {
        await deleteMeeting(id);
        fetchMeetings();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };
  return (
    <>
      <table className="min-w-full bg-white text-sm overflow-x-auto rounded-xl shadow ring-1 ring-gray-200">
        <thead className="bg-gray-50 text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 text-center">#</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Event</th>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {meetings.map((meeting, idx) => (
            <tr key={meeting.meetingId} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-center">{idx + 1}</td>
              <td
                onClick={() => handleView(meeting.meetingId)}
                className="px-4 py-3 hover:text-blue-600 font-medium cursor-pointer"
              >
                {meeting.title}
              </td>
              <td className="px-4 py-3">{meeting.status}</td>
              <td className="px-4 py-3">
                {vietnameseDate(meeting.meetingDatetime, true)}
              </td>
              <td className="px-4 py-3">{meeting.eventName}</td>
              <td className="px-4 py-3">
                {meeting.departmentId != null ? meeting.departmentName : "all"}
              </td>
              <td className="px-4 py-3">{meeting.location}</td>
              <td className="px-4 py-3 text-center relative">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-gray-800 transition">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => handleView(meeting.meetingId)}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            View
                          </button>
                        )}
                      </MenuItem>

                      {canModifyMeeting && (
                        <>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleForm(meeting.meetingId)}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Edit
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleDelete(meeting.meetingId)}
                                className={`w-full text-left px-4 py-2 text-sm text-red-600 ${
                                  active ? "bg-gray-100" : ""
                                }`}
                              >
                                Delete
                              </button>
                            )}
                          </MenuItem>
                        </>
                      )}
                    </div>
                  </MenuItems>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <MeetingDetailsModal
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
          />
        </div>
      )}
    </>
  );
};

export default MeetingTable;
