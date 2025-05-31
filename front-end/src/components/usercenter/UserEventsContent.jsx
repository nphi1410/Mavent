import React, { useState, useEffect } from 'react';
import { getUserEvents } from '../../services/profileService';
import EventCard from './EventCard';

const UserEventsContent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const response = await getUserEvents();
      console.log('API Response:', response); // Debug log for API response
      // Kiểm tra response là array
      if (Array.isArray(response)) {
        setEvents(response);
      } else if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to load events');
      setEvents([]);
      setLoading(false);
    }
  };

  // Debug logs for render cycle
  console.log('Current state:', {
    loading,
    error,
    eventsCount: events?.length,
    currentPage,
    paginatedEvents: events?.slice(
      (currentPage - 1) * eventsPerPage,
      currentPage * eventsPerPage
    )
  });
  
  // Add null check for events array
  const totalPages = Math.ceil((events?.length || 0) / eventsPerPage);
  const paginatedEvents = events?.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  ) || [];

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-red-600 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">😕</div>
        <div>Error: {error}</div>
      </div>
    </div>
  );

  return (
    <main className="flex-grow p-10 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {paginatedEvents.map(event => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default UserEventsContent;