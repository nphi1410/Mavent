import { faCalendar, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Tag from "./Tag";
import { useNavigate } from "react-router-dom";
import { separateDayMonthYear } from "../../utils/DateConvert";
import { getTags } from "../../services/tagService";

const CardDetails = ({ event }) => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [day, month, year] = separateDayMonthYear(
    new Date(event.startDatetime)
  );

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getTags({ eventId: event.eventId });
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [event.eventId]);

  const handleClick = () => {
    navigate(`/events/${event.eventId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer flex flex-col md:flex-row border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-white p-4 md:p-6 mb-6 gap-6"
    >
      {/* Image */}
      <div className="md:w-1/4 w-full aspect-square rounded-lg overflow-hidden">
        <img
          src={event.posterUrl}
          alt={event.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            {event.name}
          </h3>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} />
              <span>
                Start: {month} {day}, {year}
              </span>
            </span>

            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
              <span className="text-gray-700 font-medium">
                {event.avgRating ?? "No rated"}
              </span>
            </span>
          </div>

          <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-4 text-justify">
            {event.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag.tagId} topic={tag.name} />
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            {event.createdByAvatar && (
              <img
                src={event.createdByAvatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm font-semibold text-gray-800">
              {event.createdByName ?? "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
