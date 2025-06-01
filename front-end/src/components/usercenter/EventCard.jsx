import React from 'react';
import defaultImage from './default.jpg';  // Import default image

const EventCard = ({ event }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    {/* Banner Image with fallback */}
    <div className="w-full h-48 overflow-hidden bg-gray-100">
      {event.bannerUrl ? (
        <img
          src={event.bannerUrl}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = defaultImage; // Use imported default image
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
    </div>

    {/* Event Details */}
    <div className="p-4">
      <div className="mb-2 text-xs text-blue-600 font-semibold">
        {event.role}
        {event.departmentName && ` - ${event.departmentName}`}
      </div>
      <h3 className="text-lg font-bold mb-2 line-clamp-1">{event.eventName}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
            event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'}`}>
          {event.status}
        </span>
        <button
          onClick={() => window.location.href = `/events/${event.eventId}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          VIEW DETAIL
        </button>
      </div>
    </div>
  </div>
);

export default EventCard;