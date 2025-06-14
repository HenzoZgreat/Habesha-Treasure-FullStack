import React, { useState } from 'react';
import { FiX, FiArrowLeft } from 'react-icons/fi';

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [descriptionLang, setDescriptionLang] = useState('en');

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold text-1D3F93">{product.name}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <img
            className="w-full h-48 object-cover rounded-md border border-gray-200"
            src={product.image || 'https://via.placeholder.com/400x200/EEEEEE/AAAAAA?text=No+Image'}
            alt={product.name}
          />
          <DetailField label="ID" value={product.id} />
          <DetailField label="Category" value={product.category} />
          <DetailField label="Price" value={`$${product.price.toFixed(2)}`} />
          <DetailField label="Stock" value={product.stock} />
          <DetailField label="Status" value={product.status} />
          <DetailField label="Date Added" value={product.dateAdded} />
          <DetailField label="Favorites" value={product.favorites} />
          <DetailField label="Featured" value={product.isFeatured ? 'Yes' : 'No'} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => setDescriptionLang('en')}
                className={`px-3 py-1 text-sm rounded-md ${descriptionLang === 'en' ? 'bg-1D3F93 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                English
              </button>
              <button
                onClick={() => setDescriptionLang('am')}
                className={`px-3 py-1 text-sm rounded-md ${descriptionLang === 'am' ? 'bg-1D3F93 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Amharic
              </button>
            </div>
            <p className="text-sm text-gray-600 p-3 border border-gray-200 rounded-md">
              {descriptionLang === 'en' ? product.descriptionEn || 'No description' : product.descriptionAm || 'መግለጫ የለም'}
            </p>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <p className="text-sm text-gray-600 p-2 border border-gray-200 rounded-md">{value}</p>
  </div>
);

export default ProductDetailsModal;