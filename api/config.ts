import axios from 'axios';
import Constants from 'expo-constants';

// Replace with your local machine's IP address (e.g., '192.168.1.10')
// For Android Emulator, use '10.0.2.2'
// For iOS Simulator, use 'localhost'
// Support both local and production URLs
const RENDER_URL = 'https://bakend-icob.onrender.com';
const LOCAL_URL = 'http://127.0.0.1:8000';

// Default to RENDER_URL for deployment, can be overridden by EXPO_PUBLIC_API_URL or changed to LOCAL_URL manually
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || RENDER_URL; 

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
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
  ADMIN_STATS: '/api/admin/stats/',
  ADMIN_USER_ACTION: (userId: number, action: string) => `/api/admin/users/${userId}/${action}/`,
};

export default api;
