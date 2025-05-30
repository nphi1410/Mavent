import { useState, useEffect, useCallback } from 'react';
import memberService from '../../../services/memberService';

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
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm || undefined,
        role: (typeof roleFilter === 'string' && roleFilter !== '') ? roleFilter : undefined,
        department: (typeof departmentFilter === 'string' && departmentFilter !== '') ? departmentFilter : undefined,
        status: (typeof statusFilter === 'string' && statusFilter !== '') ? statusFilter : undefined,
        page: page,
        size: size
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await memberService.getMembers(eventId, params);
      
      if (response.success && response.data) {
        // Transform API data to match front-end expectations
        const transformedMembers = (response.data.content || []).map(member => {
          // Ensure isActive value is properly converted to boolean
          const isActive = typeof member.isActive === 'boolean' ? member.isActive : member.isActive === 'true';
          
          console.log(`Member ${member.fullName}: isActive=${isActive}, original=${member.isActive}`);
          
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
        
        // Log thêm thông tin để debug
        console.log('Filter state:', { statusFilter, roleFilter, departmentFilter });
        console.log('Received filtered members:', response.data.content);
        console.log('Transformed members with status:', transformedMembers.map(m => ({ name: m.name, status: m.status, isActive: m.isActive, isBanned: m.isBanned })));
        
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
      console.error('Error fetching members:', err);
      setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
      setMembers([]);
      setTotalPages(0);
      setTotalElements(0);
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
    try {
      setLoading(true);
      
      const response = await memberService.getMemberDetails(eventId, accountId);
      
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
      console.error('Error fetching member details:', err);
      setError('Không thể tải chi tiết thành viên');
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Load data khi component mount hoặc dependencies thay đổi
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Load departments khi component mount hoặc eventId thay đổi
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Helper functions cho department
  const findDepartmentById = useCallback((departmentId) => {
    return departments.find(dept => dept.departmentId === departmentId);
  }, [departments]);

  const findDepartmentByName = useCallback((departmentName) => {
    if (!departmentName) return null;
    
    const deptName = departmentName.toLowerCase().trim();
    
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
    
    return dept;
  }, [departments]);

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
