
import { useEffect, useState } from "react"
import { ChevronLeft, Calendar, MessageSquare, MapPin, User } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfoInEvent } from "../../services/userEventService"; // Assuming you have this service to fetch user info in the event

export default function EventDetailsByRoles() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState(null);
  const [error, setError] = useState(null);
  const { id, role } = useParams(); // <-- Get ID from URL
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Assuming you have a function to fetch user info in the event
        const userEventInfo = await getUserInfoInEvent(id);
        if (userEventInfo) {
          // Assuming userEventInfo contains the user data you need
          // console.log("User Info in Event:", userEventInfo);
          setAccountId(userEventInfo.accountId); // Set the account ID from user info

        } else {
          console.warn("No user info found for this event.");
        }


      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setError("Failed to fetch user information.");
      }
    }
    fetchUserInfo();
  }, [id, navigate]);


  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const attendees = [
    "/placeholder.svg?height=40&width=40",
    "/placeholder.svg?height=40&width=40",
    "/placeholder.svg?height=40&width=40",
    "/placeholder.svg?height=40&width=40",
    "/placeholder.svg?height=40&width=40",
  ]

  const agendaItems = [
    { time: "7:30 - 9:30", title: "Title" },
    { time: "9:30 - 10:30", title: "Title" },
    { time: "10:30 - 11:30", title: "Title" },
    { time: "11:30 - 12:30", title: "Title" },
    { time: "12:30 - 14:30", title: "Title" },
  ]

  const sponsors = [
    { name: "Diamond Sponsor", company: "NPC Company" },
    { name: "Diamond Sponsor", company: "NPC Company" },
    { name: "Diamond Sponsor", company: "NPC Company" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to event lists
            </button>
            <span className="text-gray-800 font-medium">Role: Admin</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Event Actions */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => toggleDropdown("eventInfo")}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeDropdown === "eventInfo"
                  ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                  : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500"
                }`}
            >
              View Event Info
            </button>
            {role.toUpperCase() === "ADMIN" && (
              <button
                onClick={() => toggleDropdown("participants")}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeDropdown === "participants"
                    ? "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500"
                    : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
                  }`}
              >
                View Members →
              </button>

            )}
            {role.toUpperCase() === "ADMIN" && (
              <button
                onClick={() => toggleDropdown("feedback")}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeDropdown === "feedback"
                    ? "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500"
                    : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
                  }`}
              >
                View Feedback →
              </button>
            )}
            <button
              onClick={() => toggleDropdown("reports")}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${activeDropdown === "reports"
                  ? "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500"
                  : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
                }`}
            >
              View Requests →
            </button>
          </div>
        </div>

        {/* Dropdown Content */}
        {activeDropdown === "eventInfo" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Event Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">INTERNATIONAL DAY 2024</h1>

                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">20/10/2025</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">Status: UPCOMING</span>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                      Coding
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                      Musical
                    </span>
                  </div>

                  <div className="mb-6">
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
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description:</h3>
                    <p className="text-gray-700 leading-relaxed">
                      🎊 INTERNATIONAL DAY 2024: FESTIE LAND - LỄ HỘI QUỐC TẾ CHÀO ĐÓN TÂN SINH VIÊN K20 CHÍNH THỨC ĐỔ
                      BỘ 🎊
                      <button className="text-blue-500 hover:text-blue-600 ml-1 transition-colors duration-200">
                        ...See more
                      </button>
                    </p>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-200 rounded-lg h-64 mb-4 relative overflow-hidden">
                    <img
                      src="/placeholder.svg?height=256&width=400"
                      alt="Event location map"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <p className="text-gray-700">
                    <strong>Location:</strong> Tầng 5 Tòa Gamma, Trường Đại học FPT
                  </p>
                </div>
              </div>

              {/* Agenda and Sponsors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">AGENDA</h2>
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 font-semibold text-gray-700">Time</th>
                          <th className="text-left py-3 font-semibold text-gray-700">Title</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {agendaItems.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3 text-gray-700">{item.time}</td>
                            <td className="py-3 text-gray-700">{item.title}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDropdown === "participants" && role.toUpperCase() === "ADMIN"(
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Members</h2>
              {/* <p className="text-gray-600">Participants list content would go here...</p> */}
              {navigate(`/events/${id}/members`)}
            </div>
          </div>
        )}

        {activeDropdown === "feedback" && role.toUpperCase() === "ADMIN" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Feedback</h2>
              {/* <p className="text-gray-600">Feedback content would go here...</p> */}
              {navigate(`/event/${id}/feedback`)}
            </div>
          </div>
        )}

        {activeDropdown === "reports" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Reports</h2>
              {/* <p className="text-gray-600">Reports content would go here...</p> */}
              { navigate(`/event/${id}/account/${accountId}/request`) }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
