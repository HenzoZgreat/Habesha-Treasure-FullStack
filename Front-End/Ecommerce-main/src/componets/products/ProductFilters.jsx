// src/components/products/ProductFilters.jsx
import React from 'react';
import { FiSearch, FiTrash2, FiList, FiGrid } from 'react-icons/fi';

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  categories, // Pass list of categories
  filterStatus,
  onStatusChange,
  statuses, // Pass list of statuses
  filterStock,
  onStockChange,
  selectedProductsCount,
  onDeleteSelected,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative md:col-span-2 lg:col-span-1">
          <label htmlFor="searchProduct" className="sr-only">Search Products</label>
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="searchProduct"
            type="search"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="categoryFilter" className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={onCategoryChange}
            className="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={onStatusChange}
            className="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm"
          >
            <option value="All">All Statuses</option>
            {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="stockFilter" className="block text-xs font-medium text-gray-500 mb-1">Stock Level</label>
          <select
            id="stockFilter"
            value={filterStock}
            onChange={onStockChange}
            className="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm"
          >
            <option value="All">All Stock Levels</option>
            <option value="InStock">In Stock (above 5)</option>
            <option value="LowStock">Low Stock (1-5)</option>
            <option value="OutOfStock">Out of Stock (0)</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between pt-3 gap-3">
        <div className="flex items-center space-x-3">
          {selectedProductsCount > 0 && (
            <button
              onClick={onDeleteSelected}
              className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center px-3 py-1.5 rounded-md border border-red-300 hover:bg-red-50"
            >
              <FiTrash2 className="mr-1.5 h-4 w-4" /> Delete Selected ({selectedProductsCount})
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('list')}
            title="List View"
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-habesha_blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          > <FiList size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('card')}
            title="Card View"
            className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-habesha_blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          > <FiGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;