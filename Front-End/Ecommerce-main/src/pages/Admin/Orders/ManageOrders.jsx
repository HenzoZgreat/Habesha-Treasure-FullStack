import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OrderListHeader from "../../../componets/orders/OrderListHeader";
import OrderFilters from "../../../componets/orders/OrderFilters";
import OrderTable from "../../../componets/orders/OrderTable";
import NoProductsFound from "../../../componets/products/NoProductsFound";
import PaginationControls from "../../../componets/common/PaginationControls";
import adminOrderService from "../../../service/adminOrderService";
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';


const ORDERS_PER_PAGE = 7;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const language = useSelector((state) => state.habesha.language);
  const USD_TO_ETB_RATE = 150;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [orderStatuses] = useState(['All', 'Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'Rejected']);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const formatPrice = (value) => {
    const price = language === '0' ? value : value * USD_TO_ETB_RATE;
    return price.toLocaleString(language === '0' ? 'en-US' : 'am-ET', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (value) => {
    return value.toLocaleString(language === '0' ? 'en-US' : 'am-ET');
  };

  const statusMap = {
    PENDING_PAYMENT: 'Pending',
    PAID: 'Paid',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REJECTED: 'Rejected',
  };

  const paymentStatusMap = {
    PENDING_PAYMENT: 'Pending',
    PAID: 'Paid',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminOrderService.getOrders();
      const normalizedOrders = response.data.map(order => ({
        id: order.orderId,
        name: order.userFullName || 'Unknown',
        email: order.userEmail || 'Unknown',
        date: order.orderedAt,
        total: order.totalPrice,
        items: order.items.length,
        status: statusMap[order.status] || 'Pending',
        paymentStatus: paymentStatusMap[order.status] || 'Pending',
      }));
      setOrders(normalizedOrders);
      setTotalOrders(normalizedOrders.length);
      setTotalPages(Math.ceil(normalizedOrders.length / ORDERS_PER_PAGE));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to load orders. Please try again.");
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders
    .filter(order => {
      if (filterStatus === 'All') return true;
      return order.status.toLowerCase() === filterStatus.toLowerCase();
    })
    .filter(order => {
      if (!searchTerm) return true;
      return (
        order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(order => {
      if (!filterDateFrom && !filterDateTo) return true;
      const orderDate = new Date(order.date);
      const from = filterDateFrom ? new Date(filterDateFrom) : null;
      const to = filterDateTo ? new Date(filterDateTo) : null;
      return (
        (!from || orderDate >= from) &&
        (!to || orderDate <= to)
      );
    })
    .slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleStatusChange = (e) => { setFilterStatus(e.target.value); setCurrentPage(1); };
  const handleDateFromChange = (e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); };
  const handleDateToChange = (e) => { setFilterDateTo(e.target.value); setCurrentPage(1); };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (window.confirm(`Change status of order ${orderId} to "${newStatus}"?`)) {
      try {
        setLoading(true);
        await adminOrderService.updateOrderStatus(orderId, newStatus.toUpperCase());
        alert(`Order ${orderId} status updated to ${newStatus}.`);
        fetchOrders();
      } catch (err) {
        console.error("Failed to update order status:", err);
        alert(err.response?.data?.message || `Failed to update status for order ${orderId}.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
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

  const isAllCurrentPageSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;

  const renderContent = () => {
    if (loading && orders.length === 0) {
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
    if (filteredOrders.length === 0 && !loading) {
      const isFiltered = searchTerm || filterStatus !== 'All' || filterDateFrom || filterDateTo;
      return <NoProductsFound
        message={isFiltered ? "No orders match your criteria" : "No orders found"}
        subMessage={isFiltered ? "Try adjusting your search or filters." : "There are currently no orders to display."}
      />;
    }
    return (
      <OrderTable
        orders={filteredOrders.map(order => ({
          ...order,
          total: formatPrice(order.total),
          items: formatNumber(order.items),
        }))}
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
      {loading && orders.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <FiLoader className="animate-spin text-habesha_blue h-6 w-6" />
          <span className="ml-2 text-sm text-gray-600">Refreshing data...</span>
        </div>
      )}
      {renderContent()}
      {!error && filteredOrders.length > 0 && totalPages > 0 && (
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