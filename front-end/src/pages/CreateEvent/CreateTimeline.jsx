import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { createTimelineItem } from '../../services/timelineService';
import { getEventById } from '../../services/eventService';

const CreateTimeline = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState('null');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            const data = await getEventById(eventId); //gọi API theo ID
            setEvent(data);
        };
        fetchEvent();
    }, [eventId]);

    const [stages, setStages] = useState([
        { title: '', description: '', startDate: '' },
    ]);

    const handleChange = (index, field, value) => {
        const updatedStages = [...stages];
        updatedStages[index][field] = value;
        setStages(updatedStages);
    };

    const removeStage = (index) => {
        if (stages.length === 1) return;
        setStages(stages.filter((_, i) => i !== index));
    };

    const addStage = () => {
        setStages([...stages, { title: '', description: '', startDate: '' }]);
    };

    const handleSaveTimeline = async () => {

        try {
            for (const stage of stages) {
                if (!stage.title || !stage.startDate) {
                    alert("Please enter title and start date for all stages.");
                    return;
                }

                const dto = {
                    timelineTitle: stage.title,
                    timelineDescription: stage.description || "", // optional
                    timelineDatetime: stage.startDate, // make sure it's like: 2025-06-15T10:00
                    // createdByAccountId: accountId
                };
                await createTimelineItem(eventId, dto);
            }
            navigate(`/create-event/${eventId}/create-agenda`);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert("Error creating timeline. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-green-50 px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold">Create Timeline</h1>
                <p className="mt-2 text-gray-600">Define the stages leading up to your event</p>
                <div className="mt-2 text-sm font-medium text-gray-700 bg-white inline-block px-3 py-1 rounded-full border">
                    Event Name: <span className="font-semibold text-gray-900">{event.name}</span>
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
                        Timeline
                    </div>
                    <div className="h-px w-8 bg-gray-400"></div>
                    <div className="flex items-center gap-2 text-gray-400 font-medium">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">3</div>
                        Agenda
                    </div>
                </div>
            </div>

            {/* Timeline Form */}
            <div className="max-w-4xl mx-auto mt-10">
                {stages.map((stage, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 mb-6 shadow relative">
                        {/* Trash Icon */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                            onClick={() => removeStage(index)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>

                        {/* Stage Header */}
                        <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
                            <FontAwesomeIcon icon={faClock} />
                            Stage {index + 1}
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stage Title *</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="e.g., Recruitment, Interview, Selection"
                                    value={stage.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Brief description of this stage"
                                    value={stage.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={stage.startDate}
                                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Another Stage */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg text-center py-6 cursor-pointer hover:bg-gray-50 transition"
                    onClick={addStage}
                >
                    <FontAwesomeIcon icon={faPlus} className="text-gray-500" />{' '}
                    <span className="text-gray-700 font-medium">Add Another Stage</span>
                </div>

                {/* Save Button */}
                <div className="text-center mt-8">
                    <button
                        className="cursor-pointer bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                        onClick={handleSaveTimeline}
                    >
                        Save Timeline & Create Agenda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTimeline;
