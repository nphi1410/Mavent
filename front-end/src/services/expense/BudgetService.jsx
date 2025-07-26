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

export const getRemainingBudget = async (eventId) => {
    try {
        const budget = await getBudgetByEventId(eventId);
        if (!budget) return null;
        
        const totalAmount = budget.totalAmount || 0;
        const spentAmount = budget.spentAmount || 0;
        
        return totalAmount - spentAmount;
    } catch (error) {
        console.error("Error calculating remaining budget:", error);
        throw error;
    }
}