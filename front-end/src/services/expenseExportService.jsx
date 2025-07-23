// src/services/expenseExportService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/expenses'; // Adjust if your backend runs on a different port or path

export const exportExpensesToExcel = async (eventId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/export/excel/event/${eventId}`, {
            responseType: 'blob', // Important: responseType must be 'blob' to handle binary data
        });
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a link element
        const link = document.createElement('a');
        // Set the download attribute and href
        link.href = window.URL.createObjectURL(blob);
        link.download = `expenses_event_${eventId}.xlsx`; // You can dynamically name the file
        // Append to the document body and click it
        document.body.appendChild(link);
        link.click();
        // Clean up: remove the link and revoke the object URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        return true;
    } catch (error) {
        console.error('Error exporting expenses to Excel:', error);
        throw error;
    }
};