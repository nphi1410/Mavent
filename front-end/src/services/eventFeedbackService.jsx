import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/event';

// Hàm fetch feedback theo eventId
export const getEventFeedback = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${eventId}/feedback`);
        return response.data;
    } catch (error) {
        console.error('Error fetching event feedback:', error);
        throw error;
    }
};
