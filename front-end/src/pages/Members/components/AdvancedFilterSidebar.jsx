import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AdvancedFilterSidebar = ({
  isOpen,
  startDate,
  endDate,
  statusFilter,
  roleFilter,
  departmentFilter,
  departments = [],
  onClose,
  onStartDateChange,
  onEndDateChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onDepartmentFilterChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <>
      {/* Advanced Filter Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Advanced Filters</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Department filter dropdown */}
            <div>
              <h3 className="text-sm font-medium mb-3">Department</h3>
              <div className="relative">
                <select 
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={departmentFilter || ''}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    console.log("Department selected (raw):", rawValue);
                    
                    if (typeof onDepartmentFilterChange === 'function') {
                      // Force numeric conversion for department IDs, empty string for "All"
                      // Check if value is empty, use empty string, otherwise use number to ensure correct type
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
            
            {/* Date range filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Date Joined</h3>
              <div className="space-y-2">
                <div>
                  <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="start-date"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typeof startDate === 'string' ? startDate : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      console.log("Start date selected:", dateValue);
                      if (typeof onStartDateChange === 'function') {
                        onStartDateChange(e);
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    id="end-date"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typeof endDate === 'string' ? endDate : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      console.log("End date selected:", dateValue);
                      if (typeof onEndDateChange === 'function') {
                        onEndDateChange(e);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Role filter checkboxes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Roles</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-all" 
                    name="role" 
                    value="" 
                    checked={!roleFilter || roleFilter === ''}
                    onChange={() => {
                      if (typeof onRoleFilterChange === 'function') {
                        onRoleFilterChange('');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-all" className="ml-2 block text-sm text-gray-700">All Roles</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-admin" 
                    name="role" 
                    value="ADMIN" 
                    checked={roleFilter === 'ADMIN'}
                    onChange={() => {
                      if (typeof onRoleFilterChange === 'function') {
                        onRoleFilterChange('ADMIN');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-700">Admin</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-department-manager" 
                    name="role" 
                    value="DEPARTMENT_MANAGER" 
                    checked={roleFilter === 'DEPARTMENT_MANAGER'}
                    onChange={() => {
                      if (typeof onRoleFilterChange === 'function') {
                        onRoleFilterChange('DEPARTMENT_MANAGER');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-department-manager" className="ml-2 block text-sm text-gray-700">Department Manager</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-member" 
                    name="role" 
                    value="MEMBER" 
                    checked={roleFilter === 'MEMBER'}
                    onChange={() => {
                      if (typeof onRoleFilterChange === 'function') {
                        onRoleFilterChange('MEMBER');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-member" className="ml-2 block text-sm text-gray-700">Member</label>
                </div>
              </div>
            </div>
            
            {/* Status filter checkboxes */}
            <div>
              <h3 className="text-sm font-medium mb-3">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="status-all" 
                    name="status" 
                    value="" 
                    checked={!statusFilter || statusFilter === ''}
                    onChange={() => {
                      if (typeof onStatusFilterChange === 'function') {
                        onStatusFilterChange('');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="status-all" className="ml-2 block text-sm text-gray-700">All Status</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="status-active" 
                    name="status" 
                    value="Active" 
                    checked={statusFilter === 'Active'}
                    onChange={() => {
                      if (typeof onStatusFilterChange === 'function') {
                        onStatusFilterChange('Active');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">Active</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="status-inactive" 
                    name="status" 
                    value="Inactive" 
                    checked={statusFilter === 'Inactive'}
                    onChange={() => {
                      if (typeof onStatusFilterChange === 'function') {
                        onStatusFilterChange('Inactive');
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">Inactive</label>
                </div>
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

export default AdvancedFilterSidebar;
