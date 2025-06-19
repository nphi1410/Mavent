import React, { useState } from "react";
import EventAccountRoleTicket from "./EventAccountRoleTicket";

const EventAccountRoleTable = ({ eventData = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!Array.isArray(eventData) || eventData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 italic">
        No events to display.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3 text-left">Event</th>
              <th className="px-4 py-3 text-left">Start Datetime</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-center">Active</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {eventData.map((event, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer border-t border-gray-100 hover:bg-blue-50 transition"
              >
                <td className="px-4 py-2 text-center">{idx + 1}</td>
                <td className="px-4 py-2">{event.name}</td>
                <td className="px-4 py-2">{new Date(event.startDatetime).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-lg">
                    {event.eventRole}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                    event.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {event.isActive ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(event.roleUpdatedAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-red-600 hover:underline text-sm">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition duration-1000">
          <EventAccountRoleTicket event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      )}
    </>
  );
};

export default EventAccountRoleTable;
