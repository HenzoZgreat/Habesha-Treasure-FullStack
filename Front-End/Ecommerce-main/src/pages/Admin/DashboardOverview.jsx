import React, { useState, useEffect, useCallback } from 'react';
import {
  FiDollarSign, FiShoppingCart, FiUsers, FiAlertOctagon,
} from 'react-icons/fi';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import adminDashboardService from '../../service/adminDashboardService';
import StatCard from '../../componets/dashbord/StatCard';
import RecentOrdersTable from '../../componets/dashbord/RecentOrdersTable';
import TopProductsList from '../../componets/dashbord/TopProductsList';
import QuickLinks from '../../componets/dashbord/QuickLinks';
import LoadingIndicator from '../../componets/common/LoadingIndicator';
import ErrorDisplay from '../../componets/common/ErrorDisplay';


const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: { value: 0, trend: '0.00%' },
    totalOrders: { value: 0, trend: '0.00%' },
    newCustomers: { value: 0, trend: '0.00%' },
    pendingOrders: { value: 0, trend: '0.00%' },
    salesTrendData: { labels: [], datasets: [] },
    topProducts: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('USD');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryResponse, ordersResponse] = await Promise.all([
        adminDashboardService.getDashboardSummary(currency, new Date().toISOString().split('T')[0], 7),
        adminDashboardService.getRecentOrders()
      ]);
      const data = summaryResponse.data;
      setDashboardData({
        ...data,
        totalRevenue: { 
          value: data.totalRevenue.value, 
          trend: data.totalRevenue.trend != null ? (String(data.totalRevenue.trend).slice(0, 4) + '%') : '0.00%' 
        },
        totalOrders: { 
          value: data.totalOrders.value, 
          trend: data.totalOrders.trend != null ? (String(data.totalOrders.trend).slice(0, 4) + '%') : '0.00%' 
        },
        newCustomers: { 
          value: data.newCustomers.value, 
          trend: data.newCustomers.trend != null ? (String(data.newCustomers.trend).slice(0, 4) + '%') : '0.00%' 
        },
        pendingOrders: { 
          value: data.pendingOrders.value, 
          trend: data.pendingOrders.trend != null ? (String(data.pendingOrders.trend).slice(0, 4) + '%') : '0.00%' 
        },
        recentOrders: ordersResponse.data,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Could not load dashboard data. Please try again later.');
      setDashboardData({
        totalRevenue: { value: 0, trend: '0.00%' },
        totalOrders: { value: 0, trend: '0.00%' },
        newCustomers: { value: 0, trend: '0.00%' },
        pendingOrders: { value: 0, trend: '0.00%' },
        salesTrendData: { labels: [], datasets: [] },
        topProducts: [],
        recentOrders: [],
      });
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Sales Trends' } },
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCurrencyToggle = () => {
    setCurrency(currency === 'USD' ? 'ETB' : 'USD');
  };

  if (loading) {
    return <LoadingIndicator message="Loading Dashboard Data..." fullPage={true} />;
  }

  if (error) {
    return <ErrorDisplay details={error} onRetry={fetchDashboardData} fullPage={true} />;
  }

  return (
    <div className="space-y-8 px-4 sm:px-0 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-700">Dashboard Overview</h1>
        <button
          onClick={handleCurrencyToggle}
          className="px-4 py-2 bg-habesha_blue text-white rounded hover:bg-opacity-90 w-full sm:w-auto"
        >
          Switch to {currency === 'USD' ? 'ETB' : 'USD'}
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatNumber(dashboardData.totalRevenue.value)}
          icon={<FiDollarSign />}
          trend={dashboardData.totalRevenue.trend}
          trendColor="text-green-500"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(dashboardData.totalOrders.value)}
          icon={<FiShoppingCart />}
          trend={dashboardData.totalOrders.trend}
          trendColor={dashboardData.totalOrders.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}
        />
        <StatCard
          title="New Customers"
          value={formatNumber(dashboardData.newCustomers.value)}
          icon={<FiUsers />}
          trend={dashboardData.newCustomers.trend}
          trendColor="text-blue-500"
        />
        <StatCard
          title="Pending Orders"
          value={formatNumber(dashboardData.pendingOrders.value)}
          icon={<FiAlertOctagon />}
          bgColor="bg-yellow-400"
          textColor="text-white"
          trend={dashboardData.pendingOrders.trend}
          trendColor="text-yellow-100"
        />
      </div>

      {/* Main Content Area - Charts, Products, and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Trends</h2>
          <div className="h-72">
            <Line data={dashboardData.salesTrendData} options={chartOptions} />
          </div>
        </div>

        <div className="space-y-6">
          <TopProductsList products={dashboardData.topProducts} />
          <QuickLinks />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <RecentOrdersTable orders={dashboardData.recentOrders} />
      </div>
    </div>
  );
};

export default DashboardOverview;