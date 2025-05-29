import axios from 'axios';

const API_URL = 'http://localhost:8080/api/events';

//Lấy toàn bộ danh sách sự kiện
export const getEvents = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // array of EventDTO
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

//Lấy thông tin 1 sự kiện theo ID
export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data; // single EventDTO
    } catch (error) {
        console.error(`Error fetching event with ID ${id}:`, error);
        return null;
    }
};
