import { Calendar, MapPin, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { vietnameseDate } from "../../utils/DateConvert"

export default function EventHeader({ event }) {
  const getDaysUntilEvent = (startDate) => {
    const today = new Date()
    const eventDate = new Date(startDate)
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntil = getDaysUntilEvent(event.startDate)

  return (
    <div className="space-y-6">
      {/* Banner Image */}
      {event.bannerUrl && (
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <img src={event.bannerUrl || "/placeholder.svg"} alt="Event Banner" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Event Title and Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{event.name}</h1>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Pending Approval
          </Badge>
        </div>

        {/* D-Day Counter */}
        {daysUntil > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">D-{daysUntil}</div>
            <div className="text-sm text-blue-500">days to go</div>
          </div>
        )}
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Start Date</div>
            <div className="font-medium">{vietnameseDate(event.startDate)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">End Date</div>
            <div className="font-medium">{vietnameseDate(event.endDate)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 col-span-2 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Location</div>
            <div className="font-medium">{event.location}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Users className="h-5 w-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Capacity</div>
            <div className="font-medium">{event.maxParticipants} Participants</div>
            <div className="font-medium">{event.maxMembers} Members</div>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${event.creator?.username}`}>
            <Avatar
              src={event.creator?.avatarUrl || "/placeholder.svg"}
              alt={event.creator?.username}
              fallback={event.creator?.username.charAt(0).toUpperCase()}
              size="lg"
              className="cursor-pointer hover:ring-2 hover:ring-blue-500"
            />
          </Link>
          <div>
            <Link
              href={`/profile/${event.creator?.username}`}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              @{event.creator?.username}
            </Link>
            <div className="text-sm text-gray-500">Event Creator</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Created</div>
          <div className="font-medium">{vietnameseDate(event.createdAt)}</div>
        </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>
    </div>
  )
}
