// src/components/common/ErrorDisplay.jsx
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const ErrorDisplay = ({ 
    message = "Oops! Something went wrong.", 
    details, 
    onRetry,
    fullPage = false 
}) => {
    const className = fullPage
    ? "flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6 bg-red-50 rounded-lg border border-red-200"
    : "flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200 my-4";
  return (
    <div className={className}>
      <FiAlertTriangle className="text-4xl text-red-500 mb-4" />
      <p className="text-lg font-semibold text-red-700">{message}</p>
      {details && <p className="text-md text-red-600">{details}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
export default ErrorDisplay;