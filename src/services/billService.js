import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const billService = {
  // Get all bills
  async getAllBills() {
    const response = await api.get('/bills');
    return response.data;
  },

  // Get bill by ID
  async getBillById(id) {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  // Create new bill
  async createBill(data) {
    const response = await api.post('/bills', data);
    return response.data;
  },

  // Update bill
  async updateBill(id, data) {
    const response = await api.put(`/bills/${id}`, data);
    return response.data;
  },

  // Delete bill
  async deleteBill(id) {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },

  // Add product to bill
  async addProduct(billId, data) {
    const response = await api.post(`/bills/${billId}/products`, data);
    return response.data;
  },

  // Update product
  async updateProduct(billId, productId, data) {
    const response = await api.put(`/bills/${billId}/products/${productId}`, data);
    return response.data;
  },

  // Delete product
  async deleteProduct(billId, productId) {
    const response = await api.delete(`/bills/${billId}/products/${productId}`);
    return response.data;
  },

  // Get bill summary
  async getBillSummary(id) {
    const response = await api.get(`/bills/${id}/summary`);
    return response.data;
  },
};

export const uploadService = {
  // Upload and process image
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 