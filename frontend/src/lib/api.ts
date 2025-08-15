import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  timeout: 5000
});

// Request Interceptor → attach auth token if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // or from cookies
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized — redirecting to login');
      // Redirect logic here
    }
    return Promise.reject(error);
  }
);


export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';