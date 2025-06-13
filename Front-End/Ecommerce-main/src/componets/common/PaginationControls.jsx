// src/components/common/PaginationControls.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PaginationControls = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  const MAX_VISIBLE_PAGES = 3; // Max number of direct page links around current page
  const SIBLING_COUNT = 1; // Number of pages to show on each side of current page

  // Always show first page
  pageNumbers.push(1);

  // Ellipsis logic
  if (currentPage > SIBLING_COUNT + 2) { // currentPage > 3
    pageNumbers.push('...');
  }

  // Pages around current page
  const startPage = Math.max(2, currentPage - SIBLING_COUNT);
  const endPage = Math.min(totalPages - 1, currentPage + SIBLING_COUNT);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  // Ellipsis logic for end
  if (currentPage < totalPages - (SIBLING_COUNT + 1) ) { // currentPage < totalPages - 2
     pageNumbers.push('...');
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }
  
  // Remove duplicate '...' if they are next to 1 or totalPages due to small totalPages count
  const uniquePageNumbers = pageNumbers.filter((page, index, self) => {
    // Keep numbers
    if (typeof page === 'number') return true;
    // Keep ellipsis if it's not adjacent to a number it's meant to replace or another ellipsis
    if (page === '...') {
        const prev = self[index-1];
        const next = self[index+1];
        if (typeof prev === 'number' && typeof next === 'number' && next === prev + 1) return false; // e.g. 1, ..., 2
        if (prev === '...') return false; // two '...' in a row
    }
    return true;
  });


  return (
    <div className="flex items-center justify-between pt-6 pb-2 bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-xl shadow-xl mt-[-1px] z-0 relative">
      <div className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        {totalItems !== undefined && <span className="hidden sm:inline"> (Total: {totalItems} products)</span>}
      </div>
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Previous</span>
          <FiChevronLeft className="h-5 w-5" />
        </button>
        {uniquePageNumbers.map((number, index) =>
          typeof number === 'number' ? (
            <button
              key={`page-${number}-${index}`} // Ensure unique key if '...' might cause reuse of number
              onClick={() => onPageChange(number)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                ${currentPage === number ? 'z-10 bg-habesha_blue border-habesha_blue text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
            >
              {number}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {number}
            </span>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Next</span>
          <FiChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default PaginationControls;