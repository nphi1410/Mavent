import axios from "axios";
import React from "react";
import { env } from "./env";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || env.API_URL + '/api',
  withCredentials: true,
  timeout: 60000, 
  headers: {
    "Content-Type": "application/json",
  },
});
Api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;
