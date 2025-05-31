import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const MemberFilters = ({
  searchTerm,
  statusFilter,
  roleFilter,
  departmentFilter,
  departments = [],
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onDepartmentFilterChange,
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
        
        {/* Filter row for filters */}
        <div className="grid grid-cols-2 gap-2 sm:grid sm:grid-cols-3 sm:gap-2">
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
          
          {/* Department filter dropdown */}
          <div className="relative col-span-2 sm:col-span-1">
            <select 
              className="w-full border rounded-lg px-3 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className="text-gray-400 absolute right-2 top-2.5 pointer-events-none" 
            />
          </div>
        </div>
      </div>
      
    
    </div>
  );
};

export default MemberFilters;
