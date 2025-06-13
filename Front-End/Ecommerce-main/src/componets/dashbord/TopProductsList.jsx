// src/components/dashboard/TopProductsList.jsx
import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

const TopProductsList = ({ products }) => {
  // const navigate = useNavigate();
  // const handleViewAllProducts = () => {
  //   navigate('/admin/products'); // Assuming this is your products management route
  // };

  if (!products || products.length === 0) {
    return <p className="text-sm text-gray-500">No top products data available.</p>;
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">
      <h3 className="text-md font-semibold text-gray-700 mb-3">Top Selling Products</h3>
      <ul className="space-y-3">
        {products.map(product => (
          <li key={product.name} className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded-md">
            <div className="flex items-center">
              <img src={product.image} alt={product.name} className="w-8 h-8 rounded-md mr-3 object-cover" />
              <span className="text-gray-600 truncate max-w-[150px] sm:max-w-[180px] md:max-w-[200px]">{product.name}</span>
            </div>
            <span className="font-semibold text-habesha_blue">{product.sales} sales</span>
          </li>
        ))}
      </ul>
      <button
        // onClick={handleViewAllProducts}
        className="mt-4 w-full text-center text-sm text-habesha_blue hover:underline font-medium flex items-center justify-center"
      >
        View All Products <FiExternalLink size={14} className="ml-1" />
      </button>
    </div>
  );
};

export default TopProductsList;