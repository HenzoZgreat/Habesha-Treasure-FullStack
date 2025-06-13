// src/services/productService.js
import axios from 'axios';

// Replace with your actual API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/products'; 
// For demonstration, we'll use a mock API flag. Set to false to use actual axios calls.
const USE_MOCK_API = true; 

const initialMockProducts = [
  { id: 'P001', name: 'Elegant Habesha Dress', image: 'https://via.placeholder.com/80x100/A9CCE3/2C3E50?text=HD1', category: 'Traditional Wear', price: 125.00, stock: 25, status: 'Active', dateAdded: '2023-10-01' },
  { id: 'P002', name: 'Handwoven Gabi Shawl', image: 'https://via.placeholder.com/80x100/D5DBDB/2C3E50?text=GABI', category: 'Textiles', price: 80.00, stock: 10, status: 'Active', dateAdded: '2023-09-15' },
  { id: 'P003', name: 'Yirgacheffe Coffee Beans (1kg)', image: 'https://via.placeholder.com/80x100/ABEBC6/2C3E50?text=COFFEE', category: 'Consumables', price: 22.00, stock: 0, status: 'Out of Stock', dateAdded: '2023-08-20' },
  { id: 'P004', name: 'Axumite Silver Pendant', image: 'https://via.placeholder.com/80x100/FAD7A0/2C3E50?text=NECK', category: 'Jewelry', price: 155.00, stock: 5, status: 'Low Stock', dateAdded: '2023-10-05' },
  { id: 'P005', name: 'Handcrafted Leather Bag', image: 'https://via.placeholder.com/80x100/CCD1D1/2C3E50?text=BAG', category: 'Accessories', price: 90.00, stock: 15, status: 'Draft', dateAdded: '2023-07-10' },
  { id: 'P006', name: 'Spiced Berbere Mix', image: 'https://via.placeholder.com/80x100/F5B7B1/2C3E50?text=SPICE', category: 'Consumables', price: 8.50, stock: 50, status: 'Active', dateAdded: '2023-09-01' },
];

let mockProductsStore = [...initialMockProducts]; // Use a mutable copy for mock CUD operations

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getProducts = async (params = {}) => {
  if (USE_MOCK_API) {
    await delay(500); // Simulate network delay
    let filtered = [...mockProductsStore];

    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term));
    }
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category === params.category);
    }
    if (params.status && params.status !== 'All') {
      filtered = filtered.filter(p => p.status === params.status);
    }
    if (params.stock && params.stock !== 'All') {
        if (params.stock === 'InStock') filtered = filtered.filter(p => p.stock > 5);
        else if (params.stock === 'LowStock') filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
        else if (params.stock === 'OutOfStock') filtered = filtered.filter(p => p.stock === 0);
    }
    // Add sorting if params.sortBy is present
    // Example: if (params.sortBy === 'name_asc') filtered.sort((a,b) => a.name.localeCompare(b.name));

    const totalProducts = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 6; // Default limit
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);
    
    return { data: { products: paginatedProducts, totalProducts, totalPages: Math.ceil(totalProducts / limit) } };
  }
  // Real API call
  return axios.get(API_URL, { params });
};

const addProduct = async (productData) => {
  if (USE_MOCK_API) {
    await delay(300);
    const newProduct = { 
      ...productData, 
      id: `P${Date.now().toString().slice(-4)}`, 
      dateAdded: new Date().toISOString().split('T')[0],
      image: productData.image || 'https://via.placeholder.com/80x100/CCCCCC/FFFFFF?text=New'
    };
    mockProductsStore = [newProduct, ...mockProductsStore];
    return { data: newProduct };
  }
  return axios.post(API_URL, productData);
};

const updateProduct = async (id, productData) => {
  if (USE_MOCK_API) {
    await delay(300);
    mockProductsStore = mockProductsStore.map(p => p.id === id ? { ...p, ...productData } : p);
    const updatedProduct = mockProductsStore.find(p => p.id === id);
    return { data: updatedProduct };
  }
  return axios.put(`${API_URL}/${id}`, productData);
};

const deleteProduct = async (id) => {
  if (USE_MOCK_API) {
    await delay(300);
    mockProductsStore = mockProductsStore.filter(p => p.id !== id);
    return { data: { message: 'Product deleted successfully' } };
  }
  return axios.delete(`${API_URL}/${id}`);
};

const deleteMultipleProducts = async (ids) => {
    if (USE_MOCK_API) {
        await delay(500);
        mockProductsStore = mockProductsStore.filter(p => !ids.includes(p.id));
        return { data: { message: `${ids.length} products deleted successfully` } };
    }
    // For a real API, this might be a POST request with a body of IDs
    return axios.post(`${API_URL}/bulk-delete`, { ids }); 
};

// Functions to get distinct values for filters (can be from backend or derived from initial full dataset)
const getUniqueCategories = async () => {
    if (USE_MOCK_API) {
        await delay(100);
        const categories = [...new Set(initialMockProducts.map(p => p.category))].sort();
        return { data: categories };
    }
    // Example: return axios.get(`${API_URL}/distinct/categories`);
    // Fallback for non-mock if specific endpoint isn't available
    const categories = [...new Set(initialMockProducts.map(p => p.category))].sort();
    return { data: categories };
};

const getUniqueStatuses = async () => {
    if (USE_MOCK_API) {
        await delay(100);
        const statuses = [...new Set(initialMockProducts.map(p => p.status))].sort();
        return { data: statuses };
    }
    // Example: return axios.get(`${API_URL}/distinct/statuses`);
    const statuses = [...new Set(initialMockProducts.map(p => p.status))].sort();
    return { data: statuses };
};


const productService = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  getUniqueCategories,
  getUniqueStatuses,
  initialMockProducts // Expose for fallback in ManageProducts if needed
};

export default productService;