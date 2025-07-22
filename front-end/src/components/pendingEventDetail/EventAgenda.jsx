import { Calendar, Clock } from "lucide-react"

export default function EventAgenda({ agenda }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda
            </h2>

            <div className="space-y-4">
                {agenda.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {item.startTime} - {item.endTime}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
