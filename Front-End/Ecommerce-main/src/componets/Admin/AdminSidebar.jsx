import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiUsers, FiSettings, FiClipboard } from 'react-icons/fi';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

const AdminSidebar = ({ isOpen, isExpanded, toggleSidebar, toggleExpansion }) => {
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center justify-center w-full py-2.5 text-sm font-medium group transition-all duration-300 ease-in-out ${
      isActive
        ? 'bg-habesha_blue text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  return (
    <aside
      className={`fixed sm:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 ${isExpanded ? 'w-64' : 'w-16 sm:w-16'} sm:flex-shrink-0`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isExpanded && (
          <span className="text-xl font-bold text-habesha_blue transition-opacity duration-300">Admin Panel</span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExpansion}
            className="p-2 text-gray-500 hover:bg-gray-100 hidden sm:block"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <HiChevronDoubleLeft className="h-5 w-5 transition-transform duration-300" />
            ) : (
              <HiChevronDoubleRight className="h-5 w-5 transition-transform duration-300" />
            )}
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 sm:hidden"
            aria-label="Close sidebar"
          >
            <svg
              className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <nav className="flex-grow p-2 space-y-1.5 overflow-y-auto">
        <NavLink
          to="/admin/dashboard"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Dashboard' : ''}
        >
          <FiGrid className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-3 transition-opacity duration-300">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/admin/products"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Products' : ''}
        >
          <FiBox className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-3 transition-opacity duration-300">Products</span>}
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Orders' : ''}
        >
          <FiClipboard className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-3 transition-opacity duration-300">Orders</span>}
        </NavLink>
        <NavLink
          to="/admin/users"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Users' : ''}
        >
          <FiUsers className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-3 transition-opacity duration-300">Users</span>}
        </NavLink>
        <NavLink
          to="/admin/setting"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Settings' : ''}
        >
          <FiSettings className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-3 transition-opacity duration-300">Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;