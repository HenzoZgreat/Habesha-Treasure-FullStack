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

const getFavorites = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
};

const favorite = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.post(`${API_URL}/${id}/favorite`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const unfavorite = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`${API_URL}/${id}/favorite`, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const isFavorited = async (id) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${id}/is-favorited`, { headers: { Authorization: `Bearer ${token}` } });
};

const submitReview = async (id, review) => {
  const token = localStorage.getItem('token');
  const response = await api.post(`${API_URL}/${id}/review`, review, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const getReviews = async (id) => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/${id}/reviews`, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteReview = async (id) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`${API_URL}/${id}/review`, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } };
};

const getCurrentUserId = async () => {
  const token = localStorage.getItem('token');
  return api.get('/auth/me/id', { headers: { Authorization: `Bearer ${token}` } });
};

const getUniqueCategories = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/distinct/categories`, { headers: { Authorization: `Bearer ${token}` } });
};

const userProductService = {
  getProducts,
  getProductById,
  getFavorites,
  favorite,
  unfavorite,
  isFavorited,
  submitReview,
  getReviews,
  deleteReview,
  getCurrentUserId,
  getUniqueCategories
};

export default userProductService;