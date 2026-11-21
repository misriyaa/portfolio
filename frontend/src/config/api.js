import axios from "axios";

// In production, when hosted on the same domain (Vercel Multi-Service), API requests can be relative ("").
// Only fall back to localhost if running in local browser environment without an explicit env variable.
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const defaultBaseUrl = isLocalhost ? "http://localhost:5000" : "";

const rawBaseUrl =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKED_URL ||
  defaultBaseUrl;

// Remove any trailing slash to avoid double slashes in request URLs
export const API_BASE_URL = (rawBaseUrl || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Universal Image URL resolver for frontend components:
 * - If image is already a full Cloudinary HTTPS URL, returns it directly.
 * - If image is a local filename, prepends API_BASE_URL/uploads/ or /uploads/.
 * - If empty, returns fallback.
 */
export const resolveImageUrl = (imagePath, fallback = "") => {
  if (!imagePath || typeof imagePath !== "string") return fallback;
  const trimmed = imagePath.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const clean = trimmed.replace(/^[/\\]+/, "").replace(/^uploads[/\\]+/, "");
  return API_BASE_URL ? `${API_BASE_URL}/uploads/${clean}` : `/uploads/${clean}`;
};

export default api;
