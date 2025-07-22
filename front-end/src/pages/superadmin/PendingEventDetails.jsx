import { useState } from "react"
import EventHeader from "../../components/pendingEventDetail/EventHeader"
import EventTimeline from"../../components/pendingEventDetail/EventTimeline" 
import EventAgenda from "../../components/pendingEventDetail/EventAgenda" 
import EventProposal from"../../components/pendingEventDetail/EventProposal" 
import EventMedia from "../../components/pendingEventDetail/EventMedia"

export default function PendingEventView() {
    // Mock event data - replace with actual data fetching
    const [eventData] = useState({
        name: "Tech Innovation Summit 2024",
        description:
            "Join us for a comprehensive summit exploring the latest trends in technology innovation, featuring keynote speakers, workshops, and networking opportunities. This event brings together industry leaders, entrepreneurs, and tech enthusiasts to discuss the future of technology and its impact on society.",
        startDate: "2024-03-15T09:00:00Z",
        endDate: "2024-03-17T18:00:00Z",
        location: "San Francisco Convention Center, CA",
        maxMembers: 50,
        maxParticipants: 500,
        createdBy: {
            username: "tech_organizer",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        createdAt: "2024-01-15T10:30:00Z",
        bannerUrl: "/placeholder.svg?height=320&width=800",
        posterUrl: "/placeholder.svg?height=600&width=450",
        timeline: [
            {
                title: "Registration Opens",
                description: "Early bird registration begins with special pricing",
            },
            {
                title: "Speaker Lineup Announcement",
                description: "Full list of keynote speakers and workshop leaders revealed",
            },
            {
                title: "Venue Setup",
                description: "Final preparations and technical setup at the venue",
            },
            {
                title: "Event Day 1",
                description: "Opening ceremony and first day of presentations",
            },
            {
                title: "Event Conclusion",
                description: "Closing remarks and networking reception",
            },
        ],
        agenda: [
            {
                title: "Registration & Welcome Coffee",
                description: "Check-in process and networking with early arrivals",
                startTime: "08:00",
                endTime: "09:00",
            },
            {
                title: "Opening Keynote: The Future of AI",
                description: "Industry leader discusses emerging AI trends and implications",
                startTime: "09:00",
                endTime: "10:00",
            },
            {
                title: "Panel Discussion: Sustainable Tech",
                description: "Expert panel on environmental impact of technology",
                startTime: "10:30",
                endTime: "11:30",
            },
            {
                title: "Workshop: Blockchain Fundamentals",
                description: "Hands-on workshop covering blockchain basics and applications",
                startTime: "14:00",
                endTime: "16:00",
            },
            {
                title: "Networking Reception",
                description: "Casual networking with refreshments and live music",
                startTime: "17:00",
                endTime: "19:00",
            },
        ],
        proposal: {
            title: "Tech Innovation Summit 2024 - Event Proposal",
            link: "https://example.com/proposal-document.pdf",
            note: "This comprehensive proposal outlines the vision, objectives, and detailed planning for the Tech Innovation Summit 2024. The document includes budget breakdown, speaker profiles, venue details, and expected outcomes.",
        },
    })

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
                        <EventTimeline timeline={eventData.timeline} />
                        <EventAgenda agenda={eventData.agenda} />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <EventProposal
                            proposal={eventData.proposal}
                            onAssignProposer={handleAssignProposer}
                            onAssignAdmin={handleAssignAdmin}
                        />
                        <EventMedia bannerUrl={eventData.bannerUrl} posterUrl={eventData.posterUrl} />
                    </div>
                </div>
            </div>
        </div>
    )
}
