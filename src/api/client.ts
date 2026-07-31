import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3198/api",
});

// attach the session token to every outgoing request, if we have one
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if the server says the session is invalid/expired, clear it and bounce to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
