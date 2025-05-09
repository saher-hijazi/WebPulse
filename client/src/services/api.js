import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  },
};

// Websites API
export const websitesAPI = {
  getAll: () => api.get('/websites'),
  getById: (id) => api.get(`/websites/${id}`),
  create: (websiteData) => api.post('/websites', websiteData),
  update: (id, websiteData) => api.put(`/websites/${id}`, websiteData),
  delete: (id) => api.delete(`/websites/${id}`),
  runScan: (id) => api.post(`/websites/${id}/scan`),
  getPerformanceHistory: (id) => api.get(`/websites/${id}/performance`),
  getRecommendations: (id) => api.get(`/websites/${id}/recommendations`),
};

export default api;
