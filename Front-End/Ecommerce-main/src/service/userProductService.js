import api from '../componets/api/api';

const API_URL = '/user/products';

const getProducts = async () => {
  const token = localStorage.getItem('token');
  return api.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const getProductById = async (id) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

const incrementFavorites = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.patch(`${API_URL}/${id}/favorites/increment`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const decrementFavorites = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.patch(`${API_URL}/${id}/favorites/decrement`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const submitReview = async (id, review) => {
  const token = localStorage.getItem('token');
  const response = await api.post(`${API_URL}/${id}/reviews`, review, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const userProductService = {
  getProducts,
  getProductById,
  incrementFavorites,
  decrementFavorites,
  submitReview
};

export default userProductService;