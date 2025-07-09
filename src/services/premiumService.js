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

class PremiumService {
  // Get user's subscription status and limits
  static async getStatus() {
    try {
      const response = await api.get('/premium/status');
      return response.data;
    } catch (error) {
      console.error('Error getting premium status:', error);
      throw error;
    }
  }

  // Check if user can perform specific actions
  static async checkAction(action, data = {}) {
    try {
      const response = await api.post('/premium/check', { action, data });
      return response.data;
    } catch (error) {
      console.error('Error checking premium action:', error);
      throw error;
    }
  }

  // Upgrade to premium
  static async upgrade(plan = 'monthly') {
    try {
      const response = await api.post('/premium/upgrade', { plan });
      return response.data;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      throw error;
    }
  }

  // Cancel premium subscription
  static async cancel() {
    try {
      const response = await api.post('/premium/cancel');
      return response.data;
    } catch (error) {
      console.error('Error cancelling premium:', error);
      throw error;
    }
  }

  // Get available plans
  static async getPlans() {
    try {
      const response = await api.get('/premium/plans');
      return response.data;
    } catch (error) {
      console.error('Error getting plans:', error);
      throw error;
    }
  }

  // Create Stripe Checkout session
  static async createCheckoutSession(plan = 'monthly') {
    try {
      const response = await api.post('/premium/create-checkout-session', { plan });
      return response.data;
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error);
      throw error;
    }
  }
}

export default PremiumService; 