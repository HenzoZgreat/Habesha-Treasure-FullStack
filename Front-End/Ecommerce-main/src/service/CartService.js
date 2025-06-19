import api from '../componets/api/api';

const API_URL = '/user/cart';

const getCart = async () => {
  const token = localStorage.getItem('token');
  return api.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const addToCart = async (data) => {
  const token = localStorage.getItem('token');
  return api.post(`${API_URL}/add`, data, { headers: { Authorization: `Bearer ${token}` } });
};

const removeFromCart = async (data) => {
  const token = localStorage.getItem('token');
  return api.delete(`${API_URL}/remove`, { headers: { Authorization: `Bearer ${token}` }, data });
};

const clearCart = async () => {
  const token = localStorage.getItem('token');
  return api.delete(`${API_URL}/clear`, { headers: { Authorization: `Bearer ${token}` } });
};

const CartService = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

export default CartService;