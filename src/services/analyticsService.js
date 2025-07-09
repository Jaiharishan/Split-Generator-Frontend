import axios from 'axios';

const API_BASE = '/api/analytics';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const analyticsService = {
  async getOverview() {
    const res = await axios.get(`${API_BASE}/overview`, { headers: getAuthHeaders() });
    return res.data;
  },
  async getSpendingOverTime() {
    const res = await axios.get(`${API_BASE}/spending-over-time`, { headers: getAuthHeaders() });
    return res.data;
  },
  async getBillFrequency() {
    const res = await axios.get(`${API_BASE}/bill-frequency`, { headers: getAuthHeaders() });
    return res.data;
  },
  async getTopParticipants() {
    const res = await axios.get(`${API_BASE}/top-participants`, { headers: getAuthHeaders() });
    return res.data;
  },
  async getCommonProducts() {
    const res = await axios.get(`${API_BASE}/common-products`, { headers: getAuthHeaders() });
    return res.data;
  },
  async getParticipantOwes() {
    const res = await axios.get(`${API_BASE}/participant-owes`, { headers: getAuthHeaders() });
    return res.data;
  },
};

export default analyticsService; 