import React, { useEffect, useState } from "react";
import CardSmall from "./card/CardSmall";
import CardDetails from "./card/CardDetails";
import { getFilterEvents } from "../services/eventService";

const Content = ({ imageUrl }) => {
  const [trendingUpcomingEvents, setTrendingUpcomingEvents] = useState([]);
  const [trendingRecentlyEvents, setTrendingRecentlyEvents] = useState([]);

  useEffect(() => {
    async function fetchTrendingUpcoming() {
      const data = await getFilterEvents({
        page: 0,
        size: 5,
        isTrending: true,
        type: "upcoming",
        sortType: "START_DATE_ASC",
      });
      if (data) {
        setTrendingUpcomingEvents(data.content || []);
      }
    }

    async function fetchTrendingRecently() {
      const data = await getFilterEvents({
        page: 0,
        size: 5,
        isTrending: true,
        type: "recently",
        sortType: "END_DATE_DESC",
      });
      if (data) {
        setTrendingRecentlyEvents(data.content || []);
      }
    }

    fetchTrendingUpcoming();
    fetchTrendingRecently();
  }, []);
  return (
    <div className="flex flex-col md:flex-row mx-4 gap-8 my-6">
      {/* Left Column */}
      <div className="md:w-1/3 flex flex-col items-start px-4">
        <h2 className="text-4xl font-extrabold mb-6 border-b-4 border-amber-400 pb-2">
          Recently Events
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {trendingRecentlyEvents.map((event) => (
            <CardSmall
              key={event.eventId}
              event={event}
              imageUrl={imageUrl}
            />
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="md:flex-1 flex flex-col items-start px-4">
        <h2 className="text-4xl font-extrabold mb-6 border-b-4 border-indigo-500 pb-2">
          Upcoming Events
        </h2>
        <div className="flex flex-col gap-6 w-full">
          {trendingUpcomingEvents.map((event) => (
            <CardDetails
              key={event.eventId}
              event={event}
              imageUrl={imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
