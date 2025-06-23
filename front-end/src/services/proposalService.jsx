import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/events"; // Cập nhật lại nếu BE dùng domain khác

export const createProposalItem = async (eventId, itemData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${eventId}/create-proposal`, itemData);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        console.error("Error creating proposal item:", error.response?.data || error.message);
        throw error;
    }
};
