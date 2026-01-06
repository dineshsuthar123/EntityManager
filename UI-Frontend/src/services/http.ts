import axios from 'axios';
import API_BASE_URL from '../config/api-config';

// Centralized axios instance with base URL and auth header
const http = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Authorization header if token exists
http.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Handle 401 responses - clear invalid token and notify auth change
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid/expired token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Notify auth change to update UI
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }
    }
    return Promise.reject(error);
  }
);

export default http;
