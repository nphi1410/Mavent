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
                  onChange={(e) => onDepartmentFilterChange(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Date range filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Date Range</h3>
              <div className="space-y-2">
                <div>
                  <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="start-date"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={onStartDateChange}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    id="end-date"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={onEndDateChange}
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
                    value="All" 
                    checked={roleFilter === 'All'}
                    onChange={() => onRoleFilterChange('All')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-all" className="ml-2 block text-sm text-gray-700">All Roles</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-admin" 
                    name="role" 
                    value="Admin" 
                    checked={roleFilter === 'Admin'}
                    onChange={() => onRoleFilterChange('Admin')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-700">Admin</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-moderator" 
                    name="role" 
                    value="Moderator" 
                    checked={roleFilter === 'Moderator'}
                    onChange={() => onRoleFilterChange('Moderator')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="role-moderator" className="ml-2 block text-sm text-gray-700">Moderator</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="role-member" 
                    name="role" 
                    value="Member" 
                    checked={roleFilter === 'Member'}
                    onChange={() => onRoleFilterChange('Member')}
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
                    value="All" 
                    checked={statusFilter === 'All'}
                    onChange={() => onStatusFilterChange('All')}
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
                    onChange={() => onStatusFilterChange('Active')}
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
                    onChange={() => onStatusFilterChange('Inactive')}
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
              onClick={onResetFilters}
            >
              Reset
            </button>
            <button 
              className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
              onClick={onApplyFilters}
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
