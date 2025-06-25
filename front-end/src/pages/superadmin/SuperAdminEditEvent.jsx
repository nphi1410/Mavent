import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import SuperAdminHeader from '../../components/superadmin/SuperAdminHeader';
import { getEventById, updateEvent } from '../../services/eventService';
import { getAllLocations } from '../../services/eventLocationService';

function SuperAdminEditEvent() {
    const { eventId } = useParams();

    /* ---------- STATE ---------- */
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        startDatetime: '',
        endDatetime: '',
        locationId: '',
        status: '',
        maxMemberNumber: 0,
        maxParticipantNumber: 0,
    });

    const [locations, setLocations] = useState([]);

    // NEW — state cho file
    const [bannerFile, setBannerFile] = useState(null);
    const [posterFile, setPosterFile] = useState(null);

    /* ---------- FETCH LOCATIONS ---------- */
    useEffect(() => {
        (async () => {
            try {
                const data = await getAllLocations();
                setLocations(data || []);
            } catch (err) {
                console.error('Failed to fetch locations:', err);
            }
        })();
    }, []);

    /* ---------- FETCH EVENT ---------- */
    useEffect(() => {
        if (!eventId) return;
        (async () => {
            try {
                const data = await getEventById(eventId);
                if (data) {
                    setEventData({
                        ...data,
                        startDatetime: data.startDatetime
                            ? data.startDatetime.substring(0, 16)
                            : '',
                        endDatetime: data.endDatetime
                            ? data.endDatetime.substring(0, 16)
                            : '',
                    });
                }
            } catch (err) {
                console.error('Failed to fetch event:', err);
            }
        })();
    }, [eventId]);

    /* ---------- HANDLERS ---------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateEvent(
            eventId,
            eventData,
            bannerFile,
            posterFile
        );
        if (result) {
            alert('Cập nhật sự kiện thành công!');
            window.location.href = '/superadmin/events';
        } else {
            alert('Cập nhật sự kiện thất bại, vui lòng thử lại.');
        }
    };

    /* ---------- RENDER ---------- */
    return (
        <div className='h-screen w-screen flex bg-amber-50'>
            <SuperAdminHeader />
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>
                    <form onSubmit={handleSubmit} className='py-10 w-full'>
                        {/* PAGE HEADER */}
                        <div className='mb-6'>
                            <h1 className='text-4xl font-bold text-gray-800 mb-4'>
                                Edit Event
                            </h1>
                            <p className='text-gray-500'>
                                Update event details for{' '}
                                <span className='font-bold text-black'>{eventData.name}</span>
                            </p>
                        </div>

                        {/* BASIC INFORMATION + TIME & IMAGE */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Basic */}
                            <section className='bg-white p-6 shadow rounded-xl space-y-4 mb-4'>
                                <h2 className='text-2xl font-semibold text-black mb-4'>
                                    Basic Information
                                </h2>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Event Title
                                        </label>
                                        <input
                                            type='text'
                                            name='name'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            value={eventData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Description
                                        </label>
                                        <textarea
                                            rows='4'
                                            name='description'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            value={eventData.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <label className='block text-md font-medium text-gray-700'>
                                                Location
                                            </label>
                                            <select
                                                name='locationId'
                                                className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                                value={eventData.locationId}
                                                onChange={handleChange}
                                            >
                                                {locations.map((loc) => (
                                                    <option
                                                        key={loc.locationId}
                                                        value={loc.locationId}
                                                    >
                                                        {loc.locationName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className='block text-md font-medium text-gray-700'>
                                                Status
                                            </label>
                                            <select
                                                name='status'
                                                className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                                value={eventData.status}
                                                onChange={handleChange}
                                            >
                                                <option value='RECRUITING'>RECRUITING</option>
                                                <option value='UPCOMING'>UPCOMING</option>
                                                <option value='ONGOING'>ONGOING</option>
                                                <option value='ENDED'>ENDED</option>
                                                <option value='CANCELLED'>CANCELLED</option>
                                                <option value='PENDING'>PENDING</option>
                                                <option value='REVIEWING'>REVIEWING</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Time & Images */}
                            <section className='bg-white p-6 shadow rounded-xl space-y-4 mb-4'>
                                <h2 className='text-2xl font-semibold text-black mb-4'>
                                    Time & Event&apos;s Image
                                </h2>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Start Date &amp; Time
                                        </label>
                                        <input
                                            type='datetime-local'
                                            name='startDatetime'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            value={eventData.startDatetime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            End Date &amp; Time
                                        </label>
                                        <input
                                            type='datetime-local'
                                            name='endDatetime'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            value={eventData.endDatetime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Banner
                                        </label>
                                        <input
                                            type='file'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            onChange={(e) => setBannerFile(e.target.files[0])}
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Poster
                                        </label>
                                        <input
                                            type='file'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            onChange={(e) => setPosterFile(e.target.files[0])}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* CAPACITY */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <section className='bg-white p-6 shadow rounded-xl space-y-4 mb-4'>
                                <h2 className='text-2xl font-semibold text-black mb-4'>
                                    Capacity
                                </h2>

                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Max Members
                                        </label>
                                        <input
                                            type='number'
                                            name='maxMemberNumber'
                                            min='1'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            value={eventData.maxMemberNumber}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-md font-medium text-gray-700'>
                                            Max Participants
                                        </label>
                                        <input
                                            type='number'
                                            name='maxParticipantNumber'
                                            min='1'
                                            className='w-full mt-1 p-3 border rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400'
                                            value={eventData.maxParticipantNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* BUTTONS */}
                        <div className='flex justify-end gap-4 mt-6'>
                            <button
                                type='button'
                                onClick={() => window.history.back()}
                                className='cursor-pointer px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                className='cursor-pointer px-5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700'
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
