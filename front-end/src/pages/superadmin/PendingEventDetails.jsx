import { useEffect, useState } from "react"
import EventHeader from "../../components/pendingEventDetail/EventHeader"
import EventTimeline from "../../components/pendingEventDetail/EventTimeline"
import EventAgenda from "../../components/pendingEventDetail/EventAgenda"
import EventProposal from "../../components/pendingEventDetail/EventProposal"
import EventMedia from "../../components/pendingEventDetail/EventMedia"
import { getPendingEventDetailsById } from "../../services/eventService"
import { useParams } from "react-router-dom"
import EventApproval from "../../components/pendingEventDetail/EventApproval"

export default function PendingEventView() {
    const [eventData, setEventData] = useState({});
    const { eventId } = useParams(); // Assuming you're using react-router for navigation

    useEffect(() => {
        // Simulate fetching event data
        if (!eventId) {
            console.error("No event ID provided");
            return;
        }
        console.log("Fetching event data for ID:", eventId);
        const fetchEventData = async () => {
            try {
                const response = await getPendingEventDetailsById(eventId); // Example endpoint
                setEventData(response || {});
                console.log("Fetched event data:", response);
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        }
        fetchEventData();
    }, [eventId]);

    const handleAssignProposer = () => {
        console.log("Assigning proposer as event admin")
        // Implement actual assignment logic
    }

    const handleAssignAdmin = (user) => {
        console.log("Assigning user as admin:", user)
        // Implement actual assignment logic
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Event Header */}
                <EventHeader event={eventData} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <EventTimeline timeline={eventData.timelines} />
                        <EventAgenda agendas={eventData.agendas} />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <EventProposal
                            proposal={eventData.proposal}
                        />
                        <EventMedia bannerUrl={eventData.bannerUrl} posterUrl={eventData.posterUrl} />
                    </div>

                </div>

                <EventApproval
                    onAssignProposer={handleAssignProposer}
                    onAssignAdmin={handleAssignAdmin}
                />
            </div>
        </div>
    )
}
