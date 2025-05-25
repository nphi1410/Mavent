import axios from "axios";

const api = axios.create({
    baseURL: "https://demo-deployment-latest-p1k7.onrender.com/api",
    withCredentials: true,
});

export const getGreeting = () => api.get("/greeting");

export const submitExample = (data) => api.post("/submit", data);
