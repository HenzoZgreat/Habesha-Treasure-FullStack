import axios from 'axios';
import api from '../componets/api/api';

const API_URL = '/admin/dashboard';

const getRecentOrders = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/recent-orders`, { headers: { Authorization: `Bearer ${token}` } });
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const adminDashboardService = {
  getRecentOrders,
  getDashboardSummary: async (currency = 'USD', endDate = new Date().toISOString().split('T')[0], rangeDays = 7) => {
    try {
      const response = await api.post(
        `${API_URL}/overview`,
        { currency, endDate, rangeDays },
        { headers: getAuthHeader() }
      );
      return response;
    } catch (error) {
      throw error.response?.data || new Error('Failed to fetch dashboard summary');
    }
  },

  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.post(
        `${API_URL}/products/top`,
        { limit },
        { headers: getAuthHeader() }
      );
      return response;
    } catch (error) {
      throw error.response?.data || new Error('Failed to fetch top products');
    }
  },
};

export default adminDashboardService;