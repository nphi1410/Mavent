import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getEvents } from '../../services/eventService';
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import SuperAdminActionDropdown from '../../components/superadmin/SuperAdminActionDropdown';
import { useNavigate } from 'react-router-dom';
import { exportEventsToExcel } from '../../services/export/eventExportService';
import { getAllLocations } from '../../services/eventLocationService';
import SuperAdminHeader from '../../components/superadmin/SuperAdminHeader';

function SuperAdminManageEvents() {
    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [locations, setLocations] = useState(new Map());

    const [currentPage, setCurrentPage] = useState(1);
    const [exporting, setExporting] = useState(false);
    const eventsPerPage = 5;

    const statusOptions = [
        "All Statuses", "RECRUITING", "UPCOMING", "ONGOING",
        "ENDED", "CANCELLED", "PENDING", "REVIEWING"
    ];

    const navigate = useNavigate();

    const fetchLocations = async () => {
        try {
            const data = await getAllLocations();
            const locationMap = new Map();
            data.forEach(loc => {
                // Đảm bảo rằng API của bạn trả về `locationId` và `locationName`
                if (loc.locationId && loc.locationName) {
                    locationMap.set(loc.locationId, loc.locationName);
                } else {
                    console.warn("Dữ liệu địa điểm không đúng định dạng:", loc);
                }
            });
            setLocations(locationMap);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách địa điểm:", error);
            // Có thể đặt popup thông báo lỗi cho người dùng ở đây
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            setEvents(data);
        };
        fetchLocations();
        fetchEvents();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset về trang đầu khi search/filter
    }, [searchTerm, statusFilter]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All Statuses" || event.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [events, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportEventsToExcel();
        } catch (error) {
            console.error("Export error:", error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminHeader />
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>
                    <div className="py-10 w-full">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Events</h1>
                        <p className="text-gray-500 mb-6">Manage and view all your events</p>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h2 className="text-2xl font-semibold mb-1 text-black">All Events</h2>
                            <p className="text-sm text-gray-500 mb-4">View and manage all your events from one place</p>

                            {/* Search + Filter */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 sm:w-1/2 placeholder:text-gray-500"
                                />
                                <div className="relative w-full sm:w-48">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="cursor-pointer border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                                    >
                                        {statusFilter}
                                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4 text-black" />
                                    </button>
                                    {dropdownOpen && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                            {statusOptions.map((status) => (
                                                <li
                                                    key={status}
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center"
                                                >
                                                    {statusFilter === status && <span className="mr-2">✓</span>}
                                                    {status}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border border-gray-200">
                                    <thead>
                                        <tr className="text-sm text-gray-500 border-b border-gray-200">
                                            <th className="p-2 font-medium">Event Name</th>
                                            <th className="p-2 font-medium">Start Date</th>
                                            <th className="p-2 font-medium">End Date</th>
                                            <th className="p-2 font-medium">Location</th>
                                            <th className="p-2 font-medium">Status</th>
                                            <th className="p-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedEvents?.map((event) => (
                                            <tr key={event.eventId} className="border-b border-gray-200">
                                                <td className="p-2 font-medium text-black whitespace-nowrap">{event.name}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">{event.startDatetime.slice(0, 10)}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">{event.endDatetime.slice(0, 10)}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">
                                                    {locations.get(event.locationId) || event.location || "Unknown"}
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full
                                                        ${event.status === "RECRUITING" ? "bg-blue-100 text-blue-600"
                                                            : event.status === "UPCOMING" ? "bg-yellow-100 text-yellow-600"
                                                                : event.status === "ONGOING" ? "bg-green-100 text-green-600"
                                                                    : event.status === "CANCELLED" ? "bg-[#ed4a3b] text-[#ebf5fa]"
                                                                        : event.status === "ENDED" ? "bg-red-100 text-red-600"
                                                                            : event.status === "PENDING" ? "bg-purple-100 text-purple-600"
                                                                                : event.status === "REVIEWING" ? "bg-orange-100 text-orange-600"
                                                                                    : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-left">
                                                    <SuperAdminActionDropdown
                                                        isOpen={openId === event.eventId}
                                                        onToggle={() => setOpenId(openId === event.eventId ? null : event.eventId)}
                                                        onView={() => {
                                                            navigate(`/superadmin/event-detail/${event.eventId}`);
                                                            setOpenId(null);
                                                        }}
                                                        onEdit={() => {
                                                            navigate(`/superadmin/edit-event/${event.eventId}`);
                                                            setOpenId(null);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex relative w-full">
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center mt-4 space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`hover:cursor-pointer px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100 text-black'}`}
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`hover:cursor-pointer px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100 text-black'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}

                                {/* Button export to excel */}
                                <div className="ml-auto mt-4">
                                    <button
                                        className={`hover:scale-105 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded text-sm sm:text-base ${exporting ? "opacity-70 cursor-not-allowed" : ""}`}
                                        onClick={handleExport}
                                        disabled={exporting}
                                    >
                                        {exporting ? "Exporting..." : "Export to Excel"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SuperAdminManageEvents;
