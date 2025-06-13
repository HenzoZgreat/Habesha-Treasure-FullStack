// src/services/dashboardService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/admin/dashboard-summary';
const USE_MOCK_API = true;

// Initial state if API fails or for placeholders
export const initialDashboardState = {
  totalRevenue: { value: '---', trend: '' },
  totalOrders: { value: '---', trend: '' },
  newCustomers: { value: '---', trend: '' },
  pendingOrders: { value: '---' }, // trendColor will be applied in component
  recentOrders: [],
  topProducts: [],
  // You can add more fields here for sales trends data, etc.
  salesTrendData: { labels: [], datasets: [] } // Placeholder for chart data
};

const getDashboardSummary = async () => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    const mockFetchedData = {
      totalRevenue: { value: '$45,231.89', trend: '+2.5%' },
      totalOrders: { value: '1,280', trend: '-1.2%' },
      newCustomers: { value: '85', trend: '+15' },
      pendingOrders: { value: '12' }, // Removed trendColor, handled by component
      recentOrders: [
        { id: 'ORD-001', customer: 'Nati D.', total: '$120.50', status: 'Processing', date: '2023-10-27' },
        { id: 'ORD-002', customer: 'Abebe B.', total: '$75.00', status: 'Shipped', date: '2023-10-26' },
        { id: 'ORD-003', customer: 'Sara T.', total: '$210.00', status: 'Delivered', date: '2023-10-25' },
      ],
      topProducts: [
        { name: 'Habesha Kemis - Elegant', sales: 150, image: 'https://via.placeholder.com/40?text=HK' },
        { name: 'Gabi - Warm Weave', sales: 120, image: 'https://via.placeholder.com/40?text=GB' },
        
      ],
      salesTrendData: { // Example data for a chart
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales',
          data: [1200, 1900, 3000, 5000, 2300, 3200],
          borderColor: '#4A90E2', // habesha_blue
          tension: 0.1
        }]
      }
    };
    return { data: mockFetchedData };
  }
  // Real API call
  // Ensure your backend returns data in a similar structure or adapt it here
  return axios.get(API_URL, {
    // headers: { /* Authorization if needed */ }
  });
};

const dashboardService = {
  getDashboardSummary,
  initialDashboardState, // Export initial state for easy access
};

export default dashboardService;