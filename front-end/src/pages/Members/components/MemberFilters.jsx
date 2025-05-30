import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faPlus, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const MemberFilters = ({
  searchTerm,
  statusFilter,
  roleFilter,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onAdvancedFilterToggle,
  onAddMember
}) => {
  return (
    <div className="p-3 sm:p-4 border-b space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      {/* Search and Filters */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">          {/* Search input */}
        <div className="relative w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search members..." 
            className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)} 
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="text-gray-400 absolute right-3 top-2.5" 
          />
        </div>
        
        {/* Filter row for mobile */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
          {/* Status filter dropdown */}
          <div className="relative">
            <select 
              className="w-full border rounded-lg px-3 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={statusFilter || ''}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className="text-gray-400 absolute right-2 top-2.5 pointer-events-none" 
            />
          </div>
          
          {/* Role filter dropdown */}
          <div className="relative">
            <select 
              className="w-full border rounded-lg px-3 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={roleFilter || ''}
              onChange={(e) => onRoleFilterChange(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="DEPARTMENT_MANAGER">Department Manager</option>
              <option value="MEMBER">Member</option>
              <option value="PARTICIPANT">Participant</option>
              <option value="GUEST">Guest</option>
            </select>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className="text-gray-400 absolute right-2 top-2.5 pointer-events-none" 
            />
          </div>
        </div>
        
        {/* Advanced filter button */}
        <button 
          className="w-full sm:w-auto border rounded-lg px-3 py-2 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          onClick={onAdvancedFilterToggle}
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          <span className="hidden sm:inline">Advanced Filter</span>
          <span className="sm:hidden">Filter</span>
        </button>
      </div>
      
      {/* Add member button */}
      <button 
        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
        onClick={onAddMember}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        <span className="hidden sm:inline">Add Member</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
};

export default MemberFilters;
