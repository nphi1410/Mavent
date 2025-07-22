import { ImageIcon } from "lucide-react"

export default function EventMedia({ bannerUrl, posterUrl }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Event Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Poster */}
                {posterUrl && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Event Poster</h3>
                        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                            <img src={posterUrl || "/placeholder.svg"} alt="Event Poster" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Banner (if not shown in header) */}
                {bannerUrl && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Event Banner</h3>
                        <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                            <img src={bannerUrl || "/placeholder.svg"} alt="Event Banner" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
