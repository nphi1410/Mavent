import React from 'react';
import defaultImage from './default.jpg';
import { Link } from 'react-router-dom'; // Thêm Link để chuyển route

const nav = ( eventId, role) => {
  switch (role) {
    case '': return `/event/${eventId}`;
    default: return `/event/${eventId}/staff/details`;
  } 
}

const EventCard = ({ event }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
    {/* Banner Image */}
    <div className="w-full h-48 overflow-hidden bg-gray-100">
      {event.bannerUrl ? (
        <img
          src={event.bannerUrl}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
    </div>

    {/* Event Details */}
    <div className="p-4 space-y-2">
      <div className="text-xs text-blue-600 font-semibold">
        {event.role}
        {event.departmentName && ` - ${event.departmentName}`}
      </div>
      <h3 className="text-lg font-bold line-clamp-1">{event.eventName}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>

      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${event.status === 'ONGOING' ? 'bg-green-100 text-green-800' :
            event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
              event.status === 'ENDED' ? 'bg-gray-300 text-black' :
                'bg-gray-100 text-gray-800'}`}>
          {event.status}
        </span>
        <button
          onClick={() => window.location.href = nav(event.eventId, event.role)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          VIEW DETAIL
        </button>
      </div>

      {/* Chỉ hiển thị nếu là PARTICIPANT và ENDED */}
      {event.role === 'PARTICIPANT' && event.status === 'ENDED' && (
        <div className="mt-2 text-right">
          <Link
            to={`/event/${event.eventId}/staff/create-feedback`}
            className="text-purple-600 hover:underline text-sm"
          >
            Đánh giá sự kiện
          </Link>
        </div>
      )}
    </div>
  </div>
);

export default EventCard;
