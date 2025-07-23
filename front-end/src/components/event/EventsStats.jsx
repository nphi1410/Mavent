import { Calendar, Clock, Users, CheckCircle } from "lucide-react"

const EventsStats = ({ events }) => {
    const stats = {
        total: events.length,
        upcoming: events.filter((e) => e.status === "UPCOMING").length,
        ongoing: events.filter((e) => e.status === "ONGOING").length,
        ended: events.filter((e) => e.status === "ENDED").length,
        pending: events.filter((e) => e.status === "PENDING").length,
        cancelled: events.filter((e) => e.status === "CANCELLED").length,
    }

    const statCards = [
        {
            title: "Total Events",
            value: stats.total,
            icon: Calendar,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
        },
        // {
        //     title: "Upcoming",
        //     value: stats.upcoming,
        //     icon: Clock,
        //     color: "bg-orange-500",
        //     bgColor: "bg-orange-50",
        // },
        {
            title: "Ongoing",
            value: stats.ongoing,
            icon: Users,
            color: "bg-gray-500",
            bgColor: "bg-gray-50",
        },

        {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Cancelled",
            value: stats.cancelled,
            icon: CheckCircle,
            color: "bg-red-500",
            bgColor: "bg-red-50",
        },
        {
            title: "Ended",
            value: stats.ended,
            icon: CheckCircle,
            color: "bg-green-500",
            bgColor: "bg-green-50",
        },


    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}>
                        <div className="flex items-center">
                            <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default EventsStats
