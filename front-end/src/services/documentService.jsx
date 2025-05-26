import axios from "axios";

const api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export const getImages = () => api.get("/document");
