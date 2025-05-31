import axios from 'axios';
import Api from "../config/Api";


export const getUserProfile = () => {
  return Api.get('/user/profile');
};

export const updateProfile = (data) => {
  return Api.put('/user/profile', data);
};

export const uploadAvatar = (formData) => {
  return Api.post('/user/avatar', formData, {
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