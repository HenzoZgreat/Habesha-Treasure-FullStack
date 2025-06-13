// src/components/orders/OrderListHeader.jsx
import React from 'react';

const OrderListHeader = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-gray-800">Manage Orders</h1>
      {/* Add buttons for bulk actions if needed, e.g., "Export Selected" */}
    </div>
  );
};

export default OrderListHeader;