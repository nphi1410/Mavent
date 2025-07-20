import Api from "../config/Api";

const handleAuthError = (error) => {
  console.error("Auth Error:", {
    status: error.response?.status,
    data: error.response?.data
  });

  if (error.response?.status === 401) {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    window.location.href = "/login";
    throw new Error("Authentication required");
  }

  throw error;
};

export const getUserNotifications = async () => {
  try {
    const response = await Api.get(`/user/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    handleAuthError(error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await Api.put(`/user/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    handleAuthError(error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await Api.put(`/user/notifications/read-all`);
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    handleAuthError(error);
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await Api.get(`/user/notifications/unread-count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    handleAuthError(error);
    return 0;
  }
};

// Thêm các hàm mới để lấy thông tin chi tiết
export const getTaskById = async (taskId) => {
  try {
    const response = await Api.get(`/user/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await Api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const getRequestById = async (requestId) => {
  try {
    const response = await Api.get(`/events/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
};