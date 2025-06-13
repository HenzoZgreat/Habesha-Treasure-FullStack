import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../componets/api/api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/SignIn');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          ...response.data,
          name: `${response.data.firstName} ${response.data.lastName}`,
          avatar: `https://via.placeholder.com/40/A9CCE3/2C3E50?text=${(response.data.firstName[0] + response.data.lastName[0]).toUpperCase()}`,
          status: response.data.enabled ? 'Active' : 'Suspended'
        });
      } catch (err) {
        console.error('Failed to load user:', err);
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        } else {
          setError('Failed to load user details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-FEED">
        <p className="text-xl text-1D3F93">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-FEED">
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-FEED">
      <div className="bg-white shadow-xl rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-1D3F93">User Details</h1>
          <Link
            to={`/admin/users/edit/${user.id}`}
            className="px-4 py-2 bg-1D3F93 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit User
          </Link>
        </div>
        <div className="flex items-center mb-6">
          <img
            className="h-16 w-16 rounded-full object-cover mr-4 shadow-sm"
            src={user.avatar}
            alt={user.name}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailField label="ID" value={user.id} />
          <DetailField label="Role" value={user.role} />
          <DetailField label="Status" value={user.status} />
          <DetailField label="Phone Number" value={user.phoneNumber || 'N/A'} />
          <DetailField label="City" value={user.city || 'N/A'} />
          <DetailField label="Region" value={user.region || 'N/A'} />
          <DetailField label="Country" value={user.country || 'N/A'} />
          <DetailField label="Joined" value={new Date(user.joined).toLocaleString()} />
          <DetailField label="Last Login" value={new Date(user.lastLogin).toLocaleString()} />
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
);

export default UserDetails;