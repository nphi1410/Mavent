import React, { useState, useEffect } from 'react';
import { Route, useParams } from 'react-router-dom';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminHeader from '../components/SuperAdminHeader';
import { getEventById, updateEvent } from '../services/eventService'; // giả sử bạn export axios funcs từ api.js

function SuperAdminEditEvent() {
    const { eventId } = useParams();  // <-- lấy param eventId từ URL

    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        startDatetime: '',
        endDatetime: '',
        location: '',
        status: 'PENDING',
        maxMemberNumber: 0,
        maxParticipantNumber: 0,
        // các trường khác...
    });

    useEffect(() => {
        if (!eventId) return;  // tránh gọi khi eventId undefined

        async function fetchEvent() {
            try {
                const data = await getEventById(eventId);
                if (data) {
                    setEventData({
                        ...data,
                        startDatetime: data.startDatetime ? data.startDatetime.substring(0, 16) : '',
                        endDatetime: data.endDatetime ? data.endDatetime.substring(0, 16) : '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch event:', error);
            }
        }
        fetchEvent();
    }, [eventId]);

    // Xử lý khi người dùng nhập form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Gộp ngày và giờ thành 1 datetime-local string (nếu bạn có tách riêng date/time inputs)
    // Ở đây UI bạn hiện dùng input date + input time riêng, mình khuyên bạn chuyển sang input type="datetime-local" để đơn giản.

    // Submit form update event
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gọi API update
        const updatedEvent = await updateEvent(eventId, eventData);
        if (updatedEvent) {
            alert('Cập nhật sự kiện thành công!');
            // Có thể redirect hoặc refresh dữ liệu tại đây
        } else {
            alert('Cập nhật sự kiện thất bại, vui lòng thử lại.');
        }
    };

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className="flex flex-col flex-1">
                <SuperAdminHeader />
                <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
                    <form onSubmit={handleSubmit} className="py-10 w-full">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">Edit Event</h1>
                            <p className="text-gray-500">
                                Update event details for <span className="font-bold text-black">{eventData.name}</span>
                            </p>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <section className="bg-white p-6 shadow rounded-xl space-y-4 mb-4">
                                <h2 className="text-2xl font-semibold text-black mb-4">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Event Title</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Description</label>
                                        <textarea
                                            rows="4"
                                            name="description"
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-md font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                                value={eventData.location}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-md font-medium text-gray-700"></label>
                                        </div>
                                        <div>
                                            <label className="block text-md font-medium text-gray-700">Status</label>
                                            <select
                                                name="status"
                                                className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                                value={eventData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="RECRUITING">RECRUITING</option>
                                                <option value="UPCOMING">UPCOMING</option>
                                                <option value="ONGOING">ONGOING</option>
                                                <option value="ENDED">ENDED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                                <option value="PENDING">PENDING</option>
                                                <option value="REVIEWING">REVIEWING</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Date & Time */}
                            <section className="bg-white p-6 shadow rounded-xl space-y-4 mb-4">
                                <h2 className="text-2xl font-semibold text-black mb-4">Date & Time</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Start Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            name="startDatetime"
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.startDatetime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">End Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            name="endDatetime"
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.endDatetime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Capacity */}
                            <section className="bg-white p-6 shadow rounded-xl space-y-4 mb-4">
                                <h2 className="text-2xl font-semibold text-black mb-4">Capacity</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Max Members</label>
                                        <input
                                            type="number"
                                            name="maxMemberNumber"
                                            min="1"
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.maxMemberNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Max Participants</label>
                                        <input
                                            type="number"
                                            name="maxParticipantNumber"
                                            min="1"
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.maxParticipantNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>
                            {/* Assign Admin an each event */}
                            <section className="bg-white p-6 shadow rounded-xl space-y-4 mb-4">
                                <h2 className="text-2xl font-semibold text-black mb-4">Role of Event</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700">Admin</label>
                                        <input
                                            type="text"
                                            name="admin"
                                            placeholder='Enter email'
                                            className="w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400"
                                            value={eventData.admin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="cursor-pointer px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="cursor-pointer px-5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default SuperAdminEditEvent;
