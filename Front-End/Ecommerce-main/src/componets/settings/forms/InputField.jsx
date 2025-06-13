// src/components/settings/forms/InputField.jsx
import React from 'react';

const InputField = ({ label, id, type = 'text', value, onChange, name, placeholder, icon, helpText, disabled = false, required = false, step, min, max }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {icon && React.cloneElement(icon, { className: 'inline mr-2 h-4 w-4 text-gray-500' })}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name || id} // Ensure name attribute is present for form handling
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      step={step}
      min={min}
      max={max}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-habesha_blue focus:border-habesha_blue sm:text-sm disabled:bg-gray-50"
    />
    {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
  </div>
);

export default InputField;