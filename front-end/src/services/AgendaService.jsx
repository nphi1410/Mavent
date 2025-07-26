import axios from "axios";
import Api from "../config/Api"; 

const API_BASE_URL = "http://localhost:8080/api/events";

export const createAgendaItem = async (eventId, itemData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${eventId}/create-agenda`, itemData);
        return response.data;
    } catch (error) {
        console.error("Error creating agenda item:", error.response?.data || error.message);
        throw error;
    }
};

export const getAgendaItemsByEventId = async (eventId) => {
    try {
        const response = await Api.get(`/events/${eventId}/agenda`);
        return response.data;
    } catch (error) {
        console.error("Error fetching agenda items:", error.response?.data || error.message);
        throw error;
    }

}
