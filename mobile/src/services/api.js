import axios from "axios";
import { API_CONFIG } from "../constants/config";
import { getToken, removeToken, removeUser } from "../utils/storage";

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error adding auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    // Return only the data
    return response.data;
  },
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Clear stored auth data
        await removeToken();
        await removeUser();
        // You can dispatch a logout action here if using Redux/Context
      }

      // Return error data from server
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Network error - no response received
      return Promise.reject({
        error: "NETWORK_ERROR",
        message:
          "Unable to connect to the server. Please check your internet connection.",
      });
    } else {
      // Something else happened
      return Promise.reject({
        error: "UNKNOWN_ERROR",
        message: error.message || "An unexpected error occurred",
      });
    }
  }
);

export default api;
