import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUser,
  faClock,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { getEventById } from "../../services/EventService";
import { getAgendaItemsByEventId } from "../../services/AgendaService";

function SuperAdminViewEventDetails() {
  const { eventId } = useParams(); //lấy eventId từ URL
  const [activeTab, setActiveTab] = useState("agenda");
  const [event, setEvent] = useState(null);
  const [agendaItems, setAgendaItems] = useState([]);
  const [loadingAgenda, setLoadingAgenda] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(eventId); //gọi API theo ID
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchAgenda = async () => {
      if (eventId) {
        setLoadingAgenda(true);
        try {
          const agendaData = await getAgendaItemsByEventId(eventId);
          setAgendaItems(agendaData || []);
        } catch (error) {
          console.error("Error fetching agenda:", error);
          setAgendaItems([]);
        } finally {
          setLoadingAgenda(false);
        }
      }
    };
    fetchAgenda();
  }, [eventId]);

  // Format datetime to display date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      // Format: DD/MM/YYYY HH:MM
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateTimeString;
    }
  };

  // Format time only to display in HH:MM format
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return dateTimeString;
    }
  };

  // Check if agenda items are on the same date
  const isSameDate = (dateTime1, dateTime2) => {
    if (!dateTime1 || !dateTime2) return false;
    const date1 = new Date(dateTime1);
    const date2 = new Date(dateTime2);
    return date1.toDateString() === date2.toDateString();
  };

  if (!event) return <div className="p-10">Loading...</div>; //loading state

  return (
    <div className="py-10 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl text-gray-800 font-bold mb-1">
            {event.name}
            <span
              className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full
                                        ${
                                          event.status === "RECRUITING"
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
          </h1>
          <p className="text-gray-500">Event ID: {event.eventId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-2xl font-bold text-black mb-4">Event Details</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-gray-600 mt-1"
              />
              <span>
                <strong>Date:</strong>
                <br />
                {new Date(event.startDatetime).toLocaleDateString()} -{" "}
                {new Date(event.endDatetime).toLocaleDateString()}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FontAwesomeIcon icon={faClock} className="text-gray-600 mt-1" />
              <span>
                <strong>Time:</strong>
                <br />
                {new Date(event.startDatetime).toLocaleTimeString()} -{" "}
                {new Date(event.endDatetime).toLocaleTimeString()}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-gray-600 mt-1"
              />
              <span>
                <strong>Location:</strong>
                <br />
                {event.location}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FontAwesomeIcon icon={faUser} className="text-gray-600 mt-1" />
              <span>
                <strong>Max Participant:</strong>
                <br />
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
        <button
          onClick={() => setActiveTab("agenda")}
          className={`px-4 py-2 border rounded-l ${
            activeTab === "agenda"
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Agenda
        </button>
      </div>

      {activeTab === "agenda" && (
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-2xl font-bold text-black mb-2">Event Agenda</h2>
          <p className="text-sm text-gray-500 mb-4">Schedule for the day</p>
          
          {loadingAgenda ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading agenda...</p>
            </div>
          ) : agendaItems.length > 0 ? (
            <div className="space-y-4">
              {agendaItems.map((item, index) => (
                <div key={item.agendaId || index} className="border-b pb-4 last:border-b-0">
                  <div className="flex flex-col gap-2 mb-2">
                    {/* Show full datetime if different dates, otherwise show time only */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-semibold text-blue-600 text-sm">
                        {isSameDate(item.agendaStartTime, item.agendaEndTime) ? (
                          <>
                            <span className="block sm:inline">
                              <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(item.agendaStartTime).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="block sm:inline sm:ml-2">
                              <FontAwesomeIcon icon={faClock} />  {formatTime(item.agendaStartTime)} - {formatTime(item.agendaEndTime)}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="block">
                              <FontAwesomeIcon icon={faCalendarAlt} /> Start: {formatDateTime(item.agendaStartTime)}
                            </span>
                            <span className="block">
                              <FontAwesomeIcon icon={faCalendarAlt} /> End: {formatDateTime(item.agendaEndTime)}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {item.agendaTitle}
                    </h3>
                  </div>
                  {item.agendaDescription && (
                    <p className="text-gray-600 ml-0 mb-2">
                      {item.agendaDescription}
                    </p>
                  )}
                  {item.speaker && (
                    <p className="text-sm text-gray-500 ml-0 mt-1">
                      <strong>👤 Speaker:</strong> {item.speaker}
                    </p>
                  )}
                  {item.location && (
                    <p className="text-sm text-gray-500 ml-0 mt-1">
                      <strong>📍 Location:</strong> {item.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No agenda items available for this event.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SuperAdminViewEventDetails;