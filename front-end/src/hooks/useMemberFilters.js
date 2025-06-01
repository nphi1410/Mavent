import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook để quản lý các bộ lọc cho members.
 * Hook này chỉ tập trung vào quản lý trạng thái và logic lọc.
 */
const useMemberFilters = (onFilterChange = () => {}) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // References for the debounce timer and tracking state changes
  const searchDebounceTimerRef = useRef(null);
  const isFirstRender = useRef(true);
  const filterChangeCountRef = useRef(0); // Track filter change count to limit unnecessary API calls

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Handler functions with improved data normalization
  const handleStatusFilter = useCallback((status) => {
    // Ensure status is always a string and properly normalized
    const statusValue = typeof status === 'string' ? status.trim() : '';
    
    // Normalize to one of: '' (empty string), 'Active', or 'Inactive'
    let normalizedStatus = '';
    if (statusValue) {
      normalizedStatus = statusValue.toLowerCase() === 'active' ? 'Active' : 'Inactive';
    }
    
    if (normalizedStatus !== statusFilter) {
      setStatusFilter(normalizedStatus);
      setCurrentPage(0); // Reset to first page when filter changes
      filterChangeCountRef.current += 1;
      onFilterChange();
    }
  }, [onFilterChange, statusFilter]);

  const handleRoleFilter = useCallback((role) => {
    // Ensure role is always a string and properly normalized
    const roleValue = typeof role === 'string' ? role.trim() : '';
    
    if (roleValue !== roleFilter) {
      if (process.env.NODE_ENV === 'development') {
        // console.log(`Setting role filter to: '${roleValue}'`);
      }
      setRoleFilter(roleValue);
      setCurrentPage(0);
      filterChangeCountRef.current += 1;
      onFilterChange();
    }
  }, [onFilterChange, roleFilter]);

  const handleDepartmentFilter = useCallback((department) => {
    // Normalize department filter to handle both string and number values consistently
    let deptValue;
    
    if (typeof department === 'string') {
      deptValue = department.trim();
    } else if (typeof department === 'number') {
      deptValue = department;
    } else if (department === null || department === undefined) {
      deptValue = '';
    } else {
      deptValue = String(department).trim();
    }
    
    if (deptValue !== departmentFilter) {
      if (process.env.NODE_ENV === 'development') {
        // console.log(`Setting department filter to: '${deptValue}'`);
      }
      setDepartmentFilter(deptValue);
      setCurrentPage(0);
      filterChangeCountRef.current += 1;
      onFilterChange();
    }
  }, [onFilterChange, departmentFilter]);

  // Date filter handlers removed as they're no longer needed
  
  // Effect to handle debounced search with improved handling
  useEffect(() => {
    // Skip first render to prevent unnecessary API call on component mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // When searchTerm changes, set a timeout before updating the debounced value
    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }
    
    searchDebounceTimerRef.current = setTimeout(() => {
      // Only trigger state update and API call if the value actually changed
      if (debouncedSearchTerm !== searchTerm) {
        if (process.env.NODE_ENV === 'development') {
          // console.log(`Search debounced: '${searchTerm}'`);
        }
        
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(0); // Reset to first page on new search
        filterChangeCountRef.current += 1;
        onFilterChange();
      }
    }, 800); // 800ms delay for better user experience
    
    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
    };
  }, [searchTerm, debouncedSearchTerm, onFilterChange]);
  
  // Handle immediate search term updates without triggering API call
  const handleSearch = useCallback((term) => {
    const searchValue = typeof term === 'string' ? term : '';
    
    if (process.env.NODE_ENV === 'development') {
      // console.log(`Setting search term to: '${searchValue}'`);
    }
    
    setSearchTerm(searchValue);
    // Note: onFilterChange is not called here, it will be called by the debounce effect
  }, []);

  // Removed toggleAdvancedFilter as it's no longer needed

  const applyFilters = useCallback(() => {
    console.log('Applying filters:', {
      searchTerm: debouncedSearchTerm,
      statusFilter,
      roleFilter,
      departmentFilter: typeof departmentFilter === 'string' && /^\d+$/.test(departmentFilter) ? 
        parseInt(departmentFilter, 10) : departmentFilter
    });
    
    // Force re-fetch data with current filters
    setCurrentPage(0);
    filterChangeCountRef.current += 1;
    
    // Ensure filter values are properly formatted before triggering API call
    setTimeout(() => {
      onFilterChange(); // Notify parent that filters have changed
    }, 0);
  }, [onFilterChange, debouncedSearchTerm, statusFilter, roleFilter, departmentFilter]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setDepartmentFilter('');
    setCurrentPage(0);
    // Force update to ensure all filters are cleared
    setTimeout(() => {
      onFilterChange(); // Notify parent that filters have changed
    }, 0);
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
    searchTerm, // The immediate search term for UI display
    debouncedSearchTerm, // The delayed search term for API calls
    statusFilter,
    roleFilter,
    departmentFilter,
    
    // Pagination states
    currentPage: currentPage + 1, // Convert to 1-based for UI
    pageSize,
    
    // Filter handlers
    handleSearch,
    handleStatusFilter,
    handleRoleFilter,
    handleDepartmentFilter,
    applyFilters,
    resetFilters,
    handleFilterChange,
    
    // Pagination handlers
    paginate,
    handlePageChange,
    handlePageSizeChange,
    
    // Raw state values for parent component
    filterValues: {
      searchTerm: debouncedSearchTerm, // Use the debounced term for API calls
      statusFilter,
      roleFilter,
      departmentFilter,
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
