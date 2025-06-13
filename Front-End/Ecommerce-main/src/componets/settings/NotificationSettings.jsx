// src/components/settings/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import ToggleSwitch from './forms/ToggleSwitch';
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
        label="Admin Email for New Orders" 
        id="adminOrderEmail" 
        name="adminOrderEmail"
        type="email" 
        value={formData.adminOrderEmail} 
        onChange={handleChange} 
        placeholder="admin@example.com" 
        helpText="Email address where new order notifications will be sent."
      />
      <ToggleSwitch 
        label="Send Order Confirmation to Customer" 
        id="sendOrderConfirmation" 
        name="sendOrderConfirmation"
        checked={formData.sendOrderConfirmation} 
        onChange={handleChange} 
        helpText="Automatically send an email to customers after they place an order."
      />
      <ToggleSwitch 
        label="Send Shipping Update to Customer" 
        id="sendShippingUpdate"
        name="sendShippingUpdate"
        checked={formData.sendShippingUpdate} 
        onChange={handleChange} 
        helpText="Notify customers when their order has been shipped."
      />
      {/* 
        Future additions:
        - Inputs for customizing email templates (e.g., header image URL, footer text)
        - SMS notification settings (if using Twilio, etc.)
        - Webhook URLs for integrations
      */}
    </SettingsFormSection>
  );
};

export default NotificationSettings;