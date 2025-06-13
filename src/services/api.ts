import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5757';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  register: (email: string, password: string, name: string) => 
    api.post('/api/auth/register', { email, password, name }),
};

// Pizza API calls
export const pizzaAPI = {
  getAll: () => api.get('/api/pizzas'),
  create: (pizza: any) => api.post('/api/pizzas', pizza),
  update: (id: string, pizza: any) => api.put(`/api/pizzas/${id}`, pizza),
  delete: (id: string) => api.delete(`/api/pizzas/${id}`),
};

// Order API calls
export const orderAPI = {
  create: (order: any) => api.post('/api/orders', order),
  getUserOrders: (userId: string) => api.get(`/api/orders/${userId}`),
  getAllOrders: () => api.get('/api/orders'),
  updateStatus: (id: string, status: string) => 
    api.patch(`/api/orders/${id}`, { status }),
};
