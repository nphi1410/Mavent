import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFilterEvents } from "../../services/eventService";

const Gallery = () => {
  const navigate = useNavigate();

  const [trendingOnGoingEvents, setTrendingOnGoingEvents] = useState([]);
  
    useEffect(() => {
      async function fetchTrendingOngoing() {
        const data = await getFilterEvents({
          page: 0,
          size: 5,
          isTrending: true,
          type: "ongoing",
          sortType: "END_DATE_ASC",
        });
        if (data) {
          setTrendingOnGoingEvents(data.content || []);
        }
      }
  
      fetchTrendingOngoing();
    }, []);

  const handleClick = () => {
    navigate("/events");
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-100 py-16 px-6 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12 border-b-4 border-green-500 pb-3">
        Gallery
      </h1>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {trendingOnGoingEvents.map((event, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={event.bannerUrl}
              alt={`Event ${index + 1}`}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="mt-12">
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300"
        >
          Explore More
        </button>
      </div>
    </div>
  );
};

export default Gallery;
