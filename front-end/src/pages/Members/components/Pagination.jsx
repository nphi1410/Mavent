import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, totalItems);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      {/* Mobile pagination */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button 
          onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)} 
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button 
          onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} 
          disabled={currentPage === totalPages || totalPages === 0}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === totalPages || totalPages === 0
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{totalItems > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
            <span className="font-medium">{indexOfLastItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous button */}
            <button 
              onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)} 
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`relative inline-flex items-center px-4 py-2 border ${
                  currentPage === number
                    ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } text-sm font-medium`}
              >
                {number}
              </button>
            ))}
            
            {/* Next button */}
            <button 
              onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} 
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
