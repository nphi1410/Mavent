"use client"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { X, Calendar, FileText, Clock, List, Home, Plus } from "lucide-react"

const CreatedEventsSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { eventId } = useParams()
    const route = `/profile/created-events/${eventId}`

    const menuItems = [
        // {
        //     title: "Dashboard",
        //     icon: Home,
        //     path: "/profile/created-events",
        //     description: "View all events",
        // },
        // {
        //     title: "Create Event",
        //     icon: Plus,
        //     path: "/events/create",
        //     description: "Start new event",
        // },
        {
            title: "Event Details",
            icon: Calendar,
            path: "",
            description: "Basic information",
        },
        {
            title: "Proposal",
            icon: FileText,
            path: "/proposal",
            description: "Event proposal",
        },
        {
            title: "Timeline",
            icon: Clock,
            path: "/timeline",
            description: "Event stages",
        },
        {
            title: "Agenda",
            icon: List,
            path: "/agenda",
            description: "Event schedule",
        },
    ]

    const handleNavigation = (path) => {
        navigate(path)
        if (window.innerWidth < 768) {
            setIsOpen(false)
        }
    }

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        w-80 md:w-64
      `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Event Manager</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon
                        const active = isActive(item.path)

                        return (
                            <button
                                key={index}
                                onClick={() => handleNavigation(route + item.path)}
                                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                  ${active ? "bg-green-100 text-green-700 border border-green-200" : "hover:bg-gray-100 text-gray-700"}
                `}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-gray-500 truncate">{item.description}</div>
                                </div>
                            </button>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">Event Management System</div>
                </div>
            </div>
        </>
    )
}

export default CreatedEventsSidebar
