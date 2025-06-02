import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

const CardRelevant = ({ event }) => {
  const navigate = useNavigate();

  const date = new Date(event.startDatetime);
  const day = date.getDate(); // returns 1–31
  const month = date.toLocaleString("default", { month: "short" }); // e.g., "Sep"
  const year = date.getFullYear();

  const handleClick = () => {
    navigate(`/events/${event.eventId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
    >
      {/* Image with gradient overlay */}
      <div className="relative h-36">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient fading to white at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-semibold text-yellow-500 flex items-center gap-1 shadow">
          <FontAwesomeIcon icon={faStar} />
          {event.avgRating}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1 items-center bg-blue-100 text-blue-800 font-semibold text-sm px-2 py-1 rounded">
            <span>{year} - { month}</span>
            <span className="font-bold">{day}</span>
          </div>
          <h3 className="text-md font-bold truncate">{event.name}</h3>
        </div>
        <p className="text-sm text-gray-600 text-justify line-clamp-3">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default CardRelevant;
