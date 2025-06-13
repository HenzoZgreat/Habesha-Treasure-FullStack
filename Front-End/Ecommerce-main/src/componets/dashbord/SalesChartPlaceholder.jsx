// src/components/dashboard/SalesChartPlaceholder.jsx
import React from 'react';
// Example: import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const SalesChartPlaceholder = ({ chartData }) => {
    // const options = { /* ... chart options ... */ };
    // const data = {
    //   labels: chartData?.labels || [],
    //   datasets: chartData?.datasets || [],
    // };

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Trends</h2>
      <div className="h-72 bg-gradient-to-br from-habesha_blue/5 via-sky-50 to-transparent rounded-lg flex items-center justify-center">
        {/* <Line options={options} data={data} /> */}
        <p className="text-gray-400 text-lg">
            {chartData && chartData.labels && chartData.labels.length > 0 ? 
            "(Chart would render here)" : 
            "(Sales Trend Chart Placeholder - Data not available or use a charting library)"}
        </p>
      </div>
    </div>
  );
};

export default SalesChartPlaceholder;