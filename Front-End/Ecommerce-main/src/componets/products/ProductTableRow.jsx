import React from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { getStatusClass, getStatusDotClass } from '../../utils/helpers';

const ProductTableRow = ({ product, isSelected, onSelectProduct, onEditProduct, onDeleteProduct, onViewDetails }) => {
  return (
    <tr className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-habesha_blue/10' : ''}`}>
      <td className="p-4">
        <input 
          type="checkbox" 
          className="h-4 w-4 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue"
          checked={isSelected}
          onChange={(e) => onSelectProduct(e, product.id)}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <img 
            className="h-16 w-12 rounded-md object-cover mr-4 shadow-sm border border-gray-100 cursor-pointer" 
            src={product.image || 'https://via.placeholder.com/80x100/EEEEEE/AAAAAA?text=No+Image'} 
            alt={product.name} 
            onClick={() => onViewDetails(product.id)}
          />
          <span 
            className="text-sm font-medium text-gray-800 truncate max-w-xs cursor-pointer hover:text-habesha_blue" 
            title={product.name}
            onClick={() => onViewDetails(product.id)}
          >
            {product.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-semibold">${product.price.toFixed(2)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span className={`font-medium ${product.stock > 5 ? 'text-gray-700' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
          {product.stock}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(product.status)}`}>
          <span className={`mr-1.5 h-2 w-2 rounded-full ${getStatusDotClass(product.status)}`}></span>
          {product.status}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.dateAdded}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
        <button onClick={() => onViewDetails(product.id)} className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-100 transition-colors" title="View Details">
          <FiEye size={18} />
        </button>
        <button onClick={() => onEditProduct(product.id)} className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-100 transition-colors" title="Edit">
          <FiEdit2 size={18} />
        </button>
        <button onClick={() => onDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-100 transition-colors" title="Delete">
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default ProductTableRow;