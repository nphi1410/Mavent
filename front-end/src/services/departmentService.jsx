import Api from "../config/Api";

// Lấy danh sách phòng ban theo sự kiện
export const getDepartmentsByEventId = async (eventId) => {
  try {
    const response = await Api.get(`/events/${eventId}/departments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching departments for event ID ${eventId}:`, error);
    return [];
  }
};

// Lấy phòng ban theo ID
export const getDepartmentById = async (eventId, departmentId) => {
  try {
    const response = await Api.get(`/events/${eventId}/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${departmentId}:`, error);
    return null;
  }
};
