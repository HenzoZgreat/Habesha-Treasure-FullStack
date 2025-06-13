import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductCard from './ProductCard'; // Import the new ProductCard

const Product = () => {
  const data = useLoaderData();
  const productData = data.data; // Assuming structure { data: [...] }

  return (
    <div className='max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-10 px-4'>
      {productData && productData.length > 0 ? (
        productData.map((item) => (
          <ProductCard key={item.id} productItem={item} />
        ))
      ) : (
        <p>No products to display.</p>
      )}
    </div>
  );
};

export default Product;