import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const type = response.headers['content-type'] || '';
    const isApi = response.config?.url?.startsWith('/') || response.config?.baseURL?.includes('/api');
    if (isApi && type.includes('text/html')) {
      return Promise.reject(new Error('API not available. Deploy the backend and set VITE_API_URL on Vercel.'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
