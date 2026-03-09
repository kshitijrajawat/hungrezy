import axios from "axios";

const API = axios.create({
  baseURL: "/api/v1",
});

export const DIRECT_API = axios.create({
  baseURL: "https://api.kshitijrajawat.in/api/v1",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = token;
  }
  return config;
});

DIRECT_API.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    if (token) config.headers.Authorization = token;
  }
  return config;
});

export default API;
