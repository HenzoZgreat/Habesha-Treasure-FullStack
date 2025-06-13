// src/components/users/UserTableRow.jsx
import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiUserCheck, FiUserX, FiMail, FiShield } from 'react-icons/fi';
import { getUserStatusClass } from '../../utils/helpers';

// Helper for icon component directly in this file for clarity
const getUserStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <FiUserCheck className="mr-1.5 h-3 w-3" />;
      case 'Inactive': return <FiUserX className="mr-1.5 h-3 w-3 text-gray-400" />;
      case 'Suspended': return <FiUserX className="mr-1.5 h-3 w-3 text-red-500" />;
      default: return null;
    }
};

const UserTableRow = ({
  user,
  isSelected,
  onSelectUser,
  onViewUserDetails,
  onEditUser,
  onDeleteUser,
  onUpdateUserStatus,
}) => {
  return (
    <tr className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-habesha_blue/10' : ''}`}>
      <td className="p-4">
        <input
          type="checkbox"
          className="h-4 w-4 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue"
          checked={isSelected}
          onChange={(e) => onSelectUser(e, user.id)}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover mr-3 shadow-sm" src={user.avatar} alt={user.name} />
          <div>
            <button onClick={() => onViewUserDetails(user.id)} className="text-sm font-medium text-gray-800 hover:text-habesha_blue">
              {user.name}
            </button>
            <div className="text-xs text-gray-500 flex items-center">
              <FiMail size={12} className="mr-1 text-gray-400" /> {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <FiShield size={14} className="mr-1.5 text-gray-400" /> {user.role}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getUserStatusClass(user.status)}`}>
          {getUserStatusIcon(user.status)}
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.joined).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.lastLogin).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
        <button
          onClick={() => onViewUserDetails(user.id)}
          className="text-gray-500 hover:text-habesha_blue p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          title="View Details"
        >
          <FiEye size={18} />
        </button>
        <button
          onClick={() => onEditUser(user.id)}
          className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-100 transition-colors"
          title="Edit User"
        >
          <FiEdit size={18} />
        </button>
        {user.status !== 'Suspended' && (
          <button
            onClick={() => onUpdateUserStatus(user.id, 'Suspended')}
            className="text-orange-500 hover:text-orange-700 p-1.5 rounded-full hover:bg-orange-100 transition-colors"
            title="Suspend User"
          >
            <FiUserX size={18} />
          </button>
        )}
        {user.status === 'Suspended' && (
          <button
            onClick={() => onUpdateUserStatus(user.id, 'Active')}
            className="text-green-500 hover:text-green-700 p-1.5 rounded-full hover:bg-green-100 transition-colors"
            title="Activate User"
          >
            <FiUserCheck size={18} />
          </button>
        )}
        <button
          onClick={() => onDeleteUser(user.id)}
          className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-100 transition-colors"
          title="Delete User"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;