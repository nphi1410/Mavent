"use client"

import { Eye, Calendar, MapPin, Users, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { vietnameseDate } from "../../utils/DateConvert"

const EventCard = ({ event }) => {
    const navigate = useNavigate()

    const handleViewEvent = () => {
        navigate(`${event.eventId}`)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "UPCOMING":
                return "bg-blue-100 text-blue-800"
            case "ONGOING":
            case "ENDED":
                return "bg-green-100 text-green-800"
            case "COMPLETED":
                return "bg-gray-100 text-gray-800"
            case "CANCELLED":
                return "bg-red-100 text-red-800"
            case "PENDING":
                return "bg-yellow-100 text-yellow-800"
            case "RECRUITING":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Event Banner */}
            {event.bannerUrl && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                    <img src={event.bannerUrl || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-6">
                {/* Header with title and status */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{event.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                            {vietnameseDate(event.startDatetime)} - {vietnameseDate(event.endDatetime)}
                        </span>
                    </div>

                    {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        <span>
                            Max Members: {event.maxMemberNumber} | Max Participants: {event.maxParticipantNumber}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Created: {vietnameseDate(event.createdAt)}</span>
                    </div>
                </div>

                {/* D-day Info */}
                {event.ddayInfo && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                        <p className="text-sm text-yellow-800 font-medium">📅 {event.ddayInfo}</p>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleViewEvent}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EventCard
