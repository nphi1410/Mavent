// eventTagService.jsx - Service để xử lý API calls liên quan đến tags
import Api from "../config/Api";

// Lấy tất cả tags có sẵn trong hệ thống
export const getAllTags = async () => {
    try {
        const response = await Api.get('/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching all tags:', error);
        throw error;
    }
};

// Lấy tags của một event cụ thể
export const getTagsByEventId = async (eventId) => {
    try {
        const response = await Api.get('/tags', {
            params: { eventId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tags by event ID:', error);
        throw error;
    }
};