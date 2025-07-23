"use client"

import { Calendar, Plus } from "lucide-react"

const EmptyState = ({ onCreateEvent, isFiltered = false }) => {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isFiltered ? "No events found" : "No events created yet"}
            </h3>

            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {isFiltered
                    ? "Try adjusting your search or filter criteria to find events."
                    : "Get started by creating your first event. You can manage all your events from this dashboard."}
            </p>

            {!isFiltered && (
                <button
                    onClick={onCreateEvent}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Event
                </button>
            )}
        </div>
    )
}

export default EmptyState
