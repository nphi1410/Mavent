import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export const getGreeting = () => api.get("/greeting");

export const submitExample = (data) => api.post("/submit", data);
