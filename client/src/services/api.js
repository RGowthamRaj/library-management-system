import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Book API
export const bookAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

// Transaction API
export const transactionAPI = {
  issue: (data) => api.post('/transactions/issue', data),
  return: (data) => api.post('/transactions/return', data),
  getAll: () => api.get('/transactions'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Chatbot API
export const chatbotAPI = {
  ask: (question) => api.post('/chatbot/ask', { question }),
};

// Export API
export const exportAPI = {
  downloadHistory: () =>
    api.get('/export/history', { responseType: 'blob' }),
};

export default api;
