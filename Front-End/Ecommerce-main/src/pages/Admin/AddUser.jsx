import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../componets/api/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: 'USER',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    city: '',
    country: '',
    region: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!userData.password || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(userData.password)) {
      newErrors.password = 'Password must be at least 8 characters with a letter, a number, and a special character';
    }
    if (!userData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!userData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!userData.phoneNumber || !/^\d{10}$/.test(userData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone must be 10 digits';
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
      await api.post('/admin/users', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setErrors({ success: 'User created successfully!' });
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (err) {
      console.error('Create error:', err);
      const errorMessage = err.response?.data || 'Error creating user';
      setErrors({ general: errorMessage });
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-FEED rounded-lg shadow-lg transition-all duration-300">
      <h1 className="text-3xl font-bold mb-6 text-1D3F93">Add New User</h1>

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
        <div className="mb-6 p-4 bg-gray-100 border-l-4 border-red-500 text-red-600">
          <ul>
            {Object.entries(errors).map(([key, value], index) => (
              <li key={index}>• {value}</li>
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
          <InputField
            label="Password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            placeholder="09 ---"
          />
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
        </Section>

        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving && <Spinner />}
            <span>{saving ? 'Creating...' : 'Create User'}</span>
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

const InputField = ({ label, name, value, onChange, error, placeholder, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
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

export default AddUser;