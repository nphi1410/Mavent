import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/event';

// Hàm fetch feedback theo eventId
export const getEventFeedbackByEventId = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${eventId}/feedback`);
        return response.data;
    } catch (error) {
        console.error('Error fetching event feedback:', error);
        throw error;
    }
};

export const getEndedParticipantEvents = async (accountId, pageable) => {
    try {
        const res = await Api.get(`/events/attending/${accountId}`, {
            params: pageable,
        });
        return res.data?.content || [];
    } catch (err) {
        console.error("Error fetching ended participant events:", err);
        return [];
    }
};

export const createEventFeedback = async (eventId, feedbackData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${eventId}/create-feedback`, feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error creating event feedback:', error);
        throw error.response?.data?.message || 'Lỗi không xác định';
    }
};
