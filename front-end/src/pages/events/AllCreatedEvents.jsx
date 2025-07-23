"use client"

import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import EventCard from "../../components/event/EventCard"
import EventsHeader from "../../components/event/EventsHeader"
import EventsStats from"../../components/event/EventsStats" 
import EmptyState from"../../components/event/EmptyState" 
import { getEventsByCreator } from "../../services/eventService"

const CreatedEventsPage = () => {
    const navigate = useNavigate()

    // Sample data - replace with your actual data fetching logic
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEventsByCreator = async () => {
            try {
                const response = await getEventsByCreator(); // Replace with your actual API endpoint
                console.log("Fetched events:", response.data)
                if (response) setEvents(response)
            } catch (error) {
                console.error("Error fetching events:", error)
            }
        }
        fetchEventsByCreator();
    }, []);

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    // Filter and search events
    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch =
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "ALL" || event.status === statusFilter

            return matchesSearch && matchesStatus && !event.isDeleted
        })
    }, [events, searchTerm, statusFilter])

    const handleCreateEvent = () => {
        navigate("/events/create")
    }

    const isFiltered = searchTerm !== "" || statusFilter !== "ALL"

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <EventsHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onCreateEvent={handleCreateEvent}
                />

                {/* Stats */}
                <EventsStats events={events.filter((e) => !e.isDeleted)} />

                {/* Events Grid */}
                {filteredEvents.length === 0 ? (
                    <EmptyState onCreateEvent={handleCreateEvent} isFiltered={isFiltered} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.eventId} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreatedEventsPage
