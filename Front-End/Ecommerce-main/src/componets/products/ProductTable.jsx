import React from 'react';
import ProductTableRow from './ProductTableRow';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectAll, 
  onSelectProduct, 
  onEditProduct, 
  onDeleteProduct,
  onViewDetails,
  isAllCurrentPageSelected
}) => {
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4 w-12 text-left">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-habesha_blue border-gray-300 rounded focus:ring-habesha_blue"
                  checked={isAllCurrentPageSelected && products.length > 0}
                  onChange={onSelectAll}
                  disabled={products.length === 0}
                />
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU/ID</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Added</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelectProduct={onSelectProduct}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
                onViewDetails={onViewDetails}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;