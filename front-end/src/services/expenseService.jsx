import axios from "axios";

// Đảm bảo BASE_URL khớp với địa chỉ backend của bạn
const BASE_URL = "http://localhost:8080/api/expenses";

/**
 * Lấy tổng số tiền chi tiêu của một sự kiện cụ thể.
 * @param {number} eventId ID của sự kiện.
 * @returns {Promise<object>} Dữ liệu tổng chi tiêu.
 */
export const fetchTotalExpenseByEventId = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/total-by-event/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy tổng chi tiêu theo sự kiện:", error);
        throw error;
    }
};

/**
 * Lấy chi tiêu theo danh mục cho một sự kiện cụ thể.
 * @param {number} eventId ID của sự kiện.
 * @returns {Promise<Array<object>>} Danh sách chi tiêu theo danh mục.
 */
export const fetchExpensesByCategoryForEvent = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/by-category/event/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiêu theo danh mục:", error);
        throw error;
    }
};

/**
 * Lấy chi tiêu theo phòng ban cho một sự kiện cụ thể.
 * @param {number} eventId ID của sự kiện.
 * @returns {Promise<Array<object>>} Danh sách chi tiêu theo phòng ban.
 */
export const fetchExpensesByDepartmentForEvent = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/by-department/event/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiêu theo phòng ban:", error);
        throw error;
    }
};

/**
 * Lấy các phương thức thanh toán duy nhất cho một sự kiện cụ thể.
 * @param {number} eventId ID của sự kiện.
 * @returns {Promise<Array<string>>} Danh sách các phương thức thanh toán.
 */
export const fetchDistinctPaymentMethodsByEventId = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/payment-methods/event/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy các phương thức thanh toán:", error);
        throw error;
    }
};

/**
 * Lấy số lượng chi tiêu theo trạng thái cho một sự kiện cụ thể.
 * @param {number} eventId ID của sự kiện.
 * @returns {Promise<Array<object>>} Danh sách số lượng chi tiêu theo trạng thái.
 */
export const fetchExpenseCountByStatusForEvent = async (eventId) => {
    try {
        const response = await axios.get(`${BASE_URL}/count-by-status/event/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy số lượng chi tiêu theo trạng thái:", error);
        throw error;
    }
};