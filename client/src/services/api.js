import axios from 'axios';

// Relative baseURL leverages Vite dev proxy locally and works out-of-the-box behind reverse proxies
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Domain-scoped API modules isolate endpoint paths from UI components for easier refactoring
export const bookAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export const transactionAPI = {
  issue: (data) => api.post('/transactions/issue', data),
  return: (data) => api.post('/transactions/return', data),
  getAll: () => api.get('/transactions'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const chatbotAPI = {
  ask: (question) => api.post('/chatbot/ask', { question }),
};

export const exportAPI = {
  // Specify responseType 'blob' so Axios preserves binary stream data for client-side CSV file download
  downloadHistory: () =>
    api.get('/export/history', { responseType: 'blob' }),
};


export default api;
