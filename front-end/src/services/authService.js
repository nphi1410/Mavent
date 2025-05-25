import axiosInstance from "../config/axios";

// Định nghĩa các service liên quan đến xác thực
const authService = {
  login: async (params) => {
    const response = await axiosInstance.post('/auth/login', params);
    return response.data;
  },
  
  register: async (params) => {
    const response = await axiosInstance.post('/auth/register', params);
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
  },
  
  verifyToken: async (token) => {
    const response = await axiosInstance.post('/auth/verify', { token });
    return response.data;
  },
};

export default authService;