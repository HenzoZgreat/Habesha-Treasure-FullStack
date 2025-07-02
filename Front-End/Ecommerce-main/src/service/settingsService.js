// src/service/settingsService.js
import api from '../componets/api/api';

const API_URL = '/admin/settings';

const getSettings = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${API_URL}`, { headers: { Authorization: `Bearer ${token}` } });
};

const updateSettingsSection = async (sectionKey, sectionData) => {
  const token = localStorage.getItem('token');
  const data = { [sectionKey]: sectionData };
  return api.put(`${API_URL}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

const settingsService = {
  getSettings,
  updateSettingsSection,
};

export default settingsService;