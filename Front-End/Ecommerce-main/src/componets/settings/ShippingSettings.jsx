// src/components/settings/ShippingSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import SettingsFormSection from './forms/SettingsFormSection';
// import ToggleSwitch from './forms/ToggleSwitch'; // If you add toggles for shipping options

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
        label="Default Shipping Method Name" 
        id="defaultMethod" 
        name="defaultMethod"
        value={formData.defaultMethod} 
        onChange={handleChange} 
        placeholder="e.g., Standard Ground" 
      />
      <InputField 
        label={`Free Shipping Threshold (${initialData.currency || '$'})`} // Dynamically show currency
        id="freeShippingThreshold" 
        name="freeShippingThreshold"
        type="number" 
        step="0.01"
        min="0"
        value={formData.freeShippingThreshold} 
        onChange={handleChange} 
        placeholder="100" 
        helpText="Order total above which shipping is free."
      />
      <InputField 
        label={`Handling Fee (${initialData.currency || '$'})`} 
        id="handlingFee" 
        name="handlingFee"
        type="number" 
        step="0.01"
        min="0"
        value={formData.handlingFee} 
        onChange={handleChange} 
        placeholder="2.50" 
        helpText="A flat fee added to each order for handling."
      />
      {/* 
        Future additions:
        - Shipping Zones (would require more complex UI: add/edit zone, set rates per zone)
        - Flat Rate options
        - Real-time carrier integration toggles (e.g., "Enable DHL")
      */}
    </SettingsFormSection>
  );
};

export default ShippingSettings;