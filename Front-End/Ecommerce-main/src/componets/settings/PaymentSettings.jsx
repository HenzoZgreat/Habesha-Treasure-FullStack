// src/components/settings/PaymentSettings.jsx
import React, { useState, useEffect } from 'react';
import InputField from './forms/InputField';
import ToggleSwitch from './forms/ToggleSwitch';
import SettingsFormSection from './forms/SettingsFormSection';
import settingsService from '../../service/settingsService'; // For testStripeConnection
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const PaymentSettings = ({ initialData, onSave, isLoading, sectionKey, lastSaved }) => {
  const [formData, setFormData] = useState(initialData);
  const [stripeTestResult, setStripeTestResult] = useState(null);
  const [isTestingStripe, setIsTestingStripe] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'stripeApiKey') setStripeTestResult(null); // Reset test result on key change
  };

  const handleTestStripe = async () => {
    if (!formData.stripeApiKey) {
        setStripeTestResult({ success: false, message: "Please enter a Stripe API Key."});
        return;
    }
    setIsTestingStripe(true);
    setStripeTestResult(null);
    try {
        const result = await settingsService.testStripeConnection(formData.stripeApiKey);
        setStripeTestResult(result.data);
    } catch (error) {
        setStripeTestResult({ success: false, message: error.response?.data?.message || "Failed to test Stripe connection." });
    } finally {
        setIsTestingStripe(false);
    }
  };

  return (
    <SettingsFormSection title="Payment Gateways" onSave={() => onSave(sectionKey, formData)} isLoading={isLoading} sectionKey={sectionKey} lastSaved={lastSaved}>
      <h3 className="text-md font-semibold text-gray-600 mb-2 border-b pb-2">Stripe</h3>
      <ToggleSwitch label="Enable Stripe" id="enableStripe" name="enableStripe" checked={formData.enableStripe} onChange={handleChange} />
      {formData.enableStripe && (
        <>
          <InputField 
            label="Stripe API Secret Key" 
            id="stripeApiKey" 
            name="stripeApiKey" 
            type="password" 
            value={formData.stripeApiKey} 
            onChange={handleChange} 
            placeholder="sk_test_xxxxxxxxxxxx" 
            helpText="Your secret key will not be displayed again after saving."
          />
          <button 
            type="button" 
            onClick={handleTestStripe} 
            disabled={isTestingStripe || !formData.stripeApiKey}
            className="mb-4 text-sm text-habesha_blue hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {isTestingStripe ? 'Testing...' : 'Test Stripe Connection'}
          </button>
          {stripeTestResult && (
            <div className={`flex items-center text-sm p-2 rounded mb-3 ${stripeTestResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stripeTestResult.success ? <FiCheckCircle className="mr-2"/> : <FiXCircle className="mr-2"/>}
                {stripeTestResult.message}
            </div>
          )}
        </>
      )}

      <h3 className="text-md font-semibold text-gray-600 mb-2 mt-6 border-b pb-2">PayPal</h3>
      <ToggleSwitch label="Enable PayPal" id="enablePaypal" name="enablePaypal" checked={formData.enablePaypal} onChange={handleChange} />
      {formData.enablePaypal && (
        <InputField 
            label="PayPal Client ID" 
            id="paypalClientId" 
            name="paypalClientId" 
            value={formData.paypalClientId} 
            onChange={handleChange} 
            placeholder="AZxxxxxxxxxxxxxxx" 
        />
        // Add PayPal Secret, environment (Sandbox/Live) fields if needed
      )}
    </SettingsFormSection>
  );
};

export default PaymentSettings;