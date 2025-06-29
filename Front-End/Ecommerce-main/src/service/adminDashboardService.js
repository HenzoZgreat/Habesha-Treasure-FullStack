import api from '../componets/api/api';

const API_URL = '/admin/orders';

const getRecentOrders = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/recent-orders`, { headers: { Authorization: `Bearer ${token}` } });
};

const adminDashboardService = {
  getRecentOrders,
};

export default adminDashboardService;