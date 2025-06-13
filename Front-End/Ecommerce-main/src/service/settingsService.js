// src/services/settingsService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/admin/settings';
const USE_MOCK_API = true;

export const initialSettings = {
  storeInfo: {
    name: 'Habesha Store',
    tagline: 'Authentic Ethiopian Crafts & Goods',
    email: 'contact@habeshastore.com',
    phone: '+251 911 123456',
    address: '123 Bole Road, Addis Ababa, Ethiopia',
    logoUrl: 'https://via.placeholder.com/150/A9CCE3/2C3E50?text=LOGO',
    currency: 'ETB',
  },
  payment: {
    stripeApiKey: '', // Keep sensitive keys empty by default
    paypalClientId: '',
    enableStripe: true,
    enablePaypal: false,
  },
  shipping: {
    defaultMethod: 'Standard Shipping',
    freeShippingThreshold: 100,
    handlingFee: 2.50,
    // Add more complex shipping settings if needed, e.g., zones: []
  },
  notifications: {
    adminOrderEmail: 'admin@habeshastore.com',
    sendOrderConfirmation: true,
    sendShippingUpdate: true,
    // Add template IDs or webhook URLs here
  }
};

let mockSettingsStore = JSON.parse(JSON.stringify(initialSettings)); // Deep copy for mock

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getSettings = async () => {
  if (USE_MOCK_API) {
    await delay(500);
    return { data: JSON.parse(JSON.stringify(mockSettingsStore)) }; // Return a copy
  }
  return axios.get(API_URL);
};

// It's often better to update settings per section
const updateSettingsSection = async (sectionKey, sectionData) => {
  if (USE_MOCK_API) {
    await delay(1000);
    if (mockSettingsStore.hasOwnProperty(sectionKey)) {
      mockSettingsStore[sectionKey] = { ...mockSettingsStore[sectionKey], ...sectionData };
      console.log(`Mock API: Updated ${sectionKey}`, mockSettingsStore[sectionKey]);
      return { data: { message: `${sectionKey} settings updated successfully.`, settings: mockSettingsStore[sectionKey] } };
    }
    return Promise.reject({ message: `Section ${sectionKey} not found.`});
  }
  return axios.put(`${API_URL}/${sectionKey}`, sectionData);
};

// Example specific functions (you might not need these if updateSettingsSection is generic enough)
const testStripeConnection = async (apiKey) => {
    if (USE_MOCK_API) {
        await delay(700);
        if (apiKey && apiKey.startsWith('sk_test_')) {
            return { data: { success: true, message: "Stripe connection successful (mock)." }};
        }
        return { data: { success: false, message: "Invalid Stripe API key (mock)." }};
    }
    // Real API: POST to a backend endpoint that uses the apiKey to make a test call to Stripe
    return axios.post(`${API_URL}/payment/test-stripe`, { apiKey });
};


const settingsService = {
  getSettings,
  updateSettingsSection,
  testStripeConnection, // Example specific action
  initialSettings, // Export for initial state
};

export default settingsService;