import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductListHeader from '../componets/products/ ProductListHeader';
import ProductFilters from '../componets/products/ProductFilters';
import ProductTable from '../componets/products/ProductTable';
import ProductCardGrid from '../componets/products/ProductCardGrid';
import NoProductsFound from '../componets/products/NoProductsFound';
import PaginationControls from '../componets/common/PaginationControls';
import productService from '../service/productService';
import AddProductModal from '../componets/products/AddProductModal';
import EditProductModal from '../componets/products/EditProductModal';
import ProductDetailsModal from '../componets/products/ProductDetailsModal';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

const PRODUCTS_PER_PAGE = 6;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterStock, setFilterStock] = useState('All');
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const applyFilters = useCallback((products) => {
    let filtered = [...products];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.id.toString().toLowerCase().includes(term));
    }
    if (filterCategory !== 'All') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    if (filterStatus !== 'All') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    if (filterStock !== 'All') {
      if (filterStock === 'InStock') filtered = filtered.filter(p => p.stock > 5);
      else if (filterStock === 'LowStock') filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
      else if (filterStock === 'OutOfStock') filtered = filtered.filter(p => p.stock === 0);
    }
    setTotalProducts(filtered.length);
    setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedProducts = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    setFilteredProducts(paginatedProducts);
  }, [searchTerm, filterCategory, filterStatus, filterStock, currentPage]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedProducts([]);
    try {
      const response = await productService.getProducts();
      const products = response.data.products || response.data;
      setProducts(products);
      applyFilters(products);
      const [catRes, statRes] = await Promise.all([
        productService.getUniqueCategories(),
        productService.getUniqueStatuses()
      ]);
      setCategories(catRes.data);
      setStatuses(statRes.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem('token');
        navigate('/SignIn');
      } else {
        setError("Failed to load products. Please try again.");
      }
      setProducts([]);
      setFilteredProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [applyFilters, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    applyFilters(products);
  }, [searchTerm, filterCategory, filterStatus, filterStock, currentPage, products]);

  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleCategoryChange = (e) => { setFilterCategory(e.target.value); setCurrentPage(1); };
  const handleStatusChange = (e) => { setFilterStatus(e.target.value); setCurrentPage(1); };
  const handleStockChange = (e) => { setFilterStock(e.target.value); setCurrentPage(1); };
  const handleViewModeChange = (mode) => setViewMode(mode);
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (productId) => {
    setSelectedProductId(productId);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm(`Are you sure you want to delete product ID: ${productId}?`)) {
      try {
        setLoading(true);
        await productService.deleteProduct(productId);
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(`Failed to delete product ${productId}. ${err.response?.data?.message || 'Server error'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      alert('No products selected.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected product(s)?`)) {
      try {
        setLoading(true);
        await productService.deleteMultipleProducts(selectedProducts);
        fetchProducts();
      } catch (err) {
        console.error("Failed to delete selected products:", err);
        alert(`Failed to delete selected products. ${err.response?.data?.message || 'Server error'}`);
        if (err.response && [401, 403].includes(err.response.status)) {
          localStorage.removeItem('token');
          navigate('/SignIn');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (event, productId) => {
    if (event.target.checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };
  
  const isAllCurrentPageSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12 text-gray-500">
          <FiLoader size={48} className="mx-auto mb-3 text-habesha_blue animate-spin" />
          <p className="text-lg font-medium">Loading products...</p>
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
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-habesha_blue text-white rounded hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      );
    }
    if (filteredProducts.length === 0) {
      const isFiltered = searchTerm || filterCategory !== 'All' || filterStatus !== 'All' || filterStock !== 'All';
      return <NoProductsFound 
                message={isFiltered ? "No products match your criteria" : "No products available"}
                subMessage={isFiltered ? "Try adjusting your search or filters." : "Add a new product to get started!"}
             />;
    }
    if (viewMode === 'list') {
      return (
        <ProductTable
          products={filteredProducts}
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onViewDetails={handleViewDetails}
          isAllCurrentPageSelected={isAllCurrentPageSelected}
        />
      );
    }
    return (
      <ProductCardGrid
        products={filteredProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onViewDetails={handleViewDetails}
      />
    );
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      <ProductListHeader onAddProduct={handleAddProduct} />
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterCategory={filterCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        filterStatus={filterStatus}
        onStatusChange={handleStatusChange}
        statuses={statuses}
        filterStock={filterStock}
        onStockChange={handleStockChange}
        selectedProductsCount={selectedProducts.length}
        onDeleteSelected={handleDeleteSelectedProducts}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      {renderContent()}
      {!loading && !error && filteredProducts.length > 0 && totalPages > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalProducts}
        />
      )}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={fetchProducts}
        products={products}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateProduct={fetchProducts}
        product={selectedProduct}
        products={products}
      />
      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ManageProducts;