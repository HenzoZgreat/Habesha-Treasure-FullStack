// src/components/dashboard/StatCard.jsx
import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const StatCard = ({ title, value, icon, trend, trendColor, bgColor = 'bg-white', textColor = 'text-habesha_blue' }) => (
  <div className={`${bgColor} p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}>
    <div className="flex items-center justify-between mb-2">
      <div className={`p-3 rounded-full bg-opacity-20 ${bgColor === 'bg-white' ? 'bg-habesha_blue' : 'bg-white'}`}>
        {React.cloneElement(icon, { size: 22, className: bgColor === 'bg-white' ? 'text-habesha_blue' : 'text-white' })}
      </div>
      {trend && (
        <span className={`text-xs font-semibold flex items-center ${trendColor || 'text-gray-500'}`}>
          <FiTrendingUp size={14} className="mr-1" /> {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold mt-1 ${textColor}`}>{value}</p>
  </div>
);

export default StatCard;