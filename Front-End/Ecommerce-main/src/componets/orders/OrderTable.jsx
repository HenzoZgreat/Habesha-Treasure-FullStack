// src/components/orders/OrderTable.jsx
import React from 'react';
import OrderTableRow from './OrderTableRow';

const OrderTable = ({
  orders,
  selectedOrders,
  onSelectAll,
  onSelectOrder,
  onViewOrderDetails,
  onUpdateStatus,
  isAllCurrentPageSelected,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4 w-12 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue"
                  checked={isAllCurrentPageSelected && orders.length > 0}
                  onChange={onSelectAll}
                  disabled={orders.length === 0}
                />
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                isSelected={selectedOrders.includes(order.id)}
                onSelectOrder={onSelectOrder}
                onViewOrderDetails={onViewOrderDetails}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;