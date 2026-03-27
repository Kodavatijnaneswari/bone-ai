import axios from 'axios';
import Constants from 'expo-constants';

// Replace with your local machine's IP address (e.g., '192.168.1.10')
// For Android Emulator, use '10.0.2.2'
// For iOS Simulator, use 'localhost'
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bone-h6ca.onrender.com'; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ENDPOINTS = {
  LOGIN: '/api/login/',
  REGISTER: '/api/register/',
  ADMIN_LOGIN: '/api/admin-login/',
  DETECT: '/api/detect/',
  HISTORY: (userId: number) => `/api/history/${userId}/`,
  ADMIN_USERS: '/api/admin/users/',
  ADMIN_USER_ACTION: (userId: number, action: string) => `/api/admin/users/${userId}/${action}/`,
};

export default api;
