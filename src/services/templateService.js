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

export const templateService = {
  // Get all templates for the current user
  async getTemplates() {
    const response = await api.get('/templates');
    return response.data.templates;
  },

  // Get a specific template with participants
  async getTemplate(id) {
    const response = await api.get(`/templates/${id}`);
    return response.data.template;
  },

  // Create a new template
  async createTemplate(templateData) {
    const response = await api.post('/templates', templateData);
    return response.data.template;
  },

  // Update an existing template
  async updateTemplate(id, templateData) {
    const response = await api.put(`/templates/${id}`, templateData);
    return response.data.template;
  },

  // Delete a template
  async deleteTemplate(id) {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },

  // Apply a template to create a new bill
  async applyTemplate(templateId, billData) {
    const response = await api.post(`/templates/${templateId}/apply`, billData);
    return response.data;
  }
};

export default templateService; 