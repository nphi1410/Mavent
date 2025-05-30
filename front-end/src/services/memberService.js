import axiosInstance from '../config/axios';

// Debug: Log the base URL being used
console.log('Axios instance base URL:', axiosInstance.defaults.baseURL);

// Member API service - chỉ quản lý member, không liên quan đến event management
const memberService = {
  // Lấy danh sách members của một event với phân trang và filter
  getMembers: async (eventId, params = {}) => {
    try {
      console.log('memberService.getMembers called with:', { eventId, params });
      
      const queryParams = new URLSearchParams();
      queryParams.append('eventId', eventId);
      
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      
      // Map department name to ID if needed (for now keep as string, backend should handle)
      if (params.department) queryParams.append('department', params.department);
      
      // Map status to backend format
      if (params.status) {
        const statusValue = params.status.toLowerCase() === 'active' ? 'active' : 'inactive';
        queryParams.append('status', statusValue);
      }
      
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);

      const url = `/api/members?${queryParams.toString()}`;
      console.log('Calling API URL:', url);
      console.log('Full URL will be:', axiosInstance.defaults.baseURL + url);
      
      const response = await axiosInstance.get(url);
      console.log('Raw API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  // Lấy chi tiết một member
  getMemberDetails: async (eventId, accountId) => {
    try {
      const response = await axiosInstance.get(`/api/members/${eventId}/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching member details:`, error);
      throw error;
    }
  },

  // Cập nhật thông tin member (role, department, status)
  updateMember: async (memberData) => {
    try {
      console.log('memberService.updateMember called with:', memberData);
      
      // Transform frontend data to backend DTO format
      const isActive = memberData.isActive !== undefined ? Boolean(memberData.isActive) : (memberData.status === 'Active');
      
      console.log(`Status conversion: status=${memberData.status}, isActive=${memberData.isActive} → final isActive=${isActive}`);
      
      const updateRequest = {
        eventId: memberData.eventId,
        accountId: memberData.accountId,
        eventRole: memberData.role || memberData.eventRole,
        departmentId: memberData.departmentId,
        // Always include isActive field to ensure it's sent to backend (forcing boolean type)
        isActive: isActive,
        reason: memberData.reason || 'Updated by admin'
      };
      
      console.log('Final update request with isActive:', updateRequest);
      
      console.log('Sending update request:', updateRequest);
      const response = await axiosInstance.put('/api/members', updateRequest);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  // Ban/unban member
  banMember: async (banData) => {
    try {
      console.log('memberService.banMember called with data:', banData);
      
      // Ensure required fields are present
      if (!banData.eventId || !banData.accountId) {
        console.error('Missing required fields in banData:', banData);
        throw new Error('Missing required fields for ban operation');
      }
      
      // Make sure isBanned is explicitly a boolean
      banData.isBanned = !!banData.isBanned;
      
      const response = await axiosInstance.patch('/api/members/ban', banData);
      return response.data;
    } catch (error) {
      console.error('Error banning/unbanning member:', error);
      throw error;
    }
  },

  // Thêm member mới vào event (nếu cần)
  addMember: async (memberData) => {
    try {
      const response = await axiosInstance.post('/api/members', memberData);
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  // Xóa member khỏi event
  removeMember: async (eventId, accountId) => {
    try {
      await axiosInstance.delete(`/api/members/${eventId}/${accountId}`);
      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Lấy danh sách departments của một event
  getDepartments: async (eventId) => {
    try {
      console.log('memberService.getDepartments called with eventId:', eventId);
      const response = await axiosInstance.get(`/api/departments?eventId=${eventId}`);
      console.log('Departments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Return mock data if API is not available
      return {
        success: true,
        data: [
          { departmentId: 1, name: 'Marketing' },
          { departmentId: 2, name: 'HR' },
          { departmentId: 3, name: 'IT' },
          { departmentId: 4, name: 'Finance' },
          { departmentId: 5, name: 'Sales' }
        ]
      };
    }
  }
};

export default memberService;
