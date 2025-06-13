// src/services/orderService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/orders';
const USE_MOCK_API = true;

const initialMockOrders = [
  { id: 'ORD74621', customerName: 'Nati Demelash', customerEmail: 'nati.d@example.com', date: '2023-10-28', total: 145.50, items: 3, status: 'Pending', paymentStatus: 'Paid', shippingAddress: '123 Bole St, Addis Ababa' },
  { id: 'ORD38290', customerName: 'Abebe Bikila', customerEmail: 'abebe.b@example.com', date: '2023-10-27', total: 75.00, items: 1, status: 'Processing', paymentStatus: 'Paid', shippingAddress: '456 Cazanchis Ave, Addis Ababa' },
  { id: 'ORD91034', customerName: 'Sara Tadesse', customerEmail: 'sara.t@example.com', date: '2023-10-26', total: 210.00, items: 5, status: 'Shipped', paymentStatus: 'Paid', shippingAddress: '789 CMC Rd, Addis Ababa' },
  { id: 'ORD55678', customerName: 'John Doe', customerEmail: 'john.d@example.com', date: '2023-10-25', total: 45.99, items: 2, status: 'Delivered', paymentStatus: 'Paid', shippingAddress: '012 Hayahulet Blvd, Addis Ababa' },
  { id: 'ORD12389', customerName: 'Lia Kebede', customerEmail: 'lia.k@example.com', date: '2023-10-28', total: 199.75, items: 4, status: 'Cancelled', paymentStatus: 'Refunded', shippingAddress: '345 Piassa Ln, Addis Ababa' },
  { id: 'ORD67890', customerName: 'Teddy Afro', customerEmail: 'teddy.a@example.com', date: '2023-10-29', total: 88.00, items: 2, status: 'Pending', paymentStatus: 'Pending', shippingAddress: '678 Gerji Imperial, Addis Ababa' },
];

let mockOrdersStore = [...initialMockOrders];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getOrders = async (params = {}) => {
  if (USE_MOCK_API) {
    await delay(500);
    let filtered = [...mockOrdersStore];

    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerEmail.toLowerCase().includes(term)
      );
    }
    if (params.status && params.status !== 'All') {
      filtered = filtered.filter(o => o.status === params.status);
    }
    if (params.dateFrom) {
      filtered = filtered.filter(o => new Date(o.date) >= new Date(params.dateFrom));
    }
    if (params.dateTo) {
      filtered = filtered.filter(o => new Date(o.date) <= new Date(params.dateTo));
    }
    // Add sorting if needed

    const totalOrders = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 7; // Default limit
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOrders = filtered.slice(startIndex, endIndex);

    return { data: { orders: paginatedOrders, totalOrders, totalPages: Math.ceil(totalOrders / limit) } };
  }
  return axios.get(API_URL, { params });
};

const getOrderById = async (orderId) => {
    if (USE_MOCK_API) {
        await delay(200);
        const order = mockOrdersStore.find(o => o.id === orderId);
        return { data: order };
    }
    return axios.get(`${API_URL}/${orderId}`);
};

const updateOrderStatus = async (orderId, newStatus) => {
  if (USE_MOCK_API) {
    await delay(300);
    let paymentStatus = mockOrdersStore.find(o => o.id === orderId)?.paymentStatus || 'Pending';
    if (newStatus === 'Cancelled' || newStatus === 'Refunded') {
        // paymentStatus = newStatus === 'Cancelled' && paymentStatus !== 'Paid' ? 'Voided' : 'Refunded'; // Or similar logic
        paymentStatus = 'Refunded'; // Simplified for now
    }
    mockOrdersStore = mockOrdersStore.map(order =>
      order.id === orderId ? { ...order, status: newStatus, paymentStatus: paymentStatus } : order
    );
    const updatedOrder = mockOrdersStore.find(o => o.id === orderId);
    return { data: updatedOrder };
  }
  return axios.patch(`${API_URL}/${orderId}`, { status: newStatus }); // Or PUT
};

const getUniqueOrderStatuses = async () => {
    if (USE_MOCK_API) {
        await delay(100);
        const statuses = [...new Set(initialMockOrders.map(o => o.status))].sort();
        return { data: statuses };
    }
    // Example: return axios.get(`${API_URL}/distinct/statuses`);
    const statuses = [...new Set(initialMockOrders.map(o => o.status))].sort();
    return { data: statuses };
};


const orderService = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getUniqueOrderStatuses,
  initialMockOrders, // For fallback if needed
};

export default orderService;