import { useState, useCallback } from 'react';

/**
 * Hook để quản lý các bộ lọc cho members.
 * Hook này chỉ tập trung vào quản lý trạng thái và logic lọc.
 */
const useMemberFilters = (onFilterChange = () => {}) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Handler functions
  const handleStatusFilter = useCallback((status) => {
    // Ensure status is always a string  
    const statusValue = typeof status === 'string' ? status : '';
    setStatusFilter(statusValue);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const handleRoleFilter = useCallback((role) => {
    // Ensure role is always a string
    const roleValue = typeof role === 'string' ? role : '';
    setRoleFilter(roleValue);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const handleDepartmentFilter = useCallback((department) => {
    setDepartmentFilter(department);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const handleStartDateChange = useCallback((date) => {
    setStartDate(date);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const handleEndDateChange = useCallback((date) => {
    setEndDate(date);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const handleSearch = useCallback((term) => {
    const searchValue = typeof term === 'string' ? term : '';
    setSearchTerm(searchValue);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const toggleAdvancedFilter = useCallback(() => {
    setShowAdvancedFilter(!showAdvancedFilter);
  }, [showAdvancedFilter]);

  const applyFilters = useCallback(() => {
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setDepartmentFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  // Handle generic filter changes (giữ lại cho tương thích)
  const handleFilterChange = useCallback((filterType, value) => {
    setCurrentPage(0);
    
    switch (filterType) {
      case 'role':
        setRoleFilter(value);
        break;
      case 'department':
        setDepartmentFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      default:
        break;
    }
    
    onFilterChange(); // Notify parent that filters have changed
  }, [onFilterChange]);

  // Pagination handlers
  const paginate = useCallback((page) => {
    setCurrentPage(page - 1); // Convert from 1-based to 0-based for API
    onFilterChange(); // Notify parent that page has changed
  }, [onFilterChange]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page - 1); // Convert from 1-based to 0-based for API
    onFilterChange(); // Notify parent that page has changed
  }, [onFilterChange]);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(0);
    onFilterChange(); // Notify parent that page size has changed
  }, [onFilterChange]);

  // Return public API
  return {
    // Filter states
    searchTerm,
    statusFilter,
    roleFilter,
    departmentFilter,
    startDate,
    endDate,
    showAdvancedFilter,
    
    // Pagination states
    currentPage: currentPage + 1, // Convert to 1-based for UI
    pageSize,
    
    // Filter handlers
    handleSearch,
    handleStatusFilter,
    handleRoleFilter,
    handleDepartmentFilter,
    handleStartDateChange,
    handleEndDateChange,
    toggleAdvancedFilter,
    applyFilters,
    resetFilters,
    handleFilterChange,
    
    // Pagination handlers
    paginate,
    handlePageChange,
    handlePageSizeChange,
    
    // Raw state values for parent component
    filterValues: {
      searchTerm,
      statusFilter,
      roleFilter,
      departmentFilter,
      startDate,
      endDate
    },
    
    paginationValues: {
      page: currentPage,
      size: pageSize
    }
  };
};

// Export the hook as both named and default export
export { useMemberFilters };
export default useMemberFilters;
