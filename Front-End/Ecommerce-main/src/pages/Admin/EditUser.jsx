import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../componets/api/api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    country: '',
    region: '',
    enabled: true,
    role: 'USER'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
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
        setUserData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          city: response.data.city || '',
          country: response.data.country || '',
          region: response.data.region || '',
          enabled: response.data.enabled,
          role: response.data.role || 'USER'
        });
      } catch (err) {
        console.error('Failed to load user:', err);
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        } else {
          setErrors({ general: 'Failed to load user data.' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!userData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!userData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (userData.phoneNumber && !/^\d{9,10}$/.test(userData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone must be 9-10 digits';
    }
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!userData.role) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setSaving(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setErrors({ success: 'User updated successfully!' });
      setTimeout(() => navigate(`/admin/users/${id}`), 2000);
    } catch (err) {
      console.error('Save error:', err);
      setErrors({ general: `Error saving user: ${err.response?.data?.message || err.message}` });
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/users/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-FEED">
        <p className="text-xl text-1D3F93">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-FEED rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <h1 className="text-3xl font-bold mb-6 text-1D3F93">Edit User</h1>

      {errors.success && (
        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          {errors.success}
        </div>
      )}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {errors.general}
        </div>
      )}
      {Object.keys(errors).length > 0 && !errors.general && !errors.success && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <ul>
            {Object.entries(errors).map(([key, msg], index) => (
              <li key={index}>• {msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl p-6">
        <Section title="Personal Information" color="#1D3F93">
          <InputField label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} error={errors.firstName} />
          <InputField label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} error={errors.lastName} />
        </Section>

        <Section title="Contact Information" color="#1D3F93">
          <InputField label="Email" name="email" value={userData.email} onChange={handleChange} error={errors.email} />
          <InputField label="Phone Number" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} placeholder="09 ---" />
        </Section>

        <Section title="Location" color="#1D3F93">
          <InputField label="Region" name="region" value={userData.region} onChange={handleChange} />
          <InputField label="City" name="city" value={userData.city} onChange={handleChange} />
          <InputField label="Country" name="country" value={userData.country} onChange={handleChange} />
        </Section>

        <Section title="Account Settings" color="#1D3F93">
          <SelectField
            label="Role"
            name="role"
            value={userData.role}
            onChange={handleChange}
            options={['ADMIN', 'USER']}
            error={errors.role}
          />
          <CheckboxField
            label="Status"
            name="enabled"
            checked={userData.enabled}
            onChange={handleChange}
            description={userData.enabled ? 'Active' : 'Suspended'}
          />
        </Section>

        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving && <Spinner />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, error, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-1D3F93 transition-all ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-1D3F93 transition-all ${error ? 'border-red-500' : ''}`}
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CheckboxField = ({ label, name, checked, onChange, description }) => (
  <div className="mb-4">
    <label className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue"
      />
      <span className="ml-2 text-sm font-medium text-gray-700">{label}: {description}</span>
    </label>
  </div>
);

const Section = ({ title, children, color }) => (
  <div className="mb-8 p-5 bg-D0D2DB rounded-md shadow-sm transition-all duration-300">
    <h2 className="text-xl font-semibold mb-4" style={{ color }}>{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default EditUser;