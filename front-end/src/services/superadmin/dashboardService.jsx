// src/services/dashboardService.jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/dashboard';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getDashboardMetrics = async () => {
    try {
        const response = await apiClient.get(''); // gọi đến baseURL ("/api/dashboard")

        // Đảm bảo response có data và các field cần thiết
        const { totalEvents, totalAccounts, totalUpcomingEvents, totalOngoingEvents } = response.data;

        return {
            totalEvents: totalEvents || 0,
            totalAccounts: totalAccounts || 0,
            totalUpcomingEvents: totalUpcomingEvents || 0,
            totalOngoingEvents: totalOngoingEvents || 0,
        };
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        if (error.response) {
            console.error("Error data:", error.response.data);
        }

        // Trả về giá trị mặc định để tránh lỗi render phía frontend
        return {
            totalEvents: 0,
            totalAccounts: 0,
            totalUpcomingEvents: 0,
            totalOngoingEvents: 0,
        };
    }
};
