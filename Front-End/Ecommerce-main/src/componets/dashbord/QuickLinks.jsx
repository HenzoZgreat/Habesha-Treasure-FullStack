import React from 'react';
import { FiArchive, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const QuickLinks = () => {
  const navigate = useNavigate();

  const goToProducts = () => navigate('/admin/products');
  const goToMessages = () => navigate('/admin/messages');

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg">
      <h3 className="text-md font-semibold text-gray-700 mb-3">Quick Links</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={goToProducts}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <FiArchive size={16} className="mr-2" /> Manage Products
        </button>
        <button
          onClick={goToMessages}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <FiMessageSquare size={16} className="mr-2" /> View Messages
        </button>
      </div>
    </div>
  );
};

export default QuickLinks;