import { Calendar, Clock, Users, CheckCircle } from "lucide-react"

const EventsStats = ({ events }) => {
    const stats = {
        total: events.length,
        upcoming: events.filter((e) => e.status === "UPCOMING").length,
        ongoing: events.filter((e) => e.status === "ONGOING").length,
        completed: events.filter((e) => e.status === "COMPLETED").length,
    }

    const statCards = [
        {
            title: "Total Events",
            value: stats.total,
            icon: Calendar,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            title: "Upcoming",
            value: stats.upcoming,
            icon: Clock,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Ongoing",
            value: stats.ongoing,
            icon: Users,
            color: "bg-green-500",
            bgColor: "bg-green-50",
        },
        {
            title: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "bg-gray-500",
            bgColor: "bg-gray-50",
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
