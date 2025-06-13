// eco/hab/src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../componets/products/ProductCard"; // Correct path to ProductCard

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  // Search in allApiProducts, not cartProducts
  const allProducts = useSelector((state) => state.habesha.allApiProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (query && allProducts.length > 0) {
      const lowerCaseQuery = query.toLowerCase();
      const results = allProducts.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(lowerCaseQuery)) ||
          (item.description && item.description.toLowerCase().includes(lowerCaseQuery)) ||
          (item.category && item.category.toLowerCase().includes(lowerCaseQuery))
          // Add more fields if necessary, e.g., item.brand
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]); // Clear results if no query or no products
    }
  }, [query, allProducts]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-10"> {/* Added padding */}
      <h2 className="text-2xl font-semibold mb-6"> {/* Styled heading */}
        Search Results for: <span className="text-habesha_blue font-bold">"{query}"</span>
      </h2>
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10"> {/* Styled no results message */}
          No products found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-10">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} productItem={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;