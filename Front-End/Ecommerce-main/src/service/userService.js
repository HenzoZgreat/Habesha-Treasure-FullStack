// src/services/userService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/users';
const USE_MOCK_API = true;

const initialMockUsers = [
  { id: 'U001', name: 'Nati Demelash', email: 'nati.d@example.com', role: 'Admin', status: 'Active', dateJoined: '2023-01-15', lastLogin: '2023-10-28', avatar: 'https://via.placeholder.com/40/A9CCE3/2C3E50?text=ND' },
  { id: 'U002', name: 'Abebe Bikila', email: 'abebe.b@example.com', role: 'Customer', status: 'Active', dateJoined: '2023-03-22', lastLogin: '2023-10-27', avatar: 'https://via.placeholder.com/40/D5DBDB/2C3E50?text=AB' },
  { id: 'U003', name: 'Sara Tadesse', email: 'sara.t@example.com', role: 'Editor', status: 'Active', dateJoined: '2023-05-10', lastLogin: '2023-10-29', avatar: 'https://via.placeholder.com/40/ABEBC6/2C3E50?text=ST' },
  { id: 'U004', name: 'John Doe', email: 'john.d@example.com', role: 'Customer', status: 'Inactive', dateJoined: '2023-02-01', lastLogin: '2023-08-15', avatar: 'https://via.placeholder.com/40/FAD7A0/2C3E50?text=JD' },
  { id: 'U005', name: 'Lia Kebede', email: 'lia.k@example.com', role: 'Customer', status: 'Active', dateJoined: '2023-07-19', lastLogin: '2023-10-25', avatar: 'https://via.placeholder.com/40/CCD1D1/2C3E50?text=LK' },
  { id: 'U006', name: 'Bruk Mamo', email: 'bruk.m@example.com', role: 'Support', status: 'Suspended', dateJoined: '2023-04-05', lastLogin: '2023-09-30', avatar: 'https://via.placeholder.com/40/F5B7B1/2C3E50?text=BM' },
];

let mockUsersStore = [...initialMockUsers];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getUsers = async (params = {}) => {
  if (USE_MOCK_API) {
    await delay(500);
    let filtered = [...mockUsersStore];

    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term)
      );
    }
    if (params.role && params.role !== 'All') {
      filtered = filtered.filter(u => u.role === params.role);
    }
    if (params.status && params.status !== 'All') {
      filtered = filtered.filter(u => u.status === params.status);
    }
    // Add sorting if needed

    const totalUsers = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 6; // Default limit
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filtered.slice(startIndex, endIndex);

    return { data: { users: paginatedUsers, totalUsers, totalPages: Math.ceil(totalUsers / limit) } };
  }
  return axios.get(API_URL, { params });
};

const getUserById = async (userId) => {
    if (USE_MOCK_API) {
        await delay(200);
        const user = mockUsersStore.find(u => u.id === userId);
        return { data: user };
    }
    return axios.get(`${API_URL}/${userId}`);
};

const addUser = async (userData) => {
    if (USE_MOCK_API) {
        await delay(300);
        const newUser = {
            ...userData,
            id: `U${Date.now().toString().slice(-4)}`,
            dateJoined: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString().split('T')[0], // Or null
            avatar: userData.avatar || `https://via.placeholder.com/40/CCCCCC/FFFFFF?text=${userData.name.substring(0,2).toUpperCase()}`,
            status: userData.status || 'Active'
        };
        mockUsersStore = [newUser, ...mockUsersStore];
        return { data: newUser };
    }
    return axios.post(API_URL, userData);
};

const updateUser = async (userId, userData) => {
    if (USE_MOCK_API) {
        await delay(300);
        mockUsersStore = mockUsersStore.map(u => u.id === userId ? { ...u, ...userData } : u);
        const updatedUser = mockUsersStore.find(u => u.id === userId);
        return { data: updatedUser };
    }
    return axios.put(`${API_URL}/${userId}`, userData);
};

const updateUserStatus = async (userId, newStatus) => {
    if (USE_MOCK_API) {
        await delay(300);
        mockUsersStore = mockUsersStore.map(u => u.id === userId ? { ...u, status: newStatus } : u);
        const updatedUser = mockUsersStore.find(u => u.id === userId);
        return { data: updatedUser };
    }
    return axios.patch(`${API_URL}/${userId}/status`, { status: newStatus }); // Or a general update
};

const deleteUser = async (userId) => {
    if (USE_MOCK_API) {
        await delay(300);
        mockUsersStore = mockUsersStore.filter(u => u.id !== userId);
        return { data: { message: 'User deleted successfully' } };
    }
    return axios.delete(`${API_URL}/${userId}`);
};

const getUniqueUserRoles = async () => {
    if (USE_MOCK_API) {
        await delay(100);
        const roles = [...new Set(initialMockUsers.map(u => u.role))].sort();
        return { data: roles };
    }
    const roles = [...new Set(initialMockUsers.map(u => u.role))].sort();
    return { data: roles }; // Fallback
};

const getUniqueUserStatuses = async () => {
    if (USE_MOCK_API) {
        await delay(100);
        const statuses = [...new Set(initialMockUsers.map(u => u.status))].sort();
        return { data: statuses };
    }
    const statuses = [...new Set(initialMockUsers.map(u => u.status))].sort();
    return { data: statuses }; // Fallback
};

const userService = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUniqueUserRoles,
  getUniqueUserStatuses,
  initialMockUsers,
};

export default userService;