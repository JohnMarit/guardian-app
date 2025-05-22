import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname !== 'localhost'
    ? 'https://community-guard-2525c539a22c.herokuapp.com/api'
    : 'http://localhost:3001/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

export const alertService = {
  createAlert: async (alertData: any) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      // Validate that response.data is an array
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid alerts response:', response.data);
        throw new Error('Invalid response format from server');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching alerts:', error);
      // If the error has a response, throw it with more details
      if (error.response) {
        throw new Error(`Failed to fetch alerts: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      }
      // If it's a network error or other issue
      throw new Error('Failed to fetch alerts: Network error or server unavailable');
    }
  },

  getAlertById: async (id: string) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  },

  updateAlert: async (id: string, alertData: any) => {
    const response = await api.put(`/alerts/${id}`, alertData);
    return response.data;
  },

  deleteAlert: async (id: string) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
};

export default api; 