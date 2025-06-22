import api from '../componets/api/api';

const API_URL = '/user/orders';

const createOrder = async () => {
  const token = localStorage.getItem('token');
  return api.post(API_URL, {}, { headers: { Authorization: `Bearer ${token}` } });
};

const uploadProof = async (orderId, file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`${API_URL}/${orderId}/upload-proof`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getOrderById = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const getOrders = async () => {
  const token = localStorage.getItem('token');
  return api.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const cancelOrder = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.put(`${API_URL}/${orderId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

const getOrderProof = async (orderId) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${orderId}/proof`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // Expect binary data (image)
  });
};

const userOrderService = {
  createOrder,
  uploadProof,
  getOrderById,
  getOrders,
  cancelOrder,
  getOrderProof,
};

export default userOrderService;