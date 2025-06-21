import React from "react";

const EventAccountRoleTicket = ({ event, onClose }) => {
    const accountId = sessionStorage.getItem("accountId");

  if (!event) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl relative animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
      >
        &times;
      </button>

      {/* Ticket body */}
      <div className="flex border border-gray-300 rounded-xl overflow-hidden">
        {/* Main ticket */}
        <div className="flex-1 p-6 bg-gradient-to-r from-blue-50 via-white to-white">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            🎫 Event Ticket
          </h2>
          <p className="text-lg font-semibold text-gray-800">{event.name}</p>
          <p className="text-sm text-gray-500 mb-4">
            Role: <span className="font-medium text-black">{event.eventRole}</span>
          </p>

          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Start:</span>{" "}
              {new Date(event.startDatetime).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Updated:</span>{" "}
              {new Date(event.roleUpdatedAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Active:</span>{" "}
              {event.isActive ? "Yes ✅" : "No ❌"}
            </p>
          </div>
        </div>

        {/* Stub section (tear line style) */}
        <div className="w-28 bg-gray-100 p-4 flex flex-col items-center justify-between border-l border-dashed border-gray-400">
          <div className="text-center text-xs font-semibold text-gray-700">
            ENTRY PASS
          </div>
          <div className="mt-4 border-t border-dashed border-gray-400 w-full"></div>
          <div className="mt-4 text-xs text-gray-500 tracking-widest">
            #ID {event.eventId + accountId}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAccountRoleTicket;
