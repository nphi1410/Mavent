import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // <-- Import useParams
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import EventBanner from "../components/EventBanner";
import Description from "../components/Description";
import MapGuide from "../components/MapGuide";
import EventTime from "../components/EventTime";
import TagsList from "../components/TagsList";
import OrganizerContact from "../components/OrganizerContact";
import RelevantEvent from "../components/RelevantEvent";
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
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

        <section className="flex flex-col lg:flex-row justify-between gap-8 px-4 sm:px-6 lg:px-12 py-8">
          <div className="w-full lg:w-1/2">
            <OrganizerContact contact={eventData?.organizer} />
          </div>
          <div className="w-full lg:w-1/2">
            <TagsList eventData={eventData} />
          </div>
        </section>
        <RelevantEvent eventData={eventData} />
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
