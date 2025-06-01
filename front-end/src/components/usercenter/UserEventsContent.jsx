import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserEvents } from '../../services/profileService';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';

const UserEventsContent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  // New state for filters
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    role: ''
  });

  // Add filtered events state
  const [filteredEvents, setFilteredEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchEvents = async () => {
    setError(null); // Xóa lỗi cũ trước khi fetch mới (nếu có)

    try {
      const response = await axios.get('http://localhost:8080/api/user/events', {
        withCredentials: true
      });
      setEvents(response.data);
      setLoading(false); // Quan trọng: Đặt loading thành false khi có dữ liệu
    } catch (error) {
      console.error("Failed to fetch events:", error); // Log lỗi ra console
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        // Đặt thông báo lỗi để hiển thị cho người dùng
        setError(error.message || 'Could not load events. Please try again later.');
      }
      setLoading(false); // Quan trọng: Đặt loading thành false ngay cả khi có lỗi
    }
  };

  fetchEvents();
}, [navigate]); // Dependency array

  // Add filter effect
  useEffect(() => {
    filterEvents();
    setCurrentPage(1);
  }, [events, filters]);

  const filterEvents = () => {
    let result = [...events];

    // Debug log for initial events
    console.log('Initial events:', events);

    // Filter by role using event.role instead of event.userRole
    if (filters.role) {
      console.log('Filtering by role:', filters.role);
      result = result.filter(event => {
        console.log('Event role check:', {
          eventId: event.eventId,
          eventName: event.eventName,
          role: event.role, // Changed from userRole to role
          matchesFilter: event.role === filters.role
        });
        return event.role === filters.role;
      });
      console.log('Events after role filter:', result);
    }

    // Filter by keyword (name)
    if (filters.keyword) {
      result = result.filter(event => 
        event.eventName.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      result = result.filter(event => event.status === filters.status);
    }

    setFilteredEvents(result);
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
  
  // Update pagination calculations to use filteredEvents
  const totalPages = Math.ceil((filteredEvents?.length || 0) / eventsPerPage);
  const paginatedEvents = filteredEvents?.slice(
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
      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left side filters */}
        <div className="flex gap-2">
          {/* Status filter */}
          <div className="relative">
            <select
              className="w-48 px-4 py-2 border rounded-lg appearance-none"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Status</option>
              <option value="RECRUITING">Recruiting</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="ENDED">Ended</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Reviewing</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>

          {/* Role filter */}
          <div className="relative">
            <select
              className="w-48 px-4 py-2 border rounded-lg appearance-none"
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="DEPARTMENT_MANAGER">Department Manager</option>
              <option value="MEMBER">Member</option>
              <option value="PARTICIPANT">Participant</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg className="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right side search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-64 pl-10 pr-4 py-2 border rounded-lg"
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>
      </div>

      {/* Existing grid and pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEvents.map(event => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="py-4 px-6 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#00155c] text-white hover:bg-[#172c70]'
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Page {i + 1}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
              <span className="text-gray-600">
                of {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-[#00155c] text-white hover:bg-[#172c70]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserEventsContent;