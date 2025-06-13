// src/components/products/ProductAdminCard.jsx
import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getStatusClass } from '../../utils/helpers';

const ProductAdminCard = ({ product, isSelected, onSelectProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col relative ${isSelected ? 'border-habesha_blue ring-2 ring-habesha_blue' : 'border-gray-200'}`}>
      <input
        type="checkbox"
        className="absolute top-3 left-3 h-5 w-5 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue z-10"
        checked={isSelected}
        onChange={(e) => onSelectProduct(e, product.id)}
      />
      <div className='relative p-2 pt-10'>
        <img
          className='w-full h-48 object-contain bg-gray-50 rounded'
          src={product.image || 'https://via.placeholder.com/80x100/EEEEEE/AAAAAA?text=No+Image'}
          alt={product.name}
        />
        <span className={`absolute top-3 right-3 text-xs capitalize px-2 py-1 rounded-full font-medium ${getStatusClass(product.status)}`}>
          {product.status}
        </span>
      </div>
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='font-semibold text-habesha_blue text-md mb-1 truncate' title={product.name}>
          {product.name}
        </h3>
        <p className='text-xs text-gray-500 mb-1'>{product.category} <span className="mx-1">•</span> ID: {product.id}</p>
        <div className='flex items-center justify-between text-sm my-2'>
          <p className='text-gray-800 font-bold'>${product.price.toFixed(2)}</p>
          <p className={`font-medium text-xs ${product.stock > 5 ? 'text-gray-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            Stock: {product.stock}
          </p>
        </div>
        <p className="text-xs text-gray-400">Added: {product.dateAdded}</p>
        <div className='mt-auto pt-3 space-x-2 flex justify-end'>
          <button
            onClick={() => onEditProduct(product.id)}
            className='p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors'
            title="Edit Product"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDeleteProduct(product.id)}
            className='p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors'
            title="Delete Product"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAdminCard;