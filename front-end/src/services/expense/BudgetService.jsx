import Api from "../../config/Api.jsx";


export const getBudgetByEventId = async (eventId) => {
    try {
        
        const response = await Api.get(`/event/${eventId}/expenses/budget`);
        return response.data;
    } catch (error) {
        console.error("Error fetching budget by event ID:", error);
        throw error;
    }
}