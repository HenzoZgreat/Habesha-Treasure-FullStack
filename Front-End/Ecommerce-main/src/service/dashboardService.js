import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/admin/dashboard';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const dashboardService = {
  getDashboardSummary: async (currency = 'USD', endDate = new Date().toISOString().split('T')[0], rangeDays = 7) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/overview`,
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
      const response = await axios.post(
        `${BASE_URL}/products/top`,
        { limit },
        { headers: getAuthHeader() }
      );
      return response;
    } catch (error) {
      throw error.response?.data || new Error('Failed to fetch top products');
    }
  },
};

export default dashboardService;