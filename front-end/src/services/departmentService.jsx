import Api from "../config/Api";

// Lấy tất cả phòng ban của một sự kiện
export const getDepartmentsByEventId = async (eventId) => {
  try {
    const response = await Api.get(`/events/${eventId}/departments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching departments for event ID ${eventId}:`, error);
    throw error;
  }
};

// Lấy chi tiết phòng ban theo ID
export const getDepartmentById = async (eventId, departmentId) => {
  try {
    // Ensure departmentId is not undefined and is a valid number
    if (departmentId === undefined || departmentId === null || departmentId === 'undefined') {
      throw new Error('Invalid department ID');
    }
    
    const response = await Api.get(`/events/${eventId}/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${departmentId}:`, error);
    throw error;
  }
};

// Thêm phòng ban mới
export const addDepartment = async (eventId, departmentData) => {
  try {
    const response = await Api.post(`/events/${eventId}/departments`, departmentData);
    return response.data;
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
};

// Cập nhật phòng ban
export const updateDepartment = async (eventId, departmentId, departmentData) => {
  try {
    // Ensure departmentId is not undefined and is a valid number
    if (departmentId === undefined || departmentId === null || departmentId === 'undefined') {
      throw new Error('Invalid department ID');
    }
    
    const response = await Api.put(`/events/${eventId}/departments/${departmentId}`, departmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating department with ID ${departmentId}:`, error);
    throw error;
  }
};    // Get the member count for a department using the new endpoint
export const getMemberCount = async (eventId, departmentId) => {
  try {
    // Ensure IDs are valid numbers
    const numericEventId = parseInt(eventId, 10);
    const numericDepartmentId = parseInt(departmentId, 10);
    
    // Call the new endpoint
    const response = await Api.get(`/events/${numericEventId}/departments/${numericDepartmentId}/member-count`);
    
    // The response could be a number directly or an object with a count property
    if (typeof response.data === 'number') {
      return response.data;
    } else if (response.data && typeof response.data.count === 'number') {
      return response.data.count;
    } else if (response.data && typeof response.data.memberCount === 'number') {
      return response.data.memberCount;
    }
    
    // If we can't determine the format, return 0
    return 0;
  } catch (error) {
    console.error(`Error fetching member count for department ID ${departmentId}:`, error);
    // If the API fails, return 0 as fallback
    return 0;
  }
};

// Pre-check if department has members before attempting to delete it
export const checkDepartmentHasMembers = async (eventId, departmentId) => {
  try {
    // Use the new member-count endpoint
    const memberCount = await getMemberCount(eventId, departmentId);
    
    // If there are members, indicate that in the result
    if (memberCount > 0) {
      return {
        hasMembers: true,
        memberCount,
        department: null  // We don't have the full department object here
      };
    }
    
    // If the member count API returns 0, then try to get the department details
    // as a fallback to ensure we have accurate information
    try {
      const department = await getDepartmentById(eventId, departmentId);
      
      // If we got department data, return it along with our member count
      return { 
        hasMembers: false, 
        memberCount: 0,
        department
      };
    } catch (deptError) {
      console.log('Could not fetch department details:', deptError);
      return { 
        hasMembers: false, 
        memberCount: 0,
        department: null
      };
    }
  } catch (error) {
    console.error('Error checking if department has members:', error);
    // If we can't determine, assume no members to allow delete attempt
    return { 
      hasMembers: false, 
      memberCount: 0 
    };
  }
};

// Xóa phòng ban
export const deleteDepartment = async (eventId, departmentId) => {
  try {
    // Ensure departmentId is not undefined and is a valid number
    if (departmentId === undefined || departmentId === null || departmentId === 'undefined') {
      throw new Error('Invalid department ID');
    }
    
    // Make sure we're passing numbers, not strings
    const numericEventId = parseInt(eventId, 10);
    const numericDepartmentId = parseInt(departmentId, 10);
    
    // This pre-check is handled in the component now
    console.log(`Attempting to delete department: eventId=${numericEventId}, departmentId=${numericDepartmentId}`);

    // Check which API structure is used in the backend based on the controller definition
    // From DepartmentController.java: @DeleteMapping("/{departmentId}")
    // Endpoint should be: /events/{eventId}/departments/{departmentId}
    try {
      // Try the API with the standard REST path parameter format
      const response = await Api.delete(`/events/${numericEventId}/departments/${numericDepartmentId}`);
      return response.data;
    } catch (pathError) {
      // Log details about the error for debugging
      console.error('Delete request failed:', {
        url: `/events/${numericEventId}/departments/${numericDepartmentId}`, 
        status: pathError.response?.status,
        error: pathError.message
      });
      
      if (pathError.response && pathError.response.status === 500) {
        // If path parameter format fails with 500, try an alternate format as fallback
        console.log('Attempting alternate API format with query parameters');
        
        // This follows a common pattern where some APIs take departmentId as a query parameter
        try {
          const altResponse = await Api.delete(`/events/${numericEventId}/departments`, {
            params: { departmentId: numericDepartmentId }
          });
          return altResponse.data;
        } catch (altError) {
          console.error('Alternate API format also failed:', altError);
          
          // Get any error messages from the response if available
          let errorMessage = 'Không thể xóa phòng ban.';
          
          if (altError.response?.data?.message) {
            errorMessage = altError.response.data.message;
          } else if (altError.response?.data?.error) {
            errorMessage = altError.response.data.error;
          } else if (altError.response?.status === 500) {
            errorMessage = 'Không thể xóa phòng ban. Lỗi xuất hiện do ràng buộc cơ sở dữ liệu.';
          }
          
          console.log('Server error details:', altError.response?.data);
          throw new Error(errorMessage);
        }
      }
      
      // For other HTTP status error codes, throw the original error
      throw pathError;
    }
  } catch (error) {
    console.error(`Error deleting department with ID ${departmentId}:`, error);
    
    // Enhanced debugging info
    if (error.response) {
      console.log('API error details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.response.config?.url,
          method: error.response.config?.method
        }
      });
    }
    
    // Check for specific error codes
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error('Department not found or already deleted');
      } else if (status === 403) {
        throw new Error('You do not have permission to delete this department');
      } else if (status === 500) {
        // Since we've already tried the alternate format, this is likely a server-side constraint issue
        // Check if the error response contains any detailed message from backend
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error ||
                            'This department cannot be deleted. It may have members or other dependencies that must be removed first.';
                            
        console.log('Server returned error 500 with details:', error.response.data);
        throw new Error(errorMessage);
      }
    }
    
    // Pass through original error if not handled above
    throw error;
  }
};

// Check if department has tasks
export const checkDepartmentHasTasks = async (eventId, departmentId) => {
  try {
    // Make sure we're passing numbers, not strings
    const numericEventId = parseInt(eventId, 10);
    const numericDepartmentId = parseInt(departmentId, 10);
    
    // This would typically call an API endpoint to check for tasks
    // Since we don't have a specific endpoint, we'll use a workaround
    
    try {
      // Try to check if there's an endpoint for task counts
      const response = await Api.get(`/events/${numericEventId}/departments/${numericDepartmentId}/task-count`);
      return {
        hasTasks: response.data > 0,
        taskCount: response.data
      };
    } catch (err) {
      // If that endpoint doesn't exist, assume no tasks
      console.log('No task count endpoint available, returning false');
      return {
        hasTasks: false,
        taskCount: 0
      };
    }
  } catch (error) {
    console.error(`Error checking if department has tasks:`, error);
    // Default to false if we can't check
    return {
      hasTasks: false,
      taskCount: 0
    };
  }
};

// Force delete a department (admin use only - should be used with caution)
export const forceDeleteDepartment = async (eventId, departmentId) => {
  try {
    // Ensure departmentId is not undefined and is a valid number
    if (departmentId === undefined || departmentId === null || departmentId === 'undefined') {
      throw new Error('Invalid department ID');
    }
    
    // Make sure we're passing numbers, not strings
    const numericEventId = parseInt(eventId, 10);
    const numericDepartmentId = parseInt(departmentId, 10);
    
    console.log(`Warning: Attempting to force delete department: eventId=${numericEventId}, departmentId=${numericDepartmentId}`);

    // Try to use a special force delete endpoint if the backend provides one
    try {
      const response = await Api.delete(`/events/${numericEventId}/departments/${numericDepartmentId}/force`);
      return response.data;
    } catch (pathError) {
      // If that fails, try the normal endpoint with a force flag
      try {
        const response = await Api.delete(`/events/${numericEventId}/departments/${numericDepartmentId}`, {
          params: { force: true }
        });
        return response.data;
      } catch (err) {
        console.error('Force delete failed:', err);
        throw new Error('Không thể xóa phòng ban, ngay cả với cờ force. Liên hệ quản trị viên hệ thống.');
      }
    }
  } catch (error) {
    console.error(`Error force deleting department:`, error);
    throw error;
  }
};
