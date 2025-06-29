import React from 'react';
import { FiSearch } from 'react-icons/fi';

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  statuses,
  filterDateFrom,
  onDateFromChange,
  filterDateTo,
  onDateToChange,
  selectedOrdersCount,
}) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative md:col-span-2 lg:col-span-1">
          <label htmlFor="searchOrder" className="sr-only">Search Orders</label>
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="searchOrder"
            type="search"
            placeholder="Search by ID, customer..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={onStatusChange}
            className="w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm"
          >
            {statuses.map(stat => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dateFromFilter" className="block text-xs font-medium text-gray-500 mb-1">Date From</label>
          <input
            type="date"
            id="dateFromFilter"
            value={filterDateFrom}
            onChange={onDateFromChange}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label htmlFor="dateToFilter" className="block text-xs font-medium text-gray-500 mb-1">Date To</label>
          <input
            type="date"
            id="dateToFilter"
            value={filterDateTo}
            onChange={onDateToChange}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm"
          />
        </div>
      </div>
      {selectedOrdersCount > 0 && (
        <div className="pt-3">
          <p className="text-sm text-habesha_blue font-medium">{selectedOrdersCount} order(s) selected.</p>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;