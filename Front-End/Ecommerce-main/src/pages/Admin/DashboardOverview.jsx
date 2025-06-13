// src/pages/admin/DashboardOverview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  FiDollarSign, FiShoppingCart, FiUsers, FiAlertOctagon,
} from 'react-icons/fi';

import dashboardService, { initialDashboardState } from '../../service/dashboardService';
import StatCard from '../../componets/dashbord/StatCard';
import RecentOrdersTable from '../../componets/dashbord/RecentOrdersTable';
import TopProductsList from '../../componets/dashbord/TopProductsList';
import QuickLinks from '../../componets/dashbord/QuickLinks';
import SalesChartPlaceholder from '../../componets/dashbord/SalesChartPlaceholder';
import LoadingIndicator from '../../componets/common/LoadingIndicator';
import ErrorDisplay from '../../componets/common/ErrorDisplay';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(initialDashboardState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardSummary();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load dashboard data. Please try again later.");
      setDashboardData(initialDashboardState); // Reset to initial on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array, fetchDashboardData itself doesn't change

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  if (loading) {
    return <LoadingIndicator message="Loading Dashboard Data..." fullPage={true} />;
  }

  if (error) {
    return <ErrorDisplay details={error} onRetry={fetchDashboardData} fullPage={true} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-700">Dashboard Overview</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={dashboardData.totalRevenue.value}
          icon={<FiDollarSign />}
          trend={dashboardData.totalRevenue.trend}
          trendColor="text-green-500"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders.value}
          icon={<FiShoppingCart />}
          trend={dashboardData.totalOrders.trend}
          trendColor={dashboardData.totalOrders.trend?.startsWith('+') ? "text-green-500" : "text-red-500"}
        />
        <StatCard
          title="New Customers"
          value={dashboardData.newCustomers.value}
          icon={<FiUsers />}
          trend={dashboardData.newCustomers.trend}
          trendColor="text-blue-500"
        />
        <StatCard
          title="Pending Orders"
          value={dashboardData.pendingOrders.value}
          icon={<FiAlertOctagon />}
          bgColor="bg-yellow-400" // Example custom color
          textColor="text-white"
          trendColor="text-yellow-100" // Ensure this contrasts with bgColor
        />
      </div>

      {/* Main Content Area - Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChartPlaceholder chartData={dashboardData.salesTrendData} />

        <div className="space-y-6">
          <TopProductsList products={dashboardData.topProducts} />
          <QuickLinks />
        </div>
      </div>

      <RecentOrdersTable orders={dashboardData.recentOrders} />
    </div>
  );
};

export default DashboardOverview;