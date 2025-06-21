import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { createProposalItem } from '../../services/proposalService';

const CreateProposal = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [proposals, setProposals] = useState({
        proposalTitle: '',
        proposalDescription: '',
        proposalLink: '',
        defenseDate: '',
    });

    const [errors, setErrors] = useState({
        proposalLink: '',
    });

    useEffect(() => {
        const fetchEvent = async () => {
            const data = await getEventById(eventId);
            setEvent(data);
        };
        fetchEvent();
    }, [eventId]);

    const isValidURL = (url) => {
        const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=.]*?)?$/i;
        return pattern.test(url);
    };

    const handleChange = (field, value) => {
        setProposals((prev) => ({ ...prev, [field]: value }));

        if (field === "proposalLink") {
            if (!isValidURL(value)) {
                setErrors((prev) => ({ ...prev, proposalLink: "Please enter a valid link (https://...)" }));
            } else {
                setErrors((prev) => ({ ...prev, proposalLink: "" }));
            }
        }
    };

    const handleSaveProposal = async () => {
        try {
            const { proposalTitle, proposalDescription, proposalLink, defenseDate } = proposals;

            if (!proposalTitle || !proposalLink || !proposalDescription || !defenseDate) {
                alert("Please fill in all required fields.");
                return;
            }

            if (!isValidURL(proposalLink)) {
                alert("Proposal link is not valid!");
                return;
            }

            const dto = {
                title: proposalTitle,
                notes: proposalDescription,
                proposalLink: proposalLink,
                eventId: parseInt(eventId),
                defenseDate: new Date(defenseDate)
            };

            await createProposalItem(eventId, dto);
            alert("Proposal created successfully!");
            navigate(`/create-event/${eventId}/create-timeline`);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert("Error creating proposal. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-green-50 px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold">Create Proposal</h1>
                <p className="mt-2 text-gray-600">Provide your proposal details for the event</p>
                <div className="mt-2 text-sm font-medium text-gray-700 bg-white inline-block px-3 py-1 rounded-full border">
                    Event Name: <span className="font-semibold text-gray-900">{event?.name}</span>
                </div>

                {/* Stepper */}
                <div className="mt-6 flex justify-center items-center gap-6">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                        Event Details
                    </div>
                    <div className="h-px w-8 bg-gray-400"></div>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">2</div>
                        Proposal
                    </div>
                    <div className="h-px w-8 bg-gray-400"></div>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">3</div>
                        Timeline
                    </div>
                    <div className="h-px w-8 bg-gray-400"></div>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">4</div>
                        Agenda
                    </div>
                </div>
            </div>

            {/* Proposal Form */}
            <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Title *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            placeholder="e.g., Codefest Plan"
                            value={proposals.proposalTitle}
                            onChange={(e) => handleChange("proposalTitle", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Link *</label>
                        <input
                            type="text"
                            className={`w-full border ${errors.proposalLink ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2`}
                            placeholder="e.g., https://docs.google.com/..."
                            value={proposals.proposalLink}
                            onChange={(e) => handleChange("proposalLink", e.target.value)}
                        />
                        {errors.proposalLink && (
                            <p className="text-red-500 text-sm mt-1">{errors.proposalLink}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            placeholder="Describe the proposal briefly"
                            value={proposals.proposalDescription}
                            onChange={(e) => handleChange("proposalDescription", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Defense Date *</label>
                        <input
                            type="datetime-local"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={proposals.defenseDate}
                            onChange={(e) => handleChange("defenseDate", e.target.value)}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="text-center mt-8">
                    <button
                        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                        onClick={handleSaveProposal}
                    >
                        Submit Proposal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProposal;
