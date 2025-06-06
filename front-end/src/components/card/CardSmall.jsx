import React from "react";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { separateDayMonthYear } from "../../utils/SeparateDayMonthYear";

const CardSmall = ({event }) => {
  const navigate = useNavigate();
  const [day, month, year] = separateDayMonthYear(
    new Date(event.endDatetime)
  );
  const handleClick = () => {
    navigate(`/events/${event.eventId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card flex items-center border border-gray-300 rounded-lg shadow-sm p-4 my-3 gap-4 hover:shadow-md active:shadow-lg transition-shadow duration-300 bg-white max-w-md"
    >
      <div className="image w-24 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={event.posterUrl}
          alt={event.name}
          className="w-full h-24 object-cover"
        />
      </div>
      <div className="details flex flex-col justify-center">
        <span className="title text-lg font-semibold text-gray-900 mb-1">
          {event.name}
        </span>
        <span className="text-gray-600 text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendar} />
          End Date: {month} {day}, {year}
        </span>
      </div>
    </div>
  );
};

export default CardSmall;
