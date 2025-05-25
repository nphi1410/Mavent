// filepath: d:\FULearning\SU25\SWP391\Mavent\front-end\src\services\testService.js
import axios from "../config/axios";

export const getGreeting = () => axios.get("/greeting");

export const submitExample = (data) => axios.post("/submit", data);
