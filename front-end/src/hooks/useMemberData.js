import { useState, useEffect, useCallback, useRef } from 'react';
import memberService from '../services/memberService';

/**
 * Hook để quản lý dữ liệu member và department.
 * Hook này chỉ tập trung vào việc tải và chuyển đổi dữ liệu.
 */
const useMemberData = (eventId = 1, filters = {}, pagination = {}) => {
  // Data states
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // AbortController for request cancellation
  const abortControllerRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  // Extract pagination params
  const { page = 0, size = 10 } = pagination;

  // Extract filter params
  const { 
    searchTerm = '', 
    statusFilter = '', 
    roleFilter = '', 
    departmentFilter = ''
  } = filters;

  // Fetch members với các filter và pagination
  const fetchMembers = useCallback(async () => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear any pending timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);

      // Normalize filters before sending to API
      const normalizedStatus = statusFilter ? 
        (statusFilter.toLowerCase().trim() === 'active' ? 'active' : 'inactive') : undefined;
      
      const normalizedRole = roleFilter ? roleFilter.trim().toUpperCase() : undefined;
      
      // Giảm bớt logs không cần thiết
      if (process.env.NODE_ENV === 'development') {
        // console.log('Normalized filters before API call:', {
        //   originalStatus: statusFilter,
        //   normalizedStatus,
        //   originalRole: roleFilter,
        //   normalizedRole
        // });
      }

      // Prepare search term
      const trimmedSearchTerm = searchTerm ? searchTerm.trim() : '';
      
      // Normalize department filter - resolve department name to ID if possible
      let normalizedDepartment = undefined;
      if (departmentFilter) {
        // If it's already a number, use it directly
        if (typeof departmentFilter === 'number') {
          normalizedDepartment = departmentFilter;
        } 
        // If it's a numeric string, convert it
        else if (typeof departmentFilter === 'string' && /^\d+$/.test(departmentFilter)) {
          normalizedDepartment = Number(departmentFilter);
        }
        // Otherwise try to resolve name to ID
        else {
          normalizedDepartment = resolveDepartmentFilter(departmentFilter);
        }
        
        // console.log(`Resolved department filter from '${departmentFilter}' (type: ${typeof departmentFilter}) to '${normalizedDepartment}' (type: ${typeof normalizedDepartment})`);
      }
      
      const params = {
        search: trimmedSearchTerm || undefined, // Only add search parameter if it has content
        role: normalizedRole,
        department: normalizedDepartment,
        status: normalizedStatus,
        page: page,
        size: size
      };
      
      // Chỉ log search term trong môi trường development
      if (trimmedSearchTerm && process.env.NODE_ENV === 'development') {
        // console.log(`Searching for: '${trimmedSearchTerm}'`);
      }

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await memberService.getMembers(eventId, params, abortControllerRef.current.signal);
      
      if (response.success && response.data) {
        // Transform API data to match front-end expectations
        const transformedMembers = (response.data.content || []).map(member => {
          // Ensure isActive value is properly converted to boolean
          const isActive = typeof member.isActive === 'boolean' ? member.isActive : member.isActive === 'true';
          
          return {
            ...member,
            id: member.accountId, // Add id field for UI compatibility
            name: member.fullName, // Transform fullName to name
            role: member.eventRole, // Transform eventRole to role
            status: isActive ? 'Active' : 'Inactive', // Transform isActive to status
            department: member.departmentName || 'N/A', // Transform departmentName to department
            isBanned: !isActive, // Map inactive to banned for UI logic
            isActive: isActive, // Store explicit isActive value
            avatarUrl: member.avatarUrl || null // Ensure avatarUrl is available
          };
        });
        
        // Giảm bớt logs debug trừ khi thực sự cần thiết
        if (process.env.NODE_ENV === 'development' && false) { // Tắt logs này khi không cần
          // console.log('Filter state:', { statusFilter, roleFilter, departmentFilter });
          // console.log('Received filtered members:', response.data.content);
          // console.log('Transformed members with status:', transformedMembers.map(m => ({ name: m.name, status: m.status, isActive: m.isActive, isBanned: m.isBanned })));
        }
        
        setMembers(transformedMembers);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setError('Không thể tải danh sách thành viên');
        setMembers([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      // Don't log abort errors as they are intentional
      if (err.name !== 'AbortError') {
        console.error('Error fetching members:', err);
        setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
        setMembers([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } finally {
      setLoading(false);
    }
  }, [eventId, page, size, searchTerm, statusFilter, roleFilter, departmentFilter]);

  // Fetch departments từ API
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await memberService.getDepartments(eventId);
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      // Set default departments if API fails
      setDepartments([
        { departmentId: 1, name: 'Marketing' },
        { departmentId: 2, name: 'HR' },
        { departmentId: 3, name: 'IT' },
        { departmentId: 4, name: 'Finance' },
        { departmentId: 5, name: 'Sales' }
      ]);
    }
  }, [eventId]);

  // Fetch member details
  const fetchMemberDetails = useCallback(async (accountId) => {
    // Create a new AbortController for this request
    const detailsAbortController = new AbortController();
    
    try {
      setLoading(true);
      
      const response = await memberService.getMemberDetails(eventId, accountId, detailsAbortController.signal);
      
      if (response.success && response.data) {
        // Transform API data to match front-end expectations
        const transformedUser = {
          ...response.data,
          id: response.data.accountId,
          name: response.data.fullName,
          role: response.data.eventRole,
          status: response.data.isActive ? 'Active' : 'Inactive',
          department: response.data.departmentName || 'N/A',
          isBanned: !response.data.isActive,
          // Format date of birth if available
          dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toLocaleDateString('vi-VN') : null,
          // Make sure we have access to all properties
          studentId: response.data.studentId || null,
          gender: response.data.gender || null,
          avatarUrl: response.data.avatarUrl || null
        };
        
        return transformedUser;
      }
      return null;
    } catch (err) {
      // Ignore AbortError as it's intentional
      if (err.name !== 'AbortError') {
        console.error('Error fetching member details:', err);
        setError('Không thể tải chi tiết thành viên');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId, setError, setLoading]);

  // Load data khi component mount hoặc dependencies thay đổi
  // Sử dụng ref để theo dõi lần render đầu tiên
  const isInitialFetchRef = useRef(true);
  
  useEffect(() => {
    // Chỉ fetch data khi lần đầu mount hoặc khi filters/pagination thay đổi có chủ ý
    if (isInitialFetchRef.current) {
      fetchMembers();
      isInitialFetchRef.current = false;
      // console.log('Initial data fetch executed');
    }
  }, [fetchMembers]);

  // Load departments khi component mount hoặc eventId thay đổi
  const isInitialDepartmentFetchRef = useRef(true);
  
  useEffect(() => {
    if (isInitialDepartmentFetchRef.current) {
      fetchDepartments();
      isInitialDepartmentFetchRef.current = false;
      // console.log('Initial departments fetch executed');
    }
  }, [fetchDepartments]);

  // Helper functions cho department với caching to improve performance
  const departmentCacheRef = useRef({});
  
  const findDepartmentById = useCallback((departmentId) => {
    if (!departmentId) return null;
    
    // Check cache first
    if (departmentCacheRef.current[`id-${departmentId}`]) {
      return departmentCacheRef.current[`id-${departmentId}`];
    }
    
    // Find in loaded departments
    const dept = departments.find(dept => dept.departmentId === departmentId);
    
    // Cache result
    if (dept) {
      departmentCacheRef.current[`id-${departmentId}`] = dept;
    }
    
    return dept;
  }, [departments]);

  const findDepartmentByName = useCallback((departmentName) => {
    if (!departmentName) return null;
    
    const deptName = departmentName.toLowerCase().trim();
    
    // Check cache first
    if (departmentCacheRef.current[`name-${deptName}`]) {
      return departmentCacheRef.current[`name-${deptName}`];
    }
    
    // Try exact match first
    let dept = departments.find(d => 
      d.name.toLowerCase().trim() === deptName
    );
    
    // Try partial match if exact match fails
    if (!dept) {
      dept = departments.find(d => 
        d.name.toLowerCase().includes(deptName) || 
        deptName.includes(d.name.toLowerCase())
      );
    }
    
    // Cache result
    if (dept) {
      departmentCacheRef.current[`name-${deptName}`] = dept;
    }
    
    return dept;
  }, [departments]);

  // Function to normalize department filter to ID - for consistent API calls
  const resolveDepartmentFilter = useCallback((filter) => {
    if (!filter) return null;
    
    // If it's empty string, return it as is (select "All Departments")
    if (filter === '') {
      // console.log('Department filter is empty string, returning empty');
      return '';
    }
    
    // If filter is already a number or numeric string, return it as number
    if (typeof filter === 'number') {
      // console.log('Department filter is a number, using as is:', filter);
      return filter;
    }
    
    if (typeof filter === 'string' && /^\d+$/.test(filter)) {
      const numValue = Number(filter);
      console.log('Department filter is numeric string, converting to number:', numValue);
      return numValue;
    }
    
    // Otherwise, try to find department by name
    const dept = findDepartmentByName(filter);
    if (dept) {
      // console.log(`Resolved department name "${filter}" to ID: ${dept.departmentId}`);
      return dept.departmentId;
    } else {
      console.log(`Could not resolve department name "${filter}", using original value`);
      return filter; // Fall back to original value if not found
    }
  }, [findDepartmentByName]);

  // Load data with improved dependency handling
  useEffect(() => {
    // Set a short delay to avoid multiple API calls when multiple dependencies change simultaneously
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(() => {
      fetchMembers();
      if (process.env.NODE_ENV === 'development') {
        // console.log('Fetching members with filters:', {
        //   page,
        //   size,
        //   searchTerm,
        //   statusFilter,
        //   roleFilter,
        //   departmentFilter
        // });
      }
    }, 50); // Small delay to batch closely-timed filter changes

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMembers, page, size, searchTerm, statusFilter, roleFilter, departmentFilter]);

  // Load departments khi component mount hoặc eventId thay đổi
  useEffect(() => {
    fetchDepartments();
    return () => {
      // Cleanup if needed
    };
  }, [fetchDepartments, eventId]);

  // Convert members list to bannedUsers map
  const bannedUsers = members.reduce((acc, member) => {
    acc[member.id] = member.isBanned || false;
    return acc;
  }, {});

  // Return public API
  return {
    // Data
    members,
    departments,
    loading,
    error,
    totalPages,
    totalElements,
    bannedUsers,
    
    // Data access methods
    findDepartmentById,
    findDepartmentByName,
    resolveDepartmentFilter,
    
    // Fetch methods
    fetchMembers,
    fetchDepartments,
    fetchMemberDetails,
    
    // Clear error
    clearError: () => setError(null)
  };
};

// Export the hook as both named and default export
export { useMemberData };
export default useMemberData;
