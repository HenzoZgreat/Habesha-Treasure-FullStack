import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../../componets/api/api';
import {
  FiSearch, FiBell, FiMessageSquare, FiUser, FiChevronDown,
  FiLogOut, FiSettings, FiHelpCircle, FiHome
} from 'react-icons/fi';
import NotificationService from '../../service/notificationService';

const AdminHeader = ({ toggleSidebar, isOpen }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUser(true);
      setUserError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setUserError('No token found');
        navigate('/SignIn');
        setLoadingUser(false);
        return;
      }

      try {
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const initials = `${response.data.firstName[0]}${response.data.lastName[0]}`.toUpperCase();
        setUser({
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          initials: initials,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserError('Could not load user data.');
        if (error.response && [401, 403].includes(error.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        }
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await NotificationService.getNotifications();
        const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedNotifications.slice(0, 3).map(notification => ({
          ...notification,
          timestamp: new Date(notification.createdAt).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        })));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchUserData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    localStorage.removeItem('token');
    setUser(null);
    navigate('/SignIn');
  };

  const closeDropdowns = () => {
    setUserDropdownOpen(false);
    setNotificationsOpen(false);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await NotificationService.markNotificationAsRead(notification.id);
      setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 z-50"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <NavLink
          to="/"
          className="flex items-center p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          aria-label="Go to home page"
        >
          <FiHome className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden sm:inline ml-2 text-sm font-medium text-gray-700">Home</span>
        </NavLink>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-5">
        <div className="relative">
          <div
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer relative"
            aria-label="View notifications"
          >
            <FiBell className="h-5 w-5 sm:h-6 sm:w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          {notificationsOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu" aria-orientation="vertical" aria-labelledby="notifications-menu-button"
            >
              <div className="px-4 py-3"><p className="text-sm font-medium text-gray-900">Notifications</p></div>
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`block w-full text-left px-4 py-2 text-sm ${!notification.read ? 'bg-blue-50' : 'text-gray-700'} hover:bg-gray-100`}
                      role="menuitem"
                    >
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.timestamp}</p>
                    </button>
                  ))}
                  <div className="border-t border-gray-100"></div>
                  <NavLink
                    to="/admin/notifications"
                    onClick={closeDropdowns}
                    className="block w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 text-center"
                    role="menuitem"
                  >
                    View all notifications
                  </NavLink>
                </>
              ) : (
                <p className="px-4 py-2 text-sm text-gray-500">No notifications</p>
              )}
            </div>
          )}
        </div>
        <button
          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="View messages"
          onClick={() => alert('Messages clicked')}
        >
          <FiMessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <div className="relative">
          {loadingUser ? (
            <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          ) : userError ? (
            <span className="text-xs text-red-500">Error</span>
          ) : user ? (
            <>
              <div>
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu-button"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium border-2 border-transparent hover:border-blue-600 transition">
                    {user.initials}
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                  <FiChevronDown className="hidden md:block ml-1 h-4 w-4 text-gray-500" />
                </button>
              </div>
              {userDropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <NavLink
                    to="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem" onClick={closeDropdowns}
                  >
                    <FiUser className="mr-3 h-5 w-5 text-gray-400" /> Your Profile
                  </NavLink>
                  <NavLink
                    to="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem" onClick={closeDropdowns}
                  >
                    <FiSettings className="mr-3 h-5 w-5 text-gray-400" /> Settings
                  </NavLink>
                  <NavLink
                    to="/admin/help"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem" onClick={closeDropdowns}
                  >
                    <FiHelpCircle className="mr-3 h-5 w-5 text-gray-400" /> Help Center
                  </NavLink>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    role="menuitem"
                  >
                    <FiLogOut className="mr-3 h-5 w-5" /> Sign out
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;