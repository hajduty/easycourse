import axios from "axios";

export const wsUrl = import.meta.env.VITE_API_URL || 'https://localhost:7009/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7009/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config
});

export default apiClient;