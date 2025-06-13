// src/components/settings/forms/ToggleSwitch.jsx
import React from 'react';

const ToggleSwitch = ({ label, id, name, checked, onChange, helpText, disabled = false }) => (
    <div className="flex items-center justify-between mb-4 py-2">
        <div>
            <label htmlFor={id} className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                {label}
            </label>
            {helpText && <p className={`mt-1 text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>{helpText}</p>}
        </div>
        <button
            type="button"
            id={id}
            name={name || id}
            onClick={() => !disabled && onChange({ target: { name: name || id, type: 'checkbox', checked: !checked }})} // Simulate event object
            className={`${
            checked ? 'bg-habesha_blue' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habesha_blue disabled:opacity-50 disabled:cursor-not-allowed`}
            role="switch"
            aria-checked={checked}
            disabled={disabled}
        >
            <span className="sr-only">Enable</span>
            <span
            className={`${
                checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
        </button>
    </div>
);

export default ToggleSwitch;