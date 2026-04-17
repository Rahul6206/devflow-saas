import axios from "axios";
import useAuthStore from "../store/authStore";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach access token to every request
API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 errors (token expired)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (!refreshToken) {
           useAuthStore.getState().logout();
           window.location.href = "/login";
           return Promise.reject(error);
        }

        // Backend expects { token } not { refreshToken }
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          { token: refreshToken }
        );

        // Update the useAuthStore
        useAuthStore.setState({ accessToken: data.accessToken });

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
