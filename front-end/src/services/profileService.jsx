import axios from "axios";

const api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export const getUserProfile = () => api.get("/user/profile");

export const updateProfile = (data) => api.put("/user/profile", data);

export const uploadAvatar = (formData) => api.post("/user/avatar", formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getAllAccounts = () => api.get("/accounts");