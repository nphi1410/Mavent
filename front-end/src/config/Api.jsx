import axios from 'axios';
import React from 'react'

const Api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export default Api