import React, { useState, useEffect } from "react";
import { createEvent, getEventById } from "../../services/EventService";
import { getAllLocations } from "../../services/EventLocationService";
import { getAllTags } from "../../services/EventTagService"; // Thêm import cho tag service
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const CreateEvent = ({ isUpdatePage = false }) => {
    // get account id from JWT token
    const token = sessionStorage.getItem("token");
    const decoded = jwtDecode(token);
    // console.log("Decoded JWT:", decoded);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDatetime: "",
        endDatetime: "",
        locationId: "",
        ddayInfo: "",
        maxMemberNumber: 0,
        maxParticipantNumber: 0,
        status: "PENDING",
        createdBy: decoded.accountId || "",
        bannerUrl: "",
        posterUrl: ""
    });

    const [bannerFile, setBannerFile] = useState(null);
    const [posterFile, setPosterFile] = useState(null);

    // Thêm state cho tags
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getAllLocations();
            setLocations(data);
        };
        
        // Thêm fetch tags
        const fetchTags = async () => {
            try {
                const tags = await getAllTags();
                setAvailableTags(tags);
                console.log("Fetched tags:", tags);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchLocations();
        fetchTags(); // Gọi fetch tags

        if (isUpdatePage) {
            const eventId = window.location.pathname.split("/").pop();
            const fetchCreatedEvent = async () => {
                try {
                    const response = await getEventById(eventId);
                    if (response) {
                        setFormData({
                            ...formData,
                            name: response.name,
                            description: response.description,
                            startDatetime: response.startDatetime,
                            endDatetime: response.endDatetime,
                            locationId: response.locationId,
                            ddayInfo: response.ddayInfo || "",
                            maxMemberNumber: response.maxMemberNumber || 0,
                            maxParticipantNumber: response.maxParticipantNumber || 0,
                            status: response.status || "PENDING",
                            bannerUrl: response.bannerUrl || "",
                            posterUrl: response.posterUrl || "",
                        });
                    }
                    console.log("Fetched event data:", response);
                } catch (error) {
                    console.error("Error fetching event data:", error);
                    setErrorMessage("Failed to load event data.");
                }
            }
            fetchCreatedEvent();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseInt(value, 10);
        setFormData((prev) => ({
            ...prev,
            [name]: isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue,
        }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleDateChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    // Thêm function xử lý chọn/bỏ chọn tags
    const handleTagToggle = (tagId) => {
        setSelectedTags(prev => {
            if (prev.includes(tagId)) {
                return prev.filter(id => id !== tagId);
            } else {
                return [...prev, tagId];
            }
        });
        setErrorMessage("");
        setSuccessMessage("");
    };

    const validateForm = () => {
        const {
            name,
            description,
            startDatetime,
            endDatetime,
            locationId,
            maxMemberNumber,
            maxParticipantNumber,
        } = formData;

        if (!name.trim()) return setError("Event name cannot be empty.");

        if (!description.trim()) return setError("Description cannot be empty.");
        if (!locationId) return setError("Please select location.");

        if (!startDatetime) return setError("Start time cannot be blank.");
        if (!endDatetime) return setError("End time cannot be blank.");

        const start = new Date(startDatetime);
        const end = new Date(endDatetime);
        if (end <= start) return setError("The end time must be after the start time.");

        if (maxMemberNumber < 0) return setError("Maximum number of members cannot be negative.");
        if (maxParticipantNumber < 0) return setError("Maximum number of participants cannot be negative.");

        // SỬA: Chỉ validate file khi không phải update mode
        if (!isUpdatePage) {
            if (!bannerFile) return setError("Please select banner image.");
            if (!posterFile) return setError("Please select poster image.");
        }

        return true;
    };

    const setError = (msg) => {
        setErrorMessage(msg);
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        // Debug: Log tất cả data trước khi gửi
        console.log("=== DEBUG CREATE EVENT ===");
        console.log("Selected Tags:", selectedTags);
        console.log("Form Data:", formData);
        console.log("Banner File:", bannerFile);
        console.log("Poster File:", posterFile);
        console.log("========================");

        // Cập nhật call createEvent với selectedTags
        const result = await createEvent(formData, bannerFile, posterFile, selectedTags);

        if (result.success) {
            setSuccessMessage("Tạo sự kiện thành công!");
            setTimeout(() => {
                navigate(`/create-event/${result.eventId}/create-proposal`);
            }, 800);
        } else {
            setErrorMessage(result.message || "Đã xảy ra lỗi.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-green-50 px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold">Create New Event</h1>
                <p className="mt-2 text-gray-600">Fill in the details to get started</p>

                {/* Stepper */}
                <div className="mt-6 flex justify-center items-center gap-6">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                        <div className="w-6 h-6 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center">1</div>
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

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-10 space-y-8">
                <div className="bg-white shadow rounded-xl p-6 space-y-6">
                    {/* Event Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Start & End Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDatetime" className="block text-sm font-medium text-gray-700 mb-1">
                                Start time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="startDatetime"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={formData.startDatetime}
                                onChange={(e) => handleDateChange("startDatetime", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="endDatetime" className="block text-sm font-medium text-gray-700 mb-1">
                                End time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="endDatetime"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={formData.endDatetime}
                                onChange={(e) => handleDateChange("endDatetime", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="locationId"
                            name="locationId"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={formData.locationId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Please select location --</option>
                            {locations.map((loc) => (
                                <option key={loc.locationId} value={loc.locationId}>
                                    {loc.locationName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Thêm phần chọn Tags - SỬA LẠI PROPERTY NAME */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag.tagId}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.tagId)}
                                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                        selectedTags.includes(tag.tagId)
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                        {selectedTags.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Selected {selectedTags.length} tag(s)
                            </p>
                        )}
                    </div>

                    {/* D-Day Info */}
                    <div>
                        <label htmlFor="ddayInfo" className="block text-sm font-medium text-gray-700 mb-1">
                            D-Day Information
                        </label>
                        <input
                            type="text"
                            id="ddayInfo"
                            name="ddayInfo"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={formData.ddayInfo}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Max Members & Participants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="maxMemberNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum number of members
                            </label>
                            <input
                                type="number"
                                id="maxMemberNumber"
                                name="maxMemberNumber"
                                min="0"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={formData.maxMemberNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="maxParticipantNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Maximum number of participants
                            </label>
                            <input
                                type="number"
                                id="maxParticipantNumber"
                                name="maxParticipantNumber"
                                min="0"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                value={formData.maxParticipantNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <input
                            type="text"
                            id="status"
                            name="status"
                            className="w-full border border-gray-300 rounded-lg p-2"
                            value={formData.status}
                            readOnly
                        >
                        </input>
                    </div>

                    {/* Banner Image Upload */}
                    {
                        isUpdatePage ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
                                <img src={formData.bannerUrl || "/placeholder.svg"} alt={formData.name} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setBannerFile(e.target.files[0])}
                                />
                                {bannerFile && (
                                    <p className="text-sm text-gray-500 mt-1">{bannerFile.name}</p>
                                )}
                            </div>
                        )
                    }

                    {/* Poster Image Upload */}
                    {isUpdatePage ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Poster</label>
                            <img src={formData.posterUrl || "/placeholder.svg"} alt={formData.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Poster</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPosterFile(e.target.files[0])}
                            />
                            {posterFile && (
                                <p className="text-sm text-gray-500 mt-1">{posterFile.name}</p>
                            )}
                        </div>
                    )}
                </div >

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{errorMessage}</div>
                )}
                {
                    successMessage && (
                        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>
                    )
                }

                {
                    !isUpdatePage && (
                        <div className="text-center mt-8">
                            <button
                                type="submit"
                                className="cursor-pointer bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Event & Next to Proposal"}
                            </button>
                        </div>

                    )
                }
            </form >
        </div >
    );
};

export default CreateEvent;