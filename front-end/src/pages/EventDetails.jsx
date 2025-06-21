import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EventBanner from "../components/EventBanner";
import Description from "../components/Description";
import MapGuide from "../components/MapGuide";
import EventTime from "../components/EventTime";
import TagsList from "../components/TagsList";
import OrganizerContact from "../components/OrganizerContact";
import RelevantEvent from "../components/RelevantEvent";
import DepartmentList from "../components/department/DepartmentList";
import { getEventById } from "../services/eventService";

const EventDetails = () => {
  const { id } = useParams(); // <-- Get ID from URL
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getEventById(id);
          setEventData(data);
        } catch (err) {
          console.error("Failed to fetch event:", err);
          setError("Something went wrong.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  return (
    <div>
        <EventBanner eventData={eventData}/>

        <section className="flex flex-col lg:flex-row justify-between gap-8 px-4 sm:px-6 lg:px-12 py-8">
          <div className="w-full lg:w-1/2">
            <Description eventData={eventData} />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <EventTime eventData={eventData} />
            <MapGuide eventData={eventData} />
          </div>
        </section>
          <section className="px-4 sm:px-6 lg:px-12 py-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Phòng ban</h2>
            <Link to={`/events/${id}/departments`} className="text-blue-500 hover:underline flex items-center">
              Xem tất cả
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <DepartmentList eventId={id} />        </section>
        
        <section className="px-4 sm:px-6 lg:px-12 py-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Thành viên</h2>
            <Link to={`/events/${id}/members`} className="text-blue-500 hover:underline flex items-center">
              Quản lý thành viên
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600">Quản lý danh sách thành viên của sự kiện này.</p>
          </div>
        </section>

        <section className="flex flex-col lg:flex-row justify-between gap-8 px-4 sm:px-6 lg:px-12 py-8">
          <div className="w-full lg:w-1/2">
            <OrganizerContact contact={eventData?.organizer} />
          </div>
          <div className="w-full lg:w-1/2">
            <TagsList eventData={eventData} />
          </div>
        </section>
        <RelevantEvent eventData={eventData} />
    </div>
  );
};

export default EventDetails;
