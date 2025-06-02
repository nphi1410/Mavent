import React, { useState, useEffect, useCallback } from "react";
import EventFilter from "../components/filter/EventFilter";
import CardMedium from "../components/card/CardMedium";
import Footer from "./../components/common/Footer";
import Header from "./../components/common/Header";
import { getFilterEvents } from "../services/eventService";

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFilteredEvents = useCallback(
    async (filters) => {
      const data = await getFilterEvents(filters);
      if (data) {
        setFilteredEvents(data.content);
        setTotalPages(data.totalPages);
      }
    },
    [] // no dependencies, so stable reference
  );

  useEffect(() => {
    fetchFilteredEvents({ page: 0});
  }, [fetchFilteredEvents]);

  return (
    <div>
      <Header />
      <EventFilter
        onFilter={fetchFilteredEvents}
        totalPagesFromApi={totalPages}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <CardMedium key={event.eventId || event.id} event={event} />
          ))
        ) : (
          <p className="col-span-full text-center">No events found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
