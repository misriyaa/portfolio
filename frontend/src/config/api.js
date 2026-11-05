import axios from "axios";

// Automatically support both VITE_BACKEND_URL and VITE_BACKED_URL
const rawBaseUrl =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKED_URL ||
  "http://localhost:5000";

// Remove any trailing slash to avoid double slashes in request URLs
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default api;

