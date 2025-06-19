import api from '../componets/api/api';

const API_URL = '/user';

const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
};

const updateUserProfile = async (data) => {
  const token = localStorage.getItem('token');
  return api.put(`${API_URL}/me`, data, { headers: { Authorization: `Bearer ${token}` } });
};

const UserUserService = {
  getUserProfile,
  updateUserProfile,
};

export default UserUserService;