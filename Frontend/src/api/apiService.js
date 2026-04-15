// src/api/apiService.js
// Production API service — replaces mockService.js
// All calls go to the real backend via Axios

import axios from 'axios';

const isProd = import.meta.env.PROD;
const VITE_API_URL = import.meta.env.VITE_API_URL;

// Production Safeguard: Never default to localhost if built for production
const BASE_URL = VITE_API_URL || (isProd ? '' : 'http://localhost:5001/api');

if (!VITE_API_URL && isProd) {
  console.error('❌ CONFIG ERROR: VITE_API_URL is not set in production. API calls will fail.');
}

console.log(`[API Service] Target: ${BASE_URL || 'RELATIVE'} | Mode: ${isProd ? 'Production' : 'Development'}`);

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

// ─── Request Interceptor: Attach JWT & Handle Content-Type ───────────────────
api.interceptors.request.use(
  (config) => {
    // 1. Attach JWT Token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Smart Content-Type Handling
    // If sending FormData, let the browser/axios set it (includes boundary)
    // Otherwise, default to application/json for standard objects
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 → Auto Logout ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If access token expired, try refresh once
    if (
      error.response?.status === 401 &&
      error.response?.data?.errorCode === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        // Refresh failed — logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  resetPin: (data) => api.post('/auth/reset-pin', data),
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getById: (id) => api.get(`/products/${id}`),
  search: (q) => api.get('/products/search', { params: { q } }),
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  bulkUpdateStock: (updates) => api.patch('/products/bulk-stock', { updates }),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params = {}) => api.get('/orders/my', { params }),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status, note = '') => api.patch(`/orders/${id}/status`, { status, note }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
};

// ─── Upload API ───────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadImages: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload', formData, {
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined,
    });
  },
};

// ─── Settings API ─────────────────────────────────────────────────────────────
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
