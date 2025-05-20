import axiosInstance from "../config/axios";

// Định nghĩa interface cho user profile
interface UserProfileUpdateParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// Định nghĩa các service liên quan đến người dùng
const userService = {
  // Lấy thông tin profile của user hiện tại
  getCurrentUserProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },
  
  // Cập nhật thông tin profile
  updateProfile: async (params: UserProfileUpdateParams) => {
    const response = await axiosInstance.put('/users/profile', params);
    return response.data;
  },
  
  // Đổi mật khẩu
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await axiosInstance.post('/users/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  },
  
  // Lấy danh sách user (dành cho admin)
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Lấy thông tin user theo id (dành cho admin)
  getUserById: async (id: number) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },
};

export default userService;
