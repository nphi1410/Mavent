import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { createAgendaItem } from '../../services/agendaService'; // giả định bạn đã có service này

const CreateAgenda = () => {
    const { eventId } = useParams();
    const [agendas, setAgendas] = useState([
        { title: '', description: '', startTime: '', endTime: '' },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...agendas];
        updated[index][field] = value;
        setAgendas(updated);
    };

    const removeAgenda = (index) => {
        if (agendas.length === 1) return;
        setAgendas(agendas.filter((_, i) => i !== index));
    };

    const addAgenda = () => {
        setAgendas([...agendas, { title: '', description: '', startTime: '', endTime: '' }]);
    };

    const handleSaveAgenda = async () => {
        try {
            for (const agenda of agendas) {
                if (!agenda.title || !agenda.startTime || !agenda.endTime) {
                    alert("Please fill in all required fields.");
                    return;
                }

                const dto = {
                    agendaTitle: agenda.title,
                    agendaDescription: agenda.description || '',
                    agendaStartTime: agenda.startTime,
                    agendaEndTime: agenda.endTime,
                };

                console.log("Sending agenda DTO:", dto);
                await createAgendaItem(eventId, dto);
            }
            alert("Agenda created successfully!");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert("Error creating agenda. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-green-50 px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold">Create Agenda</h1>
                <p className="mt-2 text-gray-600">Define the detailed agenda for your event</p>

                {/* Stepper */}
                <div className="mt-6 flex justify-center items-center gap-6">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                        Event Details
                    </div>
                    <div className="h-px w-8 bg-gray-400"></div>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                        Timeline
                    </div>
                    <div className="h-px w-8 bg-gray-400"></div>
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">3</div>
                        Agenda
                    </div>
                </div>
            </div>

            {/* Agenda Form */}
            <div className="max-w-4xl mx-auto mt-10">
                {agendas.map((agenda, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 mb-6 shadow relative">
                        {/* Trash Icon */}
                        <button
                            className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-red-600"
                            onClick={() => removeAgenda(index)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>

                        {/* Agenda Header */}
                        <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
                            <FontAwesomeIcon icon={faClock} />
                            Agenda {index + 1}
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Agenda Title *</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="e.g., Opening Ceremony"
                                    value={agenda.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    placeholder="Brief description"
                                    value={agenda.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={agenda.startTime}
                                    onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={agenda.endTime}
                                    onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Agenda Button */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg text-center py-6 cursor-pointer hover:bg-gray-50 transition"
                    onClick={addAgenda}
                >
                    <FontAwesomeIcon icon={faPlus} className="text-gray-500" />{' '}
                    <span className="text-gray-700 font-medium">Add Another Agenda</span>
                </div>

                {/* Save Button */}
                <div className="text-center mt-8">
                    <button
                        className="cursor-pointer bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                        onClick={handleSaveAgenda}
                    >
                        Save Agenda & Send Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAgenda;
