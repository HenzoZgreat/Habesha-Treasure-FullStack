// src/components/products/ProductCardGrid.jsx
import React from 'react';
import ProductAdminCard from './ProductAdminCard';

const ProductCardGrid = ({ products, selectedProducts, onSelectProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductAdminCard
          key={product.id}
          product={product}
          isSelected={selectedProducts.includes(product.id)}
          onSelectProduct={onSelectProduct}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductCardGrid;