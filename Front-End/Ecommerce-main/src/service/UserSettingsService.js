import api from '../componets/api/api';

const API_URL = '/user/settings';

const getSettings = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}`, { headers: { Authorization: `Bearer ${token}` } });
};

const UserSettingsService = {
  getSettings
};


export default UserSettingsService;