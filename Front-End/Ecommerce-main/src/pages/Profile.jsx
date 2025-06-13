import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../componets/api/api';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    region: '',
    city: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/SignIn');
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUserId(data.userId);
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          region: data.region || '',
          city: data.city || '',
          country: data.country || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response && [401, 403].includes(error.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        } else {
          setErrors({ general: 'Failed to load profile.' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate phone number: only digits, max length 10
    if (name === 'phoneNumber') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        setProfileData((prev) => ({ ...prev, [name]: numericValue }));
      }
      return;
    }

    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!profileData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!profileData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (profileData.phoneNumber && !/^\d{9,10}$/.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone must be 9-10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setSaving(true);
    setErrors({}); // Clear previous errors

    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/user/${userId}`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status !== 200) {
        throw new Error('Failed to save changes');
      }

      setErrors({ success: 'Profile saved successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      setErrors({ general: `Error saving profile: ${error.response?.data?.message || error.message}` });
      if (error.response && [401, 403].includes(error.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({}); // Clear errors
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          region: data.region || '',
          city: data.city || '',
          country: data.country || '',
        });
      } catch (error) {
        console.error('Failed to reset data:', error);
        setErrors({ general: 'Failed to reset profile data.' });
      }
    };
    fetchProfile();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-FEED">
        <p className="text-xl text-1D3F93">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-FEED rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <h1 className="text-3xl font-bold mb-6 text-1D3F93">User Profile</h1>

      {/* Show success or general errors */}
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

      {/* Personal Info */}
      <Section title="Personal Information" color="#1D3F93">
        <InputField label="First Name" name="firstName" value={profileData.firstName} onChange={handleChange} disabled={!isEditing} error={errors.firstName} />
        <InputField label="Last Name" name="lastName" value={profileData.lastName} onChange={handleChange} disabled={!isEditing} error={errors.lastName} />
      </Section>

      {/* Contact Info */}
      <Section title="Contact Information" color="#1D3F93">
        <InputField label="Email" name="email" value={profileData.email} onChange={handleChange} disabled={true} error={errors.email} />
        <InputField label="Phone Number" name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} disabled={!isEditing} error={errors.phoneNumber} placeholder="09 ---" />
      </Section>

      {/* Location Info */}
      <Section title="Location" color="#1D3F93">
        <InputField label="Region" name="region" value={profileData.region} onChange={handleChange} disabled={!isEditing} error={errors.region} />
        <InputField label="City" name="city" value={profileData.city} onChange={handleChange} disabled={!isEditing} error={errors.city} />
        <InputField label="Country" name="country" value={profileData.country} onChange={handleChange} disabled={!isEditing} error={errors.country} />
      </Section>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-1D3F93 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
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
          </>
        )}
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, name, value, onChange, disabled, error, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-1D3F93 transition-all ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      } ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Section Wrapper
const Section = ({ title, children, color }) => (
  <div className="mb-8 p-5 bg-D0D2DB rounded-md shadow-sm transition-all duration-300">
    <h2 className="text-xl font-semibold mb-4" style={{ color }}>
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

// Loading Spinner
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

export default Profile;