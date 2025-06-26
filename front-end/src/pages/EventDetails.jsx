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
import { getUserInfoInEvent } from "../services/userEventService"; // Assuming you have this service to fetch user info in the event
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams(); // <-- Get ID from URL
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
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
      const fetchUserInfo = async () => {
        setLoading(true);
        try {
          if (sessionStorage.getItem("isLoggedIn") !== "true") return;
          // Assuming you have a function to fetch user info in the event
          const userEventInfo = await getUserInfoInEvent(id);
          if (userEventInfo) {
            // Assuming userEventInfo contains the user data you need
            if (userEventInfo.role) {
              navigate(
                `/event/${id}/staff/${userEventInfo.role.toLowerCase()}`
              );
            }
            setRole(userEventInfo.role); // Set the role from user info
            console.log("User Info in Event:", userEventInfo);
          } else {
            console.warn("No user info found for this event.");
          }
        } catch (err) {
          console.error("Failed to fetch user info:", err);
          setError("Failed to fetch user information.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserInfo();

      fetchData();
    }
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <EventBanner eventData={eventData} />

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
    </div>
  );
};

export default EventDetails;
