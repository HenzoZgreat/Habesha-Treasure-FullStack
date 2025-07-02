// src/components/settings/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import SettingsFormSection from './forms/SettingsFormSection';

const NotificationSettings = ({ initialData, onSave, isLoading, sectionKey, lastSaved }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <SettingsFormSection title="Notifications" onSave={() => onSave(sectionKey, formData)} isLoading={isLoading} sectionKey={sectionKey} lastSaved={lastSaved}>
      <InputField 
        label="Admin Notification Email" 
        id="adminOrderEmail" 
        name="adminOrderEmail"
        type="email" 
        value={formData.adminOrderEmail || ''} 
        onChange={handleChange} 
        placeholder="admin@example.com" 
        helpText="Email address for admin notifications."
      />
    </SettingsFormSection>
  );
};

export default NotificationSettings;