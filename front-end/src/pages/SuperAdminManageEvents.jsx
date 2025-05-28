import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getEvents } from '../services/eventService';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminHeader from '../components/SuperAdminHeader';
import SuperAdminActionDropdown from '../components/SuperAdminActionDropdown';

function SuperAdminManageEvents() {


    const [openId, setOpenId] = useState(null);
    const statusOptions = ["All Statuses", "Upcoming", "Completed", "Cancelled"];

    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <SuperAdminHeader />
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>

                    <div className="py-10 w-full">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Events</h1>
                        <p className="text-gray-500 mb-6">Manage and view all your events</p>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h2 className="text-lg font-semibold mb-1 text-black">All Events</h2>
                            <p className="text-sm text-gray-500 mb-4">View and manage all your events from one place</p>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 sm:w-1/2 placeholder:text-gray-500"
                                />

                                <div className="relative w-full sm:w-48 border border-gray-300 rounded">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
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

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border border-gray-200">
                                    <thead>
                                        <tr className="text-sm text-gray-500 border-b border-gray-200">
                                            <th className="p-2 font-medium ">Event Name</th>
                                            <th className="p-2 font-medium">Start Date</th>
                                            <th className="p-2 font-medium">End Date</th>
                                            <th className="p-2 font-medium">Location</th>
                                            <th className="p-2 font-medium">Status</th>
                                            <th className="p-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event) => (
                                            <tr key={event.eventId} className="border-b border-gray-200">
                                                <td className="p-2 font-medium text-black whitespace-nowrap">{event.name}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">{event.startDatetime.slice(0, 10)}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">{event.endDatetime.slice(0, 10)}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">{event.location}</td>
                                                <td className="p-2 whitespace-nowrap text-gray-600">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full
                                                        ${event.status === "RECRUITING"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : event.status === "UPCOMING"
                                                                ? "bg-yellow-100 text-yellow-600"
                                                                : event.status === "ONGOING"
                                                                    ? "bg-green-100 text-green-600"
                                                                    : event.status === "CANCELLED"
                                                                        ? "bg-[#ed4a3b] text-[#ebf5fa]"
                                                                        : event.status === "ENDED"
                                                                            ? "bg-red-100 text-red-600"
                                                                            : event.status === "PENDING"
                                                                                ? "bg-purple-100 text-purple-600"
                                                                                : event.status === "REVIEWING"
                                                                                    ? "bg-orange-100 text-orange-600"
                                                                                    : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="p-2 whitespace-nowrap text-right flex justify-start items-center">
                                                    <SuperAdminActionDropdown
                                                        isOpen={openId === event.eventId}
                                                        onToggle={() => setOpenId(openId === event.eventId ? null : event.eventId)}
                                                        onView={() => {
                                                            alert(`Viewing ${event.name}`);
                                                            setOpenId(null);
                                                        }}
                                                        onEdit={() => {
                                                            alert(`Editing ${event.name}`);
                                                            setOpenId(null);
                                                        }}
                                                        onDelete={() => {
                                                            alert(`Deleting ${event.name}`);
                                                            setOpenId(null);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default SuperAdminManageEvents;
