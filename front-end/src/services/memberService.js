import Api from '../config/Api';

// Debug: Log the base URL being used only in development environment
if (process.env.NODE_ENV === 'development') {
  //  // console.log('Api instance base URL:', Api.defaults.baseURL);
}

// Member API service - chỉ quản lý member, không liên quan đến event management
const memberService = {
  // Lấy danh sách members của một event với phân trang và filter
  getMembers: async (eventId, params = {}, signal = undefined) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // console.log('memberService.getMembers called with:', { eventId, params });
      }
      
      const queryParams = new URLSearchParams();
      queryParams.append('eventId', eventId);
      
      // Only append search parameter if it's not empty after trimming
      if (params.search && params.search.trim()) {
        const trimmedSearch = params.search.trim();
        queryParams.append('search', trimmedSearch);
      }
      
      if (params.role) {
        // Ensure role matches the format expected by backend enum
        const normalizedRole = params.role.trim().toUpperCase();
        queryParams.append('role', normalizedRole);
      }
      
      // Handle department filter - could be ID or name
      if (params.department !== undefined && params.department !== '') {
        // Ensure department is treated as numeric if possible
        const departmentValue = Number.isInteger(Number(params.department)) && Number(params.department) > 0 ? 
          Number(params.department) : params.department.toString().trim();
        queryParams.append('department', departmentValue);
        // console.log('Adding department parameter:', departmentValue, 'Type:', typeof departmentValue);
      } else {
        // console.log('No department filter applied');
      }
      
      // Map status to backend format - ensure consistent casing
      if (params.status) {
        // Normalize status to either 'active' or 'inactive' (lowercase)
        const normalizedStatus = params.status.toLowerCase().trim() === 'active' ? 'active' : 'inactive';
        queryParams.append('status', normalizedStatus);
        // console.log('Adding status parameter:', normalizedStatus);
      }
      
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);

      const url = `/members?${queryParams.toString()}`;
        // Enhanced logging for easier debugging
      // console.log('Calling API with parameters:', {
      //   eventId: params.eventId,
      //   search: params.search,
      //   role: params.role,
      //   department: params.department,
      //   status: params.status,
      //   page: params.page,
      //   size: params.size
      // });
      // console.log('Full API URL:', url);
      
      // Pass AbortController signal to the request
      const response = await Api.get(url, { signal });
      
      return response.data;
    } catch (error) {
      // Properly handle AbortError vs other errors
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || 
          (error.message && error.message.includes('canceled'))) {
        // console.log('Request was cancelled');
        throw { name: 'AbortError', message: 'Request aborted' };
      }
      
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  // Lấy chi tiết một member với AbortController support
  getMemberDetails: async (eventId, accountId, signal = undefined) => {
    try {
      const response = await Api.get(`/members/${eventId}/${accountId}`, { signal });
      return response.data;
    } catch (error) {
      // Handle abort error separately
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || 
          (error.message && error.message.includes('canceled'))) {
        // console.log('Member details request was cancelled');
        throw { name: 'AbortError', message: 'Request aborted' };
      }
      
      console.error(`Error fetching member details:`, error);
      throw error;
    }
  },

  // Cập nhật thông tin member (role, department, status)
  updateMember: async (memberData) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // console.log('memberService.updateMember called with:', memberData);
      }
      
      // Transform frontend data to backend DTO format
      const isActive = memberData.isActive !== undefined ? Boolean(memberData.isActive) : (memberData.status === 'Active');
      
      if (process.env.NODE_ENV === 'development') {
        // console.log(`Status conversion: status=${memberData.status}, isActive=${memberData.isActive} → final isActive=${isActive}`);
      }
      
      const updateRequest = {
        eventId: memberData.eventId,
        accountId: memberData.accountId,
        eventRole: memberData.role || memberData.eventRole,
        departmentId: memberData.departmentId,
        // Always include isActive field to ensure it's sent to backend (forcing boolean type)
        isActive: isActive,
        reason: memberData.reason || 'Updated by admin'
      };
      
      // console.log('Final update request with isActive:', updateRequest);
      
      // console.log('Sending update request:', updateRequest);
      const response = await Api.put('/members', updateRequest);
      // console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  // Ban/unban member
  banMember: async (banData) => {
    try {
      // console.log('memberService.banMember called with data:', banData);
      
      // Ensure required fields are present
      if (!banData.eventId || !banData.accountId) {
        console.error('Missing required fields in banData:', banData);
        throw new Error('Missing required fields for ban operation');
      }
      
      // Make sure isBanned is explicitly a boolean
      banData.isBanned = !!banData.isBanned;

      const updateRequest = {
      eventId: banData.eventId,
      accountId: banData.accountId,
      // Ban/unban tương đương với việc set isActive = !isBanned
      isActive: !banData.isBanned,
      // Giữ nguyên role hiện tại
      eventRole: banData.currentRole || "MEMBER",
      // Thêm reason
      reason: banData.reason || (banData.isBanned ? "Unbanned by admin" : "Banned by admin")
    };
      
      const response = await Api.put('/members', updateRequest);
      return response.data;
    } catch (error) {
      console.error('Error banning/unbanning member:', error);
      throw error;
    }
  },

  // Thêm member mới vào event (nếu cần)
  addMember: async (memberData) => {
    try {
      const response = await Api.post('/members', memberData);
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  // Xóa member khỏi event
  removeMember: async (eventId, accountId) => {
    try {
      await Api.delete(`/members/${eventId}/${accountId}`);
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Lấy danh sách departments của một event
  getDepartments: async (eventId, signal = undefined) => {
    try {
      const response = await Api.get(`/departments?eventId=${eventId}`, { signal });
      return response.data;
    } catch (error) {
      // Handle abort errors separately
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || 
          (error.message && error.message.includes('canceled'))) {
        // console.log('Departments request was cancelled');
        throw { name: 'AbortError', message: 'Request aborted' };
      }
      
      console.error('Error fetching departments:', error);
      throw error;
    }
  },
  
  // Get department by ID
  getDepartmentById: async (departmentId, signal = undefined) => {
    try {
      const response = await Api.get(`/departments/${departmentId}`, { signal });
      return response.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw { name: 'AbortError', message: 'Request aborted' };
      }
      console.error('Error fetching department by ID:', error);
      throw error;
    }
  },
  
  // Find departments by name
  findDepartmentsByName: async (eventId, name, signal = undefined) => {
    try {
      const response = await Api.get(`/departments/search?eventId=${eventId}&name=${encodeURIComponent(name)}`, { signal });
      return response.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw { name: 'AbortError', message: 'Request aborted' };
      }
      console.error('Error searching departments by name:', error);
      throw error;
    }
  },
};

export default memberService;
