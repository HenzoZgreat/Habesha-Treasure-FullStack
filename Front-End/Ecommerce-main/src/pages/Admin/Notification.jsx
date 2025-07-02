"use client"

import { useState, useEffect } from "react"
import { Bell, Search, ArrowLeft, Filter } from "lucide-react"
import NotificationService from "../../service/notificationService"

// Icon mapping based on notification type
const typeIcons = {
  ORDER: <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
  </svg>,
  PRODUCT: <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
  </svg>,
  USER: <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
  </svg>,
  SETTINGS: <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
  </svg>,
  STOCK: <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 2a1 1 0 00-1 1v4H4a1 1 0 000 2h3v5a1 1 0 001 1h1a1 1 0 001-1v-5h3a1 1 0 100-2H9V3a1 1 0 00-1-1z"/>
  </svg>,
  SYSTEM: <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
  </svg>,
};

export default function Notification() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNotification, setSelectedNotification] = useState(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await NotificationService.getNotifications();
        console.log("Fetched notifications response:", response);
        setNotifications(response.data.map(notification => ({
          id: notification.id,
          message: notification.message,
          type: notification.type,
          createdAt: notification.createdAt,
          read: notification.read,
          timestamp: new Date(notification.createdAt).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          user: notification.user
        })));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = '/SignIn';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const unreadData = await NotificationService.getUnreadNotifications();
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = '/SignIn';
        }
      }
    };
    fetchUnreadCount();
    window.addEventListener('focus', fetchUnreadCount);
    return () => window.removeEventListener('focus', fetchUnreadCount);
  }, []);

  const markAsRead = async (id) => {
    try {
      await NotificationService.markNotificationAsRead(id);
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
      if (selectedNotification && selectedNotification.id === id) {
        setSelectedNotification({ ...selectedNotification, read: true });
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/SignIn';
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(unreadIds.map(id => NotificationService.markNotificationAsRead(id)));
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = '/SignIn';
      }
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" || (filter === "read" && notification.read) || (filter === "unread" && !notification.read);
    const matchesSearch = notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const openModal = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) markAsRead(notification.id);
  };

  const closeModal = () => setSelectedNotification(null);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </a>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="p-2 text-gray-500">
              <Bell className="h-5 w-5 cursor-default" />
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "all" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "unread" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "read" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Read
                </button>
              </div>
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto"
              >
                Mark All as Read
              </button>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search notifications"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-8">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-center mt-2 text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-8 text-center">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? "No results match your search." : "No notifications match the selected filter."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => openModal(notification)}
                  className={`py-4 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''} hover:bg-gray-100 transition-colors`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 pt-0.5">
                      {!notification.read && <span className="h-3 w-3 rounded-full bg-blue-600 block"></span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        {typeIcons[notification.type] || <span className="text-gray-400">?</span>}
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      </div>
                      <p className="text-sm text-gray-500">{notification.timestamp}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all duration-300 ease-in-out" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Notification Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {typeIcons[selectedNotification.type] || <span className="text-gray-400">?</span>}
                <p className="text-md font-medium text-gray-900">{selectedNotification.message}</p>
              </div>
              <p className="text-sm text-gray-500">Received: {selectedNotification.timestamp}</p>
              <p className="text-sm text-gray-600">Status: {selectedNotification.read ? 'Read' : 'Unread'}</p>
              {selectedNotification.type === 'USER' && selectedNotification.user && (
                <div className="text-sm text-gray-600">
                  <p>User: {selectedNotification.user.firstName} {selectedNotification.user.lastName}</p>
                  <p>Role: {selectedNotification.user.role}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}