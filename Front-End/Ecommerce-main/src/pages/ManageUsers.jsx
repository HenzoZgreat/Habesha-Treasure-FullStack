import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../componets/api/api';
import UserListHeader from '../componets/users/UserListHeader';
import UserFilters from '../componets/users/UserFilters';
import UserTable from '../componets/users/UserTable';
import PaginationControls from '../componets/common/PaginationControls';

const USERS_PER_PAGE = 6;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [userRoles, setUserRoles] = useState(['All']);
  const [userStatuses, setUserStatuses] = useState(['All', 'Active', 'Suspended']);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/SignIn');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userList = response.data.map(user => ({
          ...user,
          name: `${user.firstName} ${user.lastName}`,
          avatar: `https://via.placeholder.com/40/A9CCE3/2C3E50?text=${(user.firstName[0] + user.lastName[0]).toUpperCase()}`,
          status: user.enabled ? 'Active' : 'Suspended'
        }));
        setUsers(userList);
        const roles = ['All', ...new Set(userList.map(user => user.role))];
        setUserRoles(roles);
      } catch (err) {
        console.error('Failed to load users:', err);
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        } else {
          setError('Failed to load users.');
        }
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, [navigate]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'All' || user.role === filterRole;

    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Active' && user.status === 'Active') ||
      (filterStatus === 'Suspended' && user.status === 'Suspended');

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginate users
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (e, userId) => {
    if (e.target.checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleViewUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setError('User deleted successfully.');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user.');
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/users/${userId}`, {
        enabled: newStatus === 'Active'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: newStatus, enabled: newStatus === 'Active' } : user
      ));
      setError(`User status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status.');
    }
  };

  const handleAddUser = () => {
    navigate('/admin/users/add');
  };

  const isAllCurrentPageSelected = paginatedUsers.length > 0 &&
    paginatedUsers.every(user => selectedUsers.includes(user.id));

  return (
    <div className="space-y-6">
      <UserListHeader onAddUser={handleAddUser} />
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No users found.</p>
        </div>
      ) : (
        <>
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            filterRole={filterRole}
            onRoleChange={(e) => setFilterRole(e.target.value)}
            roles={userRoles}
            filterStatus={filterStatus}
            onStatusChange={(e) => setFilterStatus(e.target.value)}
            statuses={userStatuses}
          />
          <UserTable
            users={paginatedUsers}
            selectedUsers={selectedUsers}
            onSelectAll={handleSelectAll}
            onSelectUser={handleSelectUser}
            onViewUserDetails={handleViewUserDetails}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onUpdateUserStatus={handleUpdateUserStatus}
            isAllCurrentPageSelected={isAllCurrentPageSelected}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ManageUsers;
