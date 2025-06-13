// src/components/settings/StoreInfoSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import SettingsFormSection from './forms/SettingsFormSection';

const StoreInfoSettings = ({ initialData, onSave, isLoading, sectionKey, lastSaved }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData); // Sync with parent if initialData changes
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // This component now just manages its local form state
  // The actual onSave prop will be called with the sectionKey and current formData
  // The parent (SettingsPage) will handle passing formData to the service.

  return (
    <SettingsFormSection title="Store Information" onSave={() => onSave(sectionKey, formData)} isLoading={isLoading} sectionKey={sectionKey} lastSaved={lastSaved}>
      <InputField label="Store Name" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your Store Name" required />
      <InputField label="Tagline" id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Your store's catchy phrase" />
      <InputField label="Contact Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="support@example.com" required />
      <InputField label="Phone Number" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251..." />
      {/* For textarea, you might create a TextAreaField or enhance InputField */}
      <InputField label="Store Address" id="address" name="address" type="text" value={formData.address} onChange={handleChange} placeholder="Full store address" />
      <InputField label="Logo URL" id="logoUrl" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" />
      <InputField label="Store Currency" id="currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="e.g., USD, ETB" required />
    </SettingsFormSection>
  );
};

export default StoreInfoSettings;