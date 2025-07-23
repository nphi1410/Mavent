import Api from "../../config/Api.jsx";

export const getExpenseCategories = async (eventId) => {
    try {
        const response = await Api.get(`/event/${eventId}/expenses/expense-categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching expense categories:", error);
        throw error;
    }
}

export const getExpenseById = async (eventId, expenseId) => {
    try {
        const response = await Api.get(`/event/${eventId}/expenses/${expenseId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching expense by ID:", error);
        throw error;
    }
}

// Get all expenses for an event (admin access)
export const getAllExpenses = async (eventId) => {
    try {
        const response = await Api.get(`/event/${eventId}/expenses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all expenses:", error);
        throw error;
    }
}

// Get expenses by account (for member view)
export const getExpensesByAccount = async (eventId, accountId) => {
    try {
        const response = await Api.get(`/event/${eventId}/expenses/account/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching expenses by account ID:", error);
        throw error;
    }
}


export const createExpenseRequest = async (eventId, expenseData, files) => {
    try{
        if (!eventId || isNaN(eventId)) {
            throw new Error(`Invalid eventId: ${eventId}`);
        }
        
   
        const formData = new FormData();
        
   
        const dataBlob = new Blob([JSON.stringify(expenseData)], {
            type: 'application/json'
        });
        formData.append('data', dataBlob);
        console.log('Added data part with JSON blob:', JSON.stringify(expenseData));
        
       
        if (files && files.length > 0) {
            files.forEach((file) => {
                // Kiểm tra lại loại file trước khi gửi
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (validImageTypes.includes(file.type) && file.size <= 10 * 1024 * 1024) {
                    formData.append('files', file);
                    console.log(`Added file: ${file.name}, size: ${file.size}, type: ${file.type}`);
                } else {
                    console.warn(`Skipping invalid file: ${file.name}, size: ${file.size}, type: ${file.type}`);
                }
            });
        }
        
        // Tạo URL endpoint
        const endpoint = `/event/${eventId}/expenses/with-attachments`;
        console.log(`Sending request to: ${endpoint}`);
        

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // Thời gian chờ dài hơn cho việc upload file
            timeout: 60000 // 60 seconds
        };
        
        const response = await Api.post(endpoint, formData, config);
        return response.data;
    } catch (error) {
        console.error("Error creating expense request:", error);
        // Log chi tiết hơn về lỗi
        if (error.response) {
            console.error("Server error response:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error("No response received from server", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
        throw error;
    }
}

export const updateExpenseStatus = async (eventId, expenseId, updateStatus) => {
    try {
        const response = await Api.put(`/event/${eventId}/expenses/${expenseId}/status`, updateStatus);
        return response.data;
    } catch (error) {
        console.error("Error updating expense status:", error);
        throw error;
    }
}
