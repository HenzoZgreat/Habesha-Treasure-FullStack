import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiUsers, FiSettings, FiClipboard } from 'react-icons/fi';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';

const AdminSidebar = ({ isOpen, isExpanded, toggleSidebar, toggleExpansion }) => {
  const getNavLinkClass = ({ isActive }) =>
    `flex items-start justify-start w-full py-2.5 pl-4 text-sm font-medium group transition-all duration-300 ease-in-out ${
      isActive
        ? 'bg-habesha_blue text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        !isOpen ? '-translate-x-full' : 'translate-x-0'
      } w-64`}
      style={{ position: 'fixed', zIndex: 40 }}
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
        </div>
      </div>
      <nav className="flex-grow p-2 space-y-1.5 overflow-y-auto">
        <NavLink
          to="/admin/dashboard"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Dashboard' : ''}
        >
          <FiGrid className="h-5 w-5 flex-shrink-0 mr-3" />
          {isExpanded && <span className="ml-0 transition-opacity duration-300">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/admin/products"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Products' : ''}
        >
          <FiBox className="h-5 w-5 flex-shrink-0 mr-3" />
          {isExpanded && <span className="ml-0 transition-opacity duration-300">Products</span>}
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Orders' : ''}
        >
          <FiClipboard className="h-5 w-5 flex-shrink-0 mr-3" />
          {isExpanded && <span className="ml-0 transition-opacity duration-300">Orders</span>}
        </NavLink>
        <NavLink
          to="/admin/users"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Users' : ''}
        >
          <FiUsers className="h-5 w-5 flex-shrink-0 mr-3" />
          {isExpanded && <span className="ml-0 transition-opacity duration-300">Users</span>}
        </NavLink>
        <NavLink
          to="/admin/setting"
          className={getNavLinkClass}
          onClick={() => isOpen && toggleSidebar()}
          title={!isExpanded ? 'Settings' : ''}
        >
          <FiSettings className="h-5 w-5 flex-shrink-0 mr-3" />
          {isExpanded && <span className="ml-0 transition-opacity duration-300">Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;