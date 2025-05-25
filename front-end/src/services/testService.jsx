import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

export const getGreeting = () => api.get("/greeting");

export const submitExample = (data) => api.post("/submit", data);
