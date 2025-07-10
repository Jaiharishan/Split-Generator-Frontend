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

class NotificationService {
  // Get user's notification preferences
  static async getPreferences() {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      throw error;
    }
  }

  // Update user's notification preferences
  static async updatePreferences(preferences) {
    try {
      const response = await api.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // Send test email
  static async sendTestEmail() {
    try {
      const response = await api.post('/notifications/test-email');
      return response.data;
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }

  // Get notification history (for future implementation)
  static async getHistory() {
    try {
      const response = await api.get('/notifications/history');
      return response.data;
    } catch (error) {
      console.error('Error getting notification history:', error);
      throw error;
    }
  }
}

export default NotificationService; 