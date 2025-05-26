import React from "react";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CardSmall = ({imageUrl}) => {
  return (
    <div className="card flex items-center border border-gray-300 rounded-lg shadow-sm p-4 my-3 gap-4 hover:shadow-md transition-shadow duration-300 bg-white max-w-md">
      <div className="image w-24 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt="upcoming event"
          className="w-full h-24 object-cover"
        />
      </div>
      <div className="details flex flex-col justify-center">
        <span className="title text-lg font-semibold text-gray-900 mb-1">
          JS CLUB Codefest 2025
        </span>
        <span className="text-gray-600 text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendar} />
          May 29, 2025
        </span>
      </div>
    </div>
  );
};

export default CardSmall;
