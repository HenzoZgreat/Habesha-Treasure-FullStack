// src/pages/ManageOrders.jsx
import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

import OrderListHeader from '../componets/orders/OrderListHeader';
import OrderFilters from '../componets/orders/OrderFilters';
import OrderTable from '../componets/orders/OrderTable';
import NoProductsFound from '../componets/products/NoProductsFound'; // Reusing this
import PaginationControls from '../componets/common/PaginationControls';
import orderService from '../service/orderService';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

const ORDERS_PER_PAGE = 7;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  
  const [orderStatuses, setOrderStatuses] = useState([]);

  // Selection
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    // setSelectedOrders([]); // Decide if selection should clear on every fetch
    try {
      const params = {
        page: currentPage,
        limit: ORDERS_PER_PAGE,
        searchTerm: searchTerm || undefined,
        status: filterStatus === 'All' ? undefined : filterStatus,
        dateFrom: filterDateFrom || undefined,
        dateTo: filterDateTo || undefined,
      };
      const response = await orderService.getOrders(params);
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalOrders);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const statusRes = await orderService.getUniqueOrderStatuses();
        setOrderStatuses(statusRes.data);
      } catch (err) {
        console.error("Failed to fetch order statuses:", err);
        setOrderStatuses([...new Set(orderService.initialMockOrders.map(o => o.status))].sort());
      }
    };
    fetchFilterOptions();
  }, []);

  // Filter change handlers
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleStatusChange = (e) => { setFilterStatus(e.target.value); setCurrentPage(1); };
  const handleDateFromChange = (e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); };
  const handleDateToChange = (e) => { setFilterDateTo(e.target.value); setCurrentPage(1); };
  
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  // --- Order Actions ---
  const handleViewOrderDetails = async (orderId) => {
    // navigate(`/admin/orders/${orderId}`);
    try {
        setLoading(true); // Optional: show loading for fetching details
        const response = await orderService.getOrderById(orderId);
        const orderDetails = response.data;
        alert(`Viewing details for Order ID: ${orderId}\nCustomer: ${orderDetails.customerName}\nTotal: $${orderDetails.total.toFixed(2)}`);
        console.log("Order Details:", orderDetails);
    } catch (err) {
        alert(`Could not fetch details for order ${orderId}.`);
        console.error("Failed to fetch order details:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // Optional: Add a more specific confirmation based on status change
    if (window.confirm(`Change status of order ${orderId} to "${newStatus}"?`)) {
      try {
        setLoading(true);
        await orderService.updateOrderStatus(orderId, newStatus);
        alert(`Order ${orderId} status updated to ${newStatus}.`);
        // Refetch or optimistically update UI
        // To ensure paymentStatus is also updated visually if changed by backend logic:
        fetchOrders(); 
      } catch (err) {
        console.error("Failed to update order status:", err);
        alert(`Failed to update status for order ${orderId}.`);
        setLoading(false);
      }
    }
  };

  // --- Selection Logic ---
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (event, orderId) => {
    if (event.target.checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const isAllCurrentPageSelected = orders.length > 0 && selectedOrders.length === orders.length;

  // Render logic
  const renderContent = () => {
    if (loading && orders.length === 0) { // Show main loader only if no data is displayed yet
      return (
        <div className="text-center py-12 text-gray-500">
          <FiLoader size={48} className="mx-auto mb-3 text-habesha_blue animate-spin" />
          <p className="text-lg font-medium">Loading orders...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-12 text-red-600 bg-red-50 p-6 rounded-lg">
          <FiAlertTriangle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-habesha_blue text-white rounded hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      );
    }
    if (orders.length === 0 && !loading) { // Ensure loading is false before showing no orders
      const isFiltered = searchTerm || filterStatus !== 'All' || filterDateFrom || filterDateTo;
      return <NoProductsFound
                message={isFiltered ? "No orders match your criteria" : "No orders found"}
                subMessage={isFiltered ? "Try adjusting your search or filters." : "There are currently no orders to display."}
             />;
    }
    return (
      <OrderTable
        orders={orders}
        selectedOrders={selectedOrders}
        onSelectAll={handleSelectAll}
        onSelectOrder={handleSelectOrder}
        onViewOrderDetails={handleViewOrderDetails}
        onUpdateStatus={handleUpdateOrderStatus}
        isAllCurrentPageSelected={isAllCurrentPageSelected}
      />
    );
  };

  return (
    <div className="space-y-6">
      <OrderListHeader />

      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onStatusChange={handleStatusChange}
        statuses={orderStatuses}
        filterDateFrom={filterDateFrom}
        onDateFromChange={handleDateFromChange}
        filterDateTo={filterDateTo}
        onDateToChange={handleDateToChange}
        selectedOrdersCount={selectedOrders.length}
      />
      
      {/* Optional: Global loading indicator overlay if desired for all loading states */}
      {loading && orders.length > 0 && ( // Show a subtle loading indicator when refetching
        <div className="flex justify-center items-center py-4">
            <FiLoader className="animate-spin text-habesha_blue h-6 w-6" />
            <span className="ml-2 text-sm text-gray-600">Refreshing data...</span>
        </div>
      )}

      {renderContent()}

      {!error && orders.length > 0 && totalPages > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalOrders}
        />
      )}
    </div>
  );
};

export default ManageOrders;