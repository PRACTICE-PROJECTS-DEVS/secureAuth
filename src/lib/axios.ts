import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://secureauthdb.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response interceptor: handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      // Token expired or invalid — clear storage and redirect to login
      const isAuthPage = ['/login', '/register', '/verify-otp', '/verify-biometric'].some(
        (p) => window.location.pathname.startsWith(p)
      );
      if (!isAuthPage) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user_id');
        localStorage.removeItem('auth_email');
        localStorage.removeItem('requires_biometric');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
