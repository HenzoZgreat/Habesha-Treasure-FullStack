// src/components/common/LoadingIndicator.jsx
import React from 'react';
import { FiLoader } from 'react-icons/fi';

const LoadingIndicator = ({ message = "Loading...", fullPage = false }) => {
  const className = fullPage 
    ? "flex flex-col items-center justify-center h-[calc(100vh-8rem)]" // Adjust height for full page
    : "flex flex-col items-center justify-center py-10"; // For partial loading

  return (
    <div className={className}>
      <FiLoader className="animate-spin text-4xl text-habesha_blue mb-4" />
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};
export default LoadingIndicator;