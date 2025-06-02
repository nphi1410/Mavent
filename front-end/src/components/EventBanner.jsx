import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EventBanner = ({ bannerUrl,eventData}) => {
  return (
    <div className="relative w-full">
      <img
        src={bannerUrl}
        alt="codefest banner"
        className="w-full h-64 sm:h-128 md:h-[500px] lg:h-[650px] object-cover"
      />

      {/* dark overlay with gradient */}
      <div className="absolute inset-0 bg-black/50 bg-[linear-gradient(to_bottom,transparent_80%,white_100%)] flex flex-col md:flex-row items-center justify-between gap-8 px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-12">
        {/* Event Info (left) */}
        <div className="text-white max-w-xl p-4 sm:p-6 rounded-lg text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{eventData.name}</h1>
          <span className="block text-base sm:text-lg font-semibold mb-2">By JSCLUB</span>
          <p className="text-sm sm:text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Form Card (right) */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-sm w-full text-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Date & Time</h3>
          <p className="text-sm mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} />
            {eventData.startDatetime}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded text-sm sm:text-base">
              Participate Now
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-semibold py-2 px-4 rounded text-sm sm:text-base">
              Become a Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
