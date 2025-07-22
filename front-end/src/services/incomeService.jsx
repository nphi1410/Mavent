// incomeService.jsx
import axios from 'axios'; // Import axios

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
 * Lấy tất cả các mục thu nhập.
 * (Có thể không cần thiết nếu bạn chỉ dùng overview, nhưng giữ lại cho đầy đủ)
 * @returns {Promise<Array>} - Danh sách các mục thu nhập.
 */
export const getAllIncomes = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Lấy chi tiết một mục thu nhập theo ID.
 * (Có thể không cần thiết nếu bạn chỉ dùng overview, nhưng giữ lại cho đầy đủ)
 * @param {number} incomeId - ID của mục thu nhập.
 * @returns {Promise<Object>} - Chi tiết mục thu nhập.
 */
export const getIncomeById = async (incomeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${incomeId}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Lấy tổng quan thu nhập cho một sự kiện cụ thể theo phạm vi ngày.
 * @param {number} eventId - ID của sự kiện.
 * @param {string} dateRange - Phạm vi ngày (ví dụ: 'all', 'month', 'year').
 * @returns {Promise<Object>} - Dữ liệu tổng quan thu nhập (IncomeResponseDTO).
 */
export const getIncomeOverview = async (eventId, dateRange) => { // Đã thêm eventId
    try {
        const response = await axios.get(`${API_BASE_URL}/overview/${eventId}`, { // Cập nhật URL
            params: { dateRange } // Axios tự động xử lý params
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Phương thức MỚI: Lấy danh sách chi tiết các khoản thu nhập cho một sự kiện cụ thể.
 * @param {number} eventId - ID của sự kiện.
 * @returns {Promise<Array>} - Danh sách các mục nhập thu nhập (IncomeEntryDTO[]).
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
 * (Giữ lại nếu bạn có chức năng tạo thu nhập riêng lẻ)
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
 * (Giữ lại nếu bạn có chức năng cập nhật thu nhập riêng lẻ)
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
 * (Giữ lại nếu bạn có chức năng xóa thu nhập riêng lẻ)
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