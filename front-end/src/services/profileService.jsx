import axios from "axios";

const api = axios.create({
    baseURL: "https://demo-deployment-latest-p1k7.onrender.com/api",
    withCredentials: true,
});

export const getUserProfile = () => api.get("/user/profile");

export const updateProfile = (data) => api.put("/user/profile", data);

export const uploadAvatar = (formData) => api.post("/user/avatar", formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});