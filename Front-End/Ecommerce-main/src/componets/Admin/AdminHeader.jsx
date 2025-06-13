import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/api';

import {
  FiSearch, FiBell, FiMessageSquare, FiUser, FiChevronDown,
  FiLogOut, FiSettings, FiHelpCircle
} from 'react-icons/fi';

const AdminHeader = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
        setUser({
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          avatar: 'https://via.placeholder.com/40/A9CCE3/2C3E50?text=' + 
                  (response.data.firstName[0] + response.data.lastName[0]).toUpperCase()
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

    fetchUserData();
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

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 sticky top-0 z-40">
      {/* Left Side: Search Bar */}
      <div className="flex items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="search-field"
            className="block w-full h-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-habesha_blue sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center border border-gray-200 rounded px-2 py-0.5 text-xs font-sans font-medium text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Side: Icons and User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habesha_blue relative"
            aria-label="View notifications"
          >
            <FiBell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>
          {notificationsOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu" aria-orientation="vertical" aria-labelledby="notifications-menu-button"
            >
              <div className="px-4 py-3"><p className="text-sm font-medium text-gray-900">Notifications</p></div>
              <button onClick={() => alert('View Notification 1')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Notification 1</button>
              <button onClick={() => alert('View Notification 2')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Notification 2</button>
              <div className="border-t border-gray-100"></div>
              <button onClick={() => alert('View all notifications')} className="block w-full px-4 py-2 text-sm font-medium text-habesha_blue hover:bg-gray-100 text-center" role="menuitem">
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Messages Icon */}
        <button
          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habesha_blue"
          aria-label="View messages"
          onClick={() => alert('Messages clicked')}
        >
          <FiMessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* User Profile Dropdown */}
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
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habesha_blue"
                  id="user-menu-button"
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-transparent hover:border-habesha_blue transition"
                    src={user.avatar}
                    alt={user.name}
                  />
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