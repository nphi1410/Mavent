import { React, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faClock, faLocationDot, faEdit } from "@fortawesome/free-solid-svg-icons";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import SuperAdminHeader from "../components/SuperAdminHeader";
import { getEvents } from "../services/eventService";

function SuperAdminViewEventDetails() {
    const [activeTab, setActiveTab] = useState("agenda");
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
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl text-gray-800 font-bold">{events.name}<span className="ml-2 text-sm bg-emerald-700 text-white px-2 py-0.5 rounded-full">Upcoming</span></h1>
                                <p className="text-gray-500">Event ID: {events.eventId}</p>
                            </div>
                            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                                <FontAwesomeIcon icon={faEdit} /> Edit Event
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-4">Event Details</h2>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Date:</strong><br />Sunday, June 15, 2025
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FontAwesomeIcon icon={faClock} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Time:</strong><br />10:00 AM - 5:00 PM
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3"><FontAwesomeIcon icon={faLocationDot} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Location:</strong><br />
                                            {events.location}
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3"><FontAwesomeIcon icon={faUser} className="text-gray-600 mt-1" />
                                        <span>
                                            <strong>Max Participant:</strong><br />
                                            {events.maxParticipantNumber} <span>Participants</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4 shadow-sm">
                                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                                <p className="text-gray-700">{events.description}</p>
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
                                <div className="border-b py-4">
                                    <p><span className="font-semibold">09:00 - 10:00</span> Registration & Breakfast</p>
                                </div><div className="border-b py-4">
                                    <p><span className="font-semibold">09:00 - 10:00</span> Registration & Breakfast</p>
                                </div><div className="border-b py-4">
                                    <p><span className="font-semibold">09:00 - 10:00</span> Registration & Breakfast</p>
                                </div><div className="border-b py-4">
                                    <p><span className="font-semibold">09:00 - 10:00</span> Registration & Breakfast</p>
                                </div><div className="border-b py-4">
                                    <p><span className="font-semibold">09:00 - 10:00</span> Registration & Breakfast</p>
                                </div>
                                {/* Add more agenda items as needed */}
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

export default SuperAdminViewEventDetails
