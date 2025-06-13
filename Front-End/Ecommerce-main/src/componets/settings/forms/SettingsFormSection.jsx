// src/components/settings/forms/SettingsFormSection.jsx
import React from 'react';
import { FiSave } from 'react-icons/fi';

const SettingsFormSection = ({ title, children, onSave, isLoading, sectionKey, lastSaved }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(sectionKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Optional: Display title within the form if not handled by parent tab */}
      {/* <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{title}</h3> */}
      {children}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-habesha_blue hover:bg-opacity-90 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <FiSave className="mr-2 h-5 w-5" /> {isLoading ? 'Saving...' : `Save ${title}`}
        </button>
        {lastSaved && <p className="text-xs text-green-600">Last saved: {new Date(lastSaved).toLocaleTimeString()}</p>}
      </div>
    </form>
  );
};

export default SettingsFormSection;