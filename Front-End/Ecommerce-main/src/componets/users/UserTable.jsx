// src/components/users/UserTable.jsx
import React from 'react';
import UserTableRow from './UserTableRow';

const UserTable = ({
  users,
  selectedUsers,
  onSelectAll,
  onSelectUser,
  onViewUserDetails,
  onEditUser,
  onDeleteUser,
  onUpdateUserStatus,
  isAllCurrentPageSelected,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4 w-12 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue"
                  checked={isAllCurrentPageSelected && users.length > 0}
                  onChange={onSelectAll}
                  disabled={users.length === 0}
                />
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Login</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={Array.isArray(selectedUsers) && selectedUsers.includes(user.id)}
                onSelectUser={onSelectUser}
                onViewUserDetails={onViewUserDetails}
                onEditUser={onEditUser}
                onDeleteUser={onDeleteUser}
                onUpdateUserStatus={onUpdateUserStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;