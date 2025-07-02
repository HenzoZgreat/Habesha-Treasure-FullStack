// src/components/settings/ShippingSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import SettingsFormSection from './forms/SettingsFormSection';

const ShippingSettings = ({ initialData, onSave, isLoading, sectionKey, lastSaved }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (parseFloat(value) || 0) : value 
    }));
  };

  return (
    <SettingsFormSection title="Shipping" onSave={() => onSave(sectionKey, formData)} isLoading={isLoading} sectionKey={sectionKey} lastSaved={lastSaved}>
      <InputField 
        label="Minimum Amount for Free Shipping (ETB)" 
        id="freeShippingThreshold" 
        name="freeShippingThreshold"
        type="number" 
        step="0.01"
        min="0"
        value={formData.freeShippingThreshold || ''} 
        onChange={handleChange} 
        placeholder="e.g., 1000" 
        helpText="Order total above which shipping is free."
      />
    </SettingsFormSection>
  );
};

export default ShippingSettings;