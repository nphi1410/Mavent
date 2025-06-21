import React, { useEffect, useState } from "react";
import {
  getAllMeetings,
  deleteMeeting,
} from "../services/meetingService"; // adjust path as needed

const MeetingListPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      try {
        await deleteMeeting(id);
        fetchMeetings(); // refresh
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : meetings.length === 0 ? (
        <div className="text-gray-500">No meetings found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Organizer</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => (
                <tr key={meeting.meetingId} className="border-t">
                  <td className="px-4 py-2">{meeting.title}</td>
                  <td className="px-4 py-2">{meeting.status}</td>
                  <td className="px-4 py-2">
                    {new Date(meeting.meetingDatetime).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{meeting.organizerAccountId}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => alert("TODO: View")}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => alert("TODO: Edit")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(meeting.meetingId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MeetingListPage;
