import axiosInstance from '../config/axios';

// Debug: Log the base URL being used
console.log('Axios instance base URL:', axiosInstance.defaults.baseURL);

// Member API service - chỉ quản lý member, không liên quan đến event management
const memberService = {
  // Lấy danh sách members của một event với phân trang và filter
  getMembers: async (eventId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('eventId', eventId);
      
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.department) queryParams.append('department', params.department);
      if (params.status) queryParams.append('status', params.status);
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);

      const url = `/api/members?${queryParams.toString()}`;
      console.log('Calling API URL:', url);
      console.log('Full URL will be:', axiosInstance.defaults.baseURL + url);
      
      const response = await axiosInstance.get(url);
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

  // Cập nhật thông tin member (role, department)
  updateMember: async (memberData) => {
    try {
      const response = await axiosInstance.put('/api/members', memberData);
      return response.data;
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  // Ban/unban member
  banMember: async (banData) => {
    try {
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
  }
};

export default memberService;
