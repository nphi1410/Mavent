import React, { useEffect, useState } from "react";
import { getAllMeetings, deleteMeeting } from "../../services/meetingService";
import { useNavigate } from "react-router-dom";
import MeetingDetailsModal from "../../components/MeetingDetailsModal";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import MeetingDetailsBoard from "../../components/MeetingDetailsBoard";
import ClockCard from "../../components/visual/CLockCard";

const MeetingListPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const navigate = useNavigate();

  const fetchMeetings = async () => {
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to fetch meetings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    const meeting = meetings.find((m) => m.meetingId === id);
    setSelectedMeeting(meeting);
  };

  const handleForm = (id = null) => {
    navigate(`edit/${id !== null ? id : "-1"}`);
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

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">📋 Meetings</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
          onClick={() => handleForm()}
        >
          + Add Meeting
        </button>
      </div>

      <div className="h-[300px] flex flex-col lg:flex-row items-center justify-center gap-6 p-6">
        <div className="w-full lg:w-1/3 h-full">
          <ClockCard />
        </div>

        <div className="w-full lg:w-2/3 h-full">
          {!loading && meetings.length > 0 && (
            <MeetingDetailsBoard nextMeeting={meetings[0]} />
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center">Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="text-gray-400 text-center italic">
          No meetings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Organizer</th>
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
                    {new Date(meeting.meetingDatetime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{meeting.organizerAccountId}</td>
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
                        </div>
                      </MenuItems>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <MeetingDetailsModal
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MeetingListPage;
