import axios from "axios";

const api = axios.create({
  // baseURL: "https://eventzo-1-2c7m.onrender.com/api",
  baseURL: "https://eventzo-1-ab77.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;