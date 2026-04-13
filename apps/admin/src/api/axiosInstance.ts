import axios from 'axios';
import { ADMIN_TOKEN_STORAGE_KEY } from '../../../../packages/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api'),
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
