import AgendaList from "../../components/event/AgendaList";
import { getEventById } from "../../services/eventService";
import { useEffect, useState } from "react";
import { Calendar, MessageSquare, MapPin, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAgendaItemsByEventId } from "../../services/agendaService";
import TagsList from "../../components/TagsList";
import MapGuide from "../../components/MapGuide";
import EventSponsors from "../../components/sponsorship/EventSponsors";

export default function EventDetailsByRoles() {
  // const [activeDropdown, setActiveDropdown] = useState("eventInfo");
  const { id, role } = useParams(); // <-- Get ID from URL

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getEventById(id);
          // console.log("Event Data:", data);

          setEventData(data);
        } catch (err) {
          console.error("Failed to fetch event:", err);
          setError("Something went wrong.");
        }
      };

      fetchData();
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Event Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {eventData?.name}
                </h1>

                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {eventData?.startDatetime
                      ? new Date(eventData.startDatetime).toLocaleTimeString() +
                        " " +
                        new Date(eventData.startDatetime).toDateString()
                      : "No start date"}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {eventData?.endDatetime
                      ? new Date(eventData.endDatetime).toLocaleTimeString() +
                        " " +
                        new Date(eventData.endDatetime).toDateString()
                      : "No end date"}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        eventData?.status === "ONGOING"
                          ? "bg-green-100 text-green-800"
                          : eventData?.status === "UPCOMING"
                          ? "bg-blue-100 text-blue-800"
                          : eventData?.status === "ENDED"
                          ? "bg-gray-300 text-black"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {eventData?.status}
                  </span>
                </div>

                <TagsList eventData={eventData} />

                {/* <div className="mb-6">
                  <p className="text-gray-700 mb-2">32 people attended</p>
                  <div className="flex items-center">
                    {attendees.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar || "/placeholder.svg"}
                        alt={`Attendee ${index + 1}`}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm -ml-2 first:ml-0"
                      />
                    ))}
                    <span className="text-gray-500 ml-2">+27</span>
                  </div>
                </div> */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description:
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {eventData?.description || "No description available."}
                    {/* <button className="text-blue-500 hover:text-blue-600 ml-1 transition-colors duration-200">
                  ...See more
                </button> */}
                  </p>
                </div>
              </div>

              {/* {console.log("eventLocationID:", eventData?.locationId)} */}
              <MapGuide eventData={eventData} />
            </div>

            {/* Agenda and Sponsors */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
            <AgendaList eventId={id} />

            {/* <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">SPONSORS</h2>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors duration-200">
                    See more...
                  </button>
                </div>
                <div className="space-y-4">
                  {sponsors.map((sponsor, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sponsor.name}</p>
                        <p className="text-gray-600">{sponsor.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            {/* </div> */}
            <EventSponsors eventId={id} />
          </div>
          {/* 
          {activeDropdown === "participants" && role.toUpperCase() === "ADMIN"(
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Participants</h2>
                <p className="text-gray-600">Participants list content would go here...</p> */}
          {/* {navigate(`/event/${id}/members`)} */}
          {/* </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
