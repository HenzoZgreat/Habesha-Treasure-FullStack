import api from '../componets/api/api';

const NOTIFICATIONS_BASE_URL = '/admin/notifications';

const getNotifications = async () => {
  const token = localStorage.getItem('token');
  return api.get(NOTIFICATIONS_BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
};

const getUnreadNotifications = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${NOTIFICATIONS_BASE_URL}/unread`, { headers: { Authorization: `Bearer ${token}` } });
};

const getGlobalNotifications = async () => {
  const token = localStorage.getItem('token');
  return api.get(`${NOTIFICATIONS_BASE_URL}/global`, { headers: { Authorization: `Bearer ${token}` } });
};

const markNotificationAsRead = async (notificationId) => {
  const token = localStorage.getItem('token');
  return api.put(`${NOTIFICATIONS_BASE_URL}/${notificationId}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

const NotificationService = {
  getNotifications,
  getUnreadNotifications,
  getGlobalNotifications,
  markNotificationAsRead,
};

export default NotificationService;