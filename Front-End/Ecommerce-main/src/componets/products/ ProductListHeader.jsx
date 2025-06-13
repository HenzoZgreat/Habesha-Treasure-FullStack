// src/components/products/ProductListHeader.jsx
import React from 'react';
import { FiPlus } from 'react-icons/fi';

const ProductListHeader = ({ onAddProduct }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
      <button
        onClick={onAddProduct}
        className="bg-habesha_blue hover:bg-opacity-90 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm flex items-center transition-colors text-sm"
      >
        <FiPlus className="mr-2 h-5 w-5" /> Add New Product
      </button>
    </div>
  );
};

export default ProductListHeader;