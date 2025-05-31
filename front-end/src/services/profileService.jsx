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
