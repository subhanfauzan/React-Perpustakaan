// /src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// selalu sisipkan Bearer token dari storage
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// handling 401 global (opsional redirect)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login"; // aktifkan kalau mau auto-redirect
    }
    return Promise.reject(err);
  }
);

export default api;
