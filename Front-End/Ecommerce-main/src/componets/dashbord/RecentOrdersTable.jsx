// src/components/dashboard/RecentOrdersTable.jsx
import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom'; // If you want to navigate

const getStatusClass = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Processing': return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled':
        case 'Failed':
             return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const RecentOrdersTable = ({ orders }) => {
  // const navigate = useNavigate();

  // const handleViewOrder = (orderId) => {
  //   navigate(`/admin/orders/${orderId}`);
  // };

  // const handleViewAllOrders = () => {
  //   navigate('/admin/orders');
  // };

  if (!orders || orders.length === 0) {
    return <p className="text-center py-8 text-sm text-gray-500">No recent orders to display.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Recent Orders</h2>
        <button
        //   onClick={handleViewAllOrders}
          className="text-sm text-habesha_blue hover:underline font-medium flex items-center"
        >
          View All Orders <FiExternalLink size={14} className="ml-1" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td
                //   onClick={() => handleViewOrder(order.id)}
                  className="px-5 py-4 whitespace-nowrap text-sm font-medium text-habesha_blue hover:underline cursor-pointer"
                >
                  {order.id}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{order.total}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;