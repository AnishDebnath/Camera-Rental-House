import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message = data?.message || error.message || 'Network error occurred.';
    
    // Create a standard error object so .message always works
    const enhancedError = new Error(message);
    (enhancedError as any).fieldErrors = data?.fieldErrors;
    (enhancedError as any).response = error.response;
    (enhancedError as any).exists = data?.exists;
    
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;
