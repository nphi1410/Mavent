import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const CreateEvent = () => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('2025-01-01');
    const [time, setTime] = useState('00:00');
    const [location, setLocation] = useState('');

    const handleAddGuest = () => {
        setGuests([...guests, '']);
    };

    const handleCreateEvent = () => {
        // Handle event creation logic
        alert('Event created:', {
            eventName,
            description,
            date,
            time,
            duration,
            location,
            guests,
        });
    }

    const handleCancelEvent = () => {
        // Handle event cancellation logic
        alert('Event cancelled');
    }
    return (
        <div className="p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-8 pl-12">
                <h1 className="text-xl text-black font-semibold">Create Event</h1>
            </div>

            <div className="space-y-4">
                <div>
                    <p className='text-black text-xl pb-2'>Event name</p>
                    <input
                        type="text"
                        placeholder="Enter event name"
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
                    />
                </div>
                <div>
                    <p className='text-black text-xl pb-2'>Event description</p>
                    <input
                        type="text"
                        placeholder="Enter event description"
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full p-2 border-b-black rounded-md focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
                    />
                </div>

                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="block text-black text-xl pb-2">Date start</label>

                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <FontAwesomeIcon
                                icon={faCalendar}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-black text-xl pb-2">Time</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <FontAwesomeIcon
                                icon={faClock}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    This event will take place on {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} from {time}.
                </p>
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="block text-black text-xl pb-2">Date end</label>

                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <FontAwesomeIcon
                                icon={faCalendar}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-black text-xl pb-2">Time</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="text-black w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <FontAwesomeIcon
                                icon={faClock}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <p className='text-black text-xl pb-2'>Location</p>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Choose Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
                        />
                    </div>
                </div>

                <div>
                    <p className='text-black text-xl pb-2'>Assign event's admin</p>
                    <div className="flex space-x-2">
                        <input
                            type="email"
                            placeholder="admin@gmail.com"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className='flex justify-center py-3.5'>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                    onClick={handleCreateEvent}
                >
                    Create Event
                </button>
                <button
                    className='bg-red-500 text-white py-2 px-4 rounded-md ml-2'
                    onClick={handleCancelEvent}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateEvent;