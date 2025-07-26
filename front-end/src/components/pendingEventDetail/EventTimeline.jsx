import { Clock } from "lucide-react"
import { vietnameseDate } from "@/utils/DateConvert"

export default function EventTimeline({ timeline }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
            </h2>

            <div className="space-y-4">
                {timeline?.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            {index < timeline.length - 1 && <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>}
                        </div>
                        <div className="flex-1 pb-4">
                            <h3 className="font-medium text-gray-900">{item.timelineTitle}</h3>
                            <p className="text-gray-600 text-sm mt-1">{item.timelineDescription}</p>
                            <p className="text-gray-600 text-sm mt-1">{vietnameseDate(item.timelineDatetime, false, true)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
