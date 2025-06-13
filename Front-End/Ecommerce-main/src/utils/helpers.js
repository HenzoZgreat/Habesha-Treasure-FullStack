export const getStatusClass = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700';
    case 'Out of Stock': return 'bg-red-100 text-red-700';
    case 'Low Stock': return 'bg-yellow-100 text-yellow-700';
    case 'Draft': return 'bg-gray-200 text-gray-600';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export const getStatusDotClass = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-500';
    case 'Out of Stock': return 'bg-red-500';
    case 'Low Stock': return 'bg-yellow-500';
    case 'Draft': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};
export const getOrderStatusClass = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-700';
    case 'Processing': return 'bg-blue-100 text-blue-700';
    case 'Shipped': return 'bg-indigo-100 text-indigo-700';
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    case 'Refunded': return 'bg-gray-200 text-gray-700'; // Adjusted for better contrast
    default: return 'bg-gray-100 text-gray-500';
  }
};

export const getUserStatusClass = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700';
    case 'Inactive': return 'bg-gray-200 text-gray-600';
    case 'Suspended': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-500';
  }
};

// As before, icon rendering will be handled in the component using this for simplicity.
// You could also create a getUserStatusIconComponent like this:
/*
import { FiUserCheck, FiUserX } from 'react-icons/fi';

export const getUserStatusIconComponent = (status) => {
    switch (status) {
      case 'Active': return <FiUserCheck className="mr-1.5 h-3 w-3 inline-block" />;
      case 'Inactive': return <FiUserX className="mr-1.5 h-3 w-3 inline-block text-gray-400" />;
      case 'Suspended': return <FiUserX className="mr-1.5 h-3 w-3 inline-block text-red-500" />;
      default: return null;
    }
};*/