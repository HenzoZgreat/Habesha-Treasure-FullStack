// src/components/products/NoProductsFound.jsx
import React from 'react';
import { FiPackage } from 'react-icons/fi';

const NoProductsFound = ({ message = "No products found", subMessage = "Try adjusting your search or filter criteria." }) => {
  return (
    <div className="text-center py-12 text-gray-500">
      <FiPackage size={48} className="mx-auto mb-3 text-gray-400" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm">{subMessage}</p>
    </div>
  );
};

export default NoProductsFound;