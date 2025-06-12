import React, { useState, useCallback } from "react";
import EventFilter from "../components/filter/EventFilter";
import CardMedium from "../components/card/CardMedium";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { getFilterEvents } from "../services/eventService";

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchFilteredEvents = useCallback(async (filters) => {
    const data = await getFilterEvents(filters);
    if (data) {
      setFilteredEvents(data.content || []);
      setTotalPages(data.page?.totalPages || 1);
      setCurrentPage(filters.page || 0);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <EventFilter
        onFilter={fetchFilteredEvents}
        totalPagesFromApi={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 h-full">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.eventId || event.id}
                className="flex flex-col h-full"
              >
                <CardMedium event={event} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No events found.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;
