import Api from "../config/Api";

// Service cung cấp các hàm gọi API liên quan đến người dùng và sự kiện

// Xử lý lỗi xác thực
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

  if (error.response?.status === 403) {
    console.error("Forbidden access:", error.response?.data);
    throw new Error("You do not have permission to perform this action");
  }

  // Thêm kiểm tra cho các lỗi khác
  if (error.response?.status === 400) {
    console.error("Bad request:", error.response?.data);
    throw new Error("Invalid data provided");
  }

  throw error;
};

// export const getUserProfile = async () => {
//   try {
//     console.log('Fetching user profile...');
//     const response = await Api.get('/user/profile');
//     console.log('Profile response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error in getUserProfile:', error);
//     handleAuthError(error);
//   }
// };
export const getUserProfile = async ({ requireAuth = false } = {}) => {
  try {
    // console.log("Fetching user profile...");
    const response = await Api.get("/user/profile");
    // console.log("Profile response:", response.data);
    return response.data; // Return in expected format with data property

    
  } catch (error) {
    console.error("Error in getUserProfile:", error);

    if (requireAuth) {
      handleAuthError(error); // will redirect
    }

    // return null instead of throwing to prevent crash
    return null;
  }
};

export const updateProfile = async (data) => {
  try {
    console.log("Sending update profile request with data:", data);
    const response = await Api.put("/user/profile", data);
    console.log("Update profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateProfile:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    // Log request details
    console.log("Request details:", {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.config?.data,
    });
    handleAuthError(error);
  }
};

export const uploadAvatar = async (formData) => {
  try {
    const response = await Api.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const getUserEvents = async () => {
  try {
    const response = await Api.get("/user/events");
    return response.data;
  } catch (error) {
    handleAuthError(error);
    console.error("Error fetching user events:", error);
  }
};

export const getUserTasks = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      status: params.status || "",
      priority: params.priority || "",
      keyword: params.keyword || "",
      sortOrder: params.sortOrder || "",
      eventName: params.eventName || "",
    }).toString();

    const response = await Api.get(`/user/tasks?${queryParams}`);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    console.error("Error fetching user tasks:", error);
  }
};

// Add this new function to fetch task details
export const getTaskDetails = async (taskId) => {
  try {
    const response = await Api.get(`/user/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task details:", error);
    handleAuthError(error);
    // Return null or throw an error depending on how you want to handle it
    return null;
  }
};

export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    // Thay đổi từ /user/tasks/ thành /api/user/tasks/ nếu cần
    const response = await Api.patch(`user/tasks/${taskId}/status`, {
      status: newStatus
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    handleAuthError(error);
    throw error;
  }
};

// Thêm hàm này vào cuối file profileService.jsx

export const getTaskAttendees = async (taskId) => {
  try {
    const response = await Api.get(`/user/tasks/${taskId}/attendees`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task attendees:", error);
    handleAuthError(error);
    return null;
  }
};

// Thêm hàm tạo task
export const createTask = async (taskData) => {
  try {
    const response = await Api.post('/user/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    handleAuthError(error);
    throw error;
  }
};

export const getUserRoleInEvent = async (eventId) => {
  try {
    // Đơn giản hóa: Chỉ gọi API và trả về dữ liệu
    const response = await Api.get(`/events/${eventId}/members/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user role in event:", error);
    handleAuthError(error);
    return null;
  }
};

export const getEventMembers = async (eventId) => {
  try {
    const response = await Api.get(`/events/${eventId}/members`);
    
    // Đơn giản hóa: Chỉ trả về response.data thay vì xử lý nhiều trường hợp
    return response.data;
    
    return adaptedData;
  } catch (error) {
    console.error("Error fetching event members:", error);
    handleAuthError(error);
    return [];
  }
};

export const updateTaskAttendees = async (taskId, attendees) => {
  try {
    const response = await Api.put(`/user/tasks/${taskId}/attendees`, { attendees });
    return response.data;
  } catch (error) {
    console.error("Error updating task attendees:", error);
    handleAuthError(error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await Api.put(`/user/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    handleAuthError(error);
    throw error;
  }
};

export const getEventDepartments = async (eventId) => {
  try {
    const response = await Api.get(`/events/${eventId}/departments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event departments:", error);
    handleAuthError(error);
    throw error;
  }
};

// Lấy thông tin một thành viên cụ thể
export const getEventMember = async (eventId, accountId) => {
  try {
    const response = await Api.get(`/events/${eventId}/members/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event member details:", error);
    handleAuthError(error);
    return null;
  }
};

export const getTaskFeedback = async (taskId) => {
  try {
    console.log("Fetching task feedback for taskId:", taskId);
    
    const response = await Api.get(`/user/tasks/${taskId}/feedback`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task feedback:", error);
    handleAuthError(error);
    throw error;
  }
};

export const createTaskFeedback = async (taskId, comment) => {
  try {
    const response = await Api.post(`/user/tasks/${taskId}/feedback`, { comment });
    return response.data;
  } catch (error) {
    console.error("Error creating task feedback:", error);
    handleAuthError(error);
    throw error;
  }
};

export const getTaskDocuments = async (taskId) => {
  try {
    const response = await Api.get(`/user/tasks/${taskId}/documents`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task documents:", error);
    handleAuthError(error);
    throw error;
  }
};

export const updateTaskDocuments = async (taskId, documentIds) => {
  try {
    const response = await Api.put(`/user/tasks/${taskId}/documents`, { 
      documentIds: documentIds 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task documents:", error);
    handleAuthError(error);
    throw error;
  }
};

export const updateAttendeeStatus = async (taskId, accountId, status, reason = null) => {
  try {
    const requestBody = { status };
    if (reason) {
      requestBody.reason = reason;
    }
    
    const response = await Api.patch(
      `/user/tasks/${taskId}/attendees/${accountId}/status`, 
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error updating attendee status:", error);
    handleAuthError(error);
    throw error;
  }
};