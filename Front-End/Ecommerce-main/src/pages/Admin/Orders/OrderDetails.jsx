import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import adminOrderService from '../../../service/adminOrderService';
import { getOrderStatusClass } from '../../../utils/helpers';
import { FiLoader, FiAlertTriangle, FiX, FiCheckCircle, FiXCircle, FiTruck, FiRefreshCw, FiEdit3, FiDollarSign } from 'react-icons/fi';


const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = useSelector((state) => state.habesha.language);
  const USD_TO_ETB_RATE = 150;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [proofError, setProofError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiRefreshCw className="mr-1.5 h-3 w-3" />;
      case 'Processing': return <FiEdit3 className="mr-1.5 h-3 w-3" />;
      case 'Paid': return <FiCheckCircle className="mr-1.5 h-3 w-3" />;
      case 'Shipped': return <FiTruck className="mr-1.5 h-3 w-3" />;
      case 'Delivered': return <FiCheckCircle className="mr-1.5 h-3 w-3" />;
      case 'Cancelled': return <FiXCircle className="mr-1.5 h-3 w-3" />;
      case 'Rejected': return <FiXCircle className="mr-1.5 h-3 w-3" />;
      default: return null;
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminOrderService.getOrderById(id);
      setOrder({
        id: response.data.orderId,
        name: response.data.userFullName || 'Unknown',
        email: response.data.userEmail || 'Unknown',
        date: response.data.orderedAt,
        total: response.data.totalPrice,
        items: response.data.items.map((item, index) => ({
          id: index + 1,
          name: { EN: item.name, AMH: item.name },
          image: item.image || '/placeholder.svg',
          quantity: item.quantity,
          price: item.price,
        })),
        status: statusMap[response.data.status] || 'Pending',
        paymentStatus: paymentStatusMap[response.data.status] || 'Pending',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProof = async () => {
    try {
      setProofLoading(true);
      setProofError(null);
      const response = await adminOrderService.getOrderProof(id);
      if (response.status === 204) {
        setProofImage(null);
      } else {
        const imageUrl = URL.createObjectURL(response.data);
        setProofImage(imageUrl);
      }
    } catch (err) {
      setProofError('Failed to load payment proof.');
    } finally {
      setProofLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchProof();
    return () => {
      if (proofImage) URL.revokeObjectURL(proofImage);
    };
  }, [id]);

  const handleApprove = async () => {
    if (window.confirm(`Approve payment for order ${id}?`)) {
      try {
        setActionLoading(true);
        await adminOrderService.approveOrder(id);
        alert('Payment approved.');
        fetchOrder();
        fetchProof();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to approve payment.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm(`Reject payment for order ${id}?`)) {
      try {
        setActionLoading(true);
        await adminOrderService.rejectOrder(id);
        alert('Payment rejected.');
        fetchOrder();
        fetchProof();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to reject payment.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (e) => {
    const newStatus = e.target.value.toUpperCase();
    if (window.confirm(`Change status of order ${id} to "${newStatus}"?`)) {
      try {
        setActionLoading(true);
        await adminOrderService.updateOrderStatus(id, newStatus);
        alert(`Status updated to ${newStatus}.`);
        fetchOrder();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update status.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FiLoader size={48} className="mx-auto mb-3 text-habesha_blue animate-spin" />
        <p className="text-lg font-medium">Loading order details...</p>
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
          onClick={() => { fetchOrder(); fetchProof(); }}
          className="mt-4 px-4 py-2 bg-habesha_blue text-white rounded hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Details #{order.id}</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">Order Date</h3>
            <p className="text-base font-bold text-habesha_blue">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">Status</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>
          <div className="bg-gray-100 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">Total Amount</h3>
            <p className="text-xl font-bold text-habesha_blue">
              {language === '0' ? '$' : 'ETB '}{formatPrice(order.total)}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
            <span>Customer</span>
          </h3>
          <p className="text-sm text-gray-800">{order.name}</p>
          <p className="text-sm text-gray-500">{order.email}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
            <span>Items ({formatNumber(order.items.length)})</span>
          </h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">{item.name[language]}</h4>
                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-gray-600">Qty: {formatNumber(item.quantity)}</p>
                      <p className="text-sm font-semibold text-habesha_blue">
                        {language === '0' ? '$' : 'ETB '}{formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-bold text-habesha_blue">
                {language === '0' ? '$' : 'ETB '}{formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
            <FiDollarSign className="text-habesha_blue" /> Payment Proof
          </h3>
          {proofLoading ? (
            <div className="text-center text-gray-600">Loading payment proof...</div>
          ) : proofError ? (
            <div className="bg-red-100 text-red-600 p-3 rounded-xl text-center">{proofError}</div>
          ) : proofImage ? (
            <div className="flex justify-center">
              <img
                src={proofImage}
                alt="Payment Proof"
                className="max-w-full max-h-96 rounded-xl border-2 border-gray-200 object-contain"
              />
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-xl text-center text-gray-600">
              No payment proof uploaded
            </div>
          )}
          {order.paymentStatus === 'Pending' && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approve Payment
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Payment
              </button>
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Update Status</h3>
          <select
            value={order.status}
            onChange={handleStatusUpdate}
            disabled={actionLoading || !['Paid', 'Shipped'].includes(order.status)}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-habesha_blue focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;