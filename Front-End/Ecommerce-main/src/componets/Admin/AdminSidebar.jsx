// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBox, FiUsers, FiSettings, FiClipboard} from 'react-icons/fi'; // Example icons

const AdminSidebar = () => {
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group transition-colors duration-150 ${
      isActive
        ? 'bg-habesha_blue text-white shadow-md' // Or your active style
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center justify-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-habesha_blue">Admin Panel</span> {/* Or your logo */}
      </div>
      <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        <NavLink to="/admin/dashboard" className={getNavLinkClass}>
          <FiGrid className="mr-3 h-5 w-5" /> Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={getNavLinkClass}>
          <FiBox className="mr-3 h-5 w-5" /> Products
        </NavLink>
         <NavLink to="/admin/orders" className={getNavLinkClass}> {/* Example */}
          <FiClipboard className="mr-3 h-5 w-5" /> Orders
        </NavLink>
        <NavLink to="/admin/users" className={getNavLinkClass}> {/* Example */}
          <FiUsers className="mr-3 h-5 w-5" /> Users
        </NavLink>
        <NavLink to="/admin/setting" className={getNavLinkClass}> {/* Example */}
          <FiSettings className="mr-3 h-5 w-5" /> Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;