import axios from "axios";
import Api from "../config/Api";

const API_BASE_URL = "http://localhost:8080/api/events"; // Cập nhật lại nếu BE dùng domain khác

export const createTimelineItem = async (eventId, itemData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${eventId}/create-timeline`, itemData);
        return response.data;
    } catch (error) {
        console.error("Error creating timeline item:", error.response?.data || error.message);
        throw error;
    }
};

export const getTimelinesByEventId = async (eventId) => {
    try {
        const res = await Api.get(`/events/${eventId}/get-timelines`);
        return res.data;
    } catch (error) {
        console.error("Error fetching timelines:", error.response?.data || error.message);
        throw error;
    }
}
