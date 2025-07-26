// src/services/incomeService.jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/income'; // Đảm bảo URL này khớp với backend của bạn

/**
 * Hàm trợ giúp để xử lý lỗi phản hồi API từ axios.
 * @param {Error} error - Đối tượng lỗi từ axios.
 * @returns {Promise<any>} - Ném lỗi đã được định dạng.
 */
const handleError = (error) => {
    if (error.response) {
        // Lỗi từ server (ví dụ: 4xx, 5xx status codes)
        console.error('Lỗi phản hồi từ server:', error.response.data);
        throw new Error(error.response.data.message || `Lỗi ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
        // Yêu cầu được gửi nhưng không nhận được phản hồi (ví dụ: mạng không khả dụng)
        console.error('Không nhận được phản hồi từ server:', error.request);
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
        // Lỗi trong quá trình thiết lập yêu cầu
        console.error('Lỗi thiết lập yêu cầu:', error.message);
        throw new Error('Có lỗi xảy ra khi thiết lập yêu cầu: ' + error.message);
    }
};

/**
 * Lấy tổng quan thu nhập cho một sự kiện cụ thể.
 * @param {number} eventId - ID của sự kiện.
 * @param {string} dateRange - Phạm vi ngày ("all", "30", "7", "today").
 * @returns {Promise<Object>} - Dữ liệu tổng quan thu nhập.
 */
export const getIncomeOverview = async (eventId, dateRange) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/overview/${eventId}`, {
            params: { dateRange } // axios tự động xử lý params
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Lấy danh sách chi tiết các mục thu nhập cho một sự kiện cụ thể.
 * @param {number} eventId - ID của sự kiện.
 * @returns {Promise<Array>} - Danh sách các mục thu nhập chi tiết.
 */
export const getIncomesListByEventId = async (eventId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/event/${eventId}/list`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Tạo một mục thu nhập mới.
 * @param {Object} incomeData - Dữ liệu mục thu nhập để tạo.
 * @returns {Promise<Object>} - Mục thu nhập đã tạo.
 */
export const createIncome = async (incomeData) => {
    try {
        const response = await axios.post(API_BASE_URL, incomeData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Cập nhật một mục thu nhập hiện có.
 * @param {number} incomeId - ID của mục thu nhập cần cập nhật.
 * @param {Object} incomeData - Dữ liệu cập nhật cho mục thu nhập.
 * @returns {Promise<Object>} - Mục thu nhập đã cập nhật.
 */
export const updateIncome = async (incomeId, incomeData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${incomeId}`, incomeData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Xóa một mục thu nhập.
 * @param {number} incomeId - ID của mục thu nhập cần xóa.
 * @returns {Promise<void>}
 */
export const deleteIncome = async (incomeId) => {
    try {
        await axios.delete(`${API_BASE_URL}/${incomeId}`);
    } catch (error) {
        handleError(error);
    }
};
