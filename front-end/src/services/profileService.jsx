import axios from 'axios';
import Api from "../config/Api";

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/session
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getUserProfile = () => {
  return axiosInstance.get('/user/profile');
};

export const updateProfile = (data) => {
  return axiosInstance.put('/user/profile', data);
};

export const uploadAvatar = (formData) => {
  return axiosInstance.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getUserEvents = async () => {
  try {
    const response = await axiosInstance.get('/user/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error; // Throw error để component có thể handle
  }
};