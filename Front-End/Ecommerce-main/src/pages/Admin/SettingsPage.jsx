// src/pages/admin/SettingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FiHome, FiCreditCard, FiTruck, FiBell, FiSliders, FiLoader, FiAlertTriangle } from 'react-icons/fi';

import settingsService from '../../service/settingsService';
import LoadingIndicator from '../../componets/common/LoadingIndicator';
import ErrorDisplay from '../../componets/common/ErrorDisplay';

import StoreInfoSettings from '../../componets/settings/StoreInfoSettings';
import PaymentSettings from '../../componets/settings/PaymentSettings';
import ShippingSettings from '../../componets/settings/ShippingSettings';
import NotificationSettings from '../../componets/settings/NotificationSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('storeInfo');
  const [settings, setSettings] = useState({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingStates, setSavingStates] = useState({}); // { [sectionKey]: isLoading }
  const [error, setError] = useState(null);
  const [lastSavedTimestamps, setLastSavedTimestamps] = useState({});

  const fetchSettings = useCallback(async () => {
    setLoadingSettings(true);
    setError(null);
    try {
      const response = await settingsService.getSettings();
      setSettings(response.data || {});
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError("Could not load settings. Please try again.");
      setSettings({});
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSection = async (sectionKey, sectionData) => {
    setSavingStates(prev => ({ ...prev, [sectionKey]: true }));
    setError(null); // Clear previous errors specific to save
    try {
      const response = await settingsService.updateSettingsSection(sectionKey, sectionData);
      setSettings(prev => ({ ...prev, [sectionKey]: response.data.settings ? response.data.settings[sectionKey] : sectionData }));
      setLastSavedTimestamps(prev => ({...prev, [sectionKey]: Date.now()}));
      alert(`${sectionKey.replace(/([A-Z])/g, ' $1').trim()} settings saved successfully!`); // Or use a toast notification
    } catch (err) {
      console.error(`Failed to save ${sectionKey} settings:`, err);
      setError(`Failed to save ${sectionKey.replace(/([A-Z])/g, ' $1').trim()} settings. ${err.message || ''}`);
    } finally {
      setSavingStates(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  const tabs = [
    { id: 'storeInfo', label: 'Store Information', icon: <FiHome />, component: StoreInfoSettings },
    { id: 'payment', label: 'Payment Details', icon: <FiCreditCard />, component: PaymentSettings },
    { id: 'shipping', label: 'Shipping', icon: <FiTruck />, component: ShippingSettings },
    { id: 'notifications', label: 'Notifications', icon: <FiBell />, component: NotificationSettings },
  ];

  const renderTabContent = () => {
    if (loadingSettings) {
      return <LoadingIndicator message="Loading settings..." />;
    }
    if (error && !settings) { // Major error preventing settings load
        return <ErrorDisplay details={error} onRetry={fetchSettings} />;
    }

    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return <p>Select a settings category.</p>;

    const TabComponent = currentTab.component;
    const sectionKey = currentTab.id;

    return (
      <TabComponent
        key={sectionKey}
        initialData={settings[sectionKey] || {}}
        initialCurrency={sectionKey === 'shipping' ? settings.storeInfo?.currency || '' : undefined}
        onSave={handleSaveSection}
        isLoading={savingStates[sectionKey] || false}
        sectionKey={sectionKey}
        lastSaved={lastSavedTimestamps[sectionKey]}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
          <FiSliders className="mr-3 text-gray-600" /> Settings
        </h1>
      </div>
      
      {error && !loadingSettings && <ErrorDisplay details={error} message="An error occurred" />}

      <div className="lg:flex lg:gap-x-6">
        <nav className="lg:w-1/4 xl:w-1/5 space-y-1 mb-6 lg:mb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150
                ${activeTab === tab.id
                  ? 'bg-habesha_blue text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              {React.cloneElement(tab.icon, { className: `mr-3 h-5 w-5 flex-shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'}` })}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;