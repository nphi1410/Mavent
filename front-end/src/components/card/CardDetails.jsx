import {
  faCalendar,
  faStar,
  faStarHalf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Tag from "./Tag";
import { useNavigate } from "react-router-dom";

const CardDetails = ({ imageUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${1}`);
  };
  return (
    <div
      onClick={handleClick}
      className="card flex flex-col md:flex-row border border-gray-300 rounded-xl shadow-sm my-4 p-6 hover:shadow-lg active:shadow-xl transition-shadow duration-300 gap-6 bg-white"
    >
      {/* Image */}
      <div className="image md:w-1/4 w-full rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={imageUrl || '/images/fptu-showcase.png'}
          alt="upcoming event"
          className="w-full h-48 md:h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="details flex-1 flex flex-col justify-between">
        <div>
          <h3 className="title text-2xl font-bold mb-3 text-gray-900">
            JS CLUB Codefest 2025
          </h3>

          <div className="flex flex-wrap gap-8 text-gray-600 mb-4 text-sm">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} />
              <span>May 29, 2025</span>
            </span>
            <span className="flex items-center gap-1">
              Rating:
              <FontAwesomeIcon icon={faStar} color="#FBBF24" />{" "}
              <FontAwesomeIcon icon={faStar} color="#FBBF24" />{" "}
              <FontAwesomeIcon icon={faStar} color="#FBBF24" />{" "}
              <FontAwesomeIcon icon={faStarHalf} color="#FBBF24" />
            </span>
          </div>

          <p className="description text-gray-700 text-base leading-relaxed line-clamp-4 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, nisi
            saepe. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quae, nisi saepe. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Quae, nisi saepe. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Quae, nisi saepe.
          </p>
        </div>

        <div className="last-line flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          {/* Tags */}
          <div className="tags flex flex-wrap gap-3">
            <Tag
              dotColor="red"
              bgColor="bg-red-100"
              textcolor="text-red-700"
              topic="Coding"
            />
            <Tag
              dotColor="blue"
              bgColor="bg-blue-100"
              textcolor="text-blue-700"
              topic="Game"
            />
          </div>

          {/* Author */}
          <div className="author flex items-center gap-3">
            <div className="avatar rounded-full border-2 border-gray-300 w-12 h-12 bg-white overflow-hidden flex-shrink-0">
              <img
                src="/avatar.jpg"
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-semibold text-gray-900">JS CLUB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
