// src/components/settings/StoreInfoSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import SettingsFormSection from './forms/SettingsFormSection';

const StoreInfoSettings = ({ initialData, onSave, isLoading, sectionKey, lastSaved }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SettingsFormSection title="Store Information" onSave={() => onSave(sectionKey, formData)} isLoading={isLoading} sectionKey={sectionKey} lastSaved={lastSaved}>
      <InputField label="Company Name" id="name" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Your Company Name" required />
      <InputField label="ETB to USD Exchange Rate" id="exchangeRate" name="exchangeRate" type="number" step="0.01" min="0" value={formData.exchangeRate || ''} onChange={handleChange} placeholder="e.g., 58.00" helpText="Rate for converting ETB to USD." />
      <InputField label="Store Contact Phone" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+251..." />
      <InputField label="Store Contact Email" id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="contact@example.com" required />
      <InputField label="Store Currency" id="currency" name="currency" value={formData.currency || ''} onChange={handleChange} placeholder="e.g., ETB" required />
    </SettingsFormSection>
  );
};

export default StoreInfoSettings;