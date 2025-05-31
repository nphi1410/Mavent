import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DepartmentFilter = ({
  isOpen,
  departmentFilter,
  departments = [],
  onClose,
  onDepartmentFilterChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <>
      {/* Department Filter Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Department Filter</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Department filter dropdown */}
            <div>
              <h3 className="text-sm font-medium mb-3">Select Department</h3>
              <div className="relative">
                <select 
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={departmentFilter || ''}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    console.log("Department selected (raw):", rawValue);
                    
                    if (typeof onDepartmentFilterChange === 'function') {
                      // Force numeric conversion for department IDs, empty string for "All"
                      const value = rawValue === '' ? '' : parseInt(rawValue, 10);
                      console.log("Department value after conversion:", value, typeof value);
                      onDepartmentFilterChange(value);
                    }
                  }}
                >
                  <option value="">All Departments</option>
                  {Array.isArray(departments) && departments.map(dept => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
            <button 
              className="border border-gray-300 bg-white text-gray-700 rounded-lg py-2 hover:bg-gray-50"
              onClick={() => {
                if (typeof onResetFilters === 'function') {
                  onResetFilters();
                }
              }}
            >
              Reset
            </button>
            <button 
              className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
              onClick={() => {
                if (typeof onApplyFilters === 'function') {
                  onApplyFilters();
                }
                if (typeof onClose === 'function') {
                  onClose(); // Close sidebar after applying filters
                }
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop - added for better UX */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-20"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default DepartmentFilter;
