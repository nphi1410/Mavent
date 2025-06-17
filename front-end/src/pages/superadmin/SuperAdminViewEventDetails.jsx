import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import SuperAdminSidebar from "../../components/superadmin/SuperAdminSidebar";
import { getEventById } from "../../services/eventService";

function SuperAdminViewEventDetails() {
    const { eventId } = useParams(); //lấy eventId từ URL
    const [activeTab, setActiveTab] = useState("agenda");
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            const data = await getEventById(eventId); //gọi API theo ID
            setEvent(data);
        };
        fetchEvent();
    }, [eventId]);

    if (!event) return <div className="p-10">Loading...</div>; //loading state

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>
                    <div className="py-10 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-4xl text-gray-800 font-bold mb-1">
                                    {event.name}
                                    <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full
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
                                        }`}>
                                        {event.status}
                                    </span>
                                </h1>
                                <p className="text-gray-500">Event ID: {event.eventId}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-4">Event Details</h2>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Date:</strong><br />
                                            {new Date(event.startDatetime).toLocaleDateString()} - {new Date(event.endDatetime).toLocaleDateString()}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faClock} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Time:</strong><br />
                                            {new Date(event.startDatetime).toLocaleTimeString()} - {new Date(event.endDatetime).toLocaleTimeString()}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Location:</strong><br />
                                            {event.location}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Max Participant:</strong><br />
                                            {event.maxParticipantNumber} Participants
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                                <p className="text-gray-700">{event.description}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <button onClick={() => setActiveTab("agenda")} className={`px-4 py-2 border rounded-l ${activeTab === "agenda" ? "bg-black text-white" : "bg-white text-gray-700"}`}>Agenda</button>
                            <button onClick={() => setActiveTab("members")} className={`px-4 py-2 border rounded-r ${activeTab === "members" ? "bg-black text-white" : "bg-white text-gray-700"}`}>Members</button>
                        </div>

                        {activeTab === "agenda" && (
                            <div className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-2">Event Agenda</h2>
                                <p className="text-sm text-gray-500 mb-1">Schedule for the day</p>
                                <div className="border-b py-4">
                                    <p><span className="font-semibold">09:00 - 10:00</span> Registration & Breakfast</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "members" && (
                            <div className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-xl font-semibold">Members</h2>
                                <p className="text-gray-600">Details about members will appear here.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SuperAdminViewEventDetails;
