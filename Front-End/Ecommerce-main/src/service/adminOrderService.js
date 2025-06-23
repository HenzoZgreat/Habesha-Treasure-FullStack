import api from '../componets/api/api';

const API_URL = '/admin/orders';

const getOrders = async () => {
  const token = localStorage.getItem('token');
  return api.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const getOrderById = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const approveOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.put(`${API_URL}/${orderId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

const rejectOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.put(`${API_URL}/${orderId}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem('token');
  return api.put(`${API_URL}/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
};

const getOrderProof = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${orderId}/proof`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
};

const adminOrderService = {
  getOrders,
  getOrderById,
  approveOrder,
  rejectOrder,
  updateOrderStatus,
  getOrderProof,
};

export default adminOrderService;