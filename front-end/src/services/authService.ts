import axiosInstance from "../config/axios";

// Định nghĩa interface cho các tham số đăng nhập
interface LoginParams {
  username: string;
  password: string;
}

// Định nghĩa interface cho các tham số đăng ký
interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

// Định nghĩa các service liên quan đến xác thực
const authService = {
  login: async (params: LoginParams) => {
    const response = await axiosInstance.post('/auth/login', params);
    return response.data;
  },
  
  register: async (params: RegisterParams) => {
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
  
  verifyToken: async (token: string) => {
    const response = await axiosInstance.post('/auth/verify', { token });
    return response.data;
  },
};

export default authService;
