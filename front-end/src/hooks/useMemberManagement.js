import { useCallback, useState, useEffect, useRef } from 'react';
import useMemberData from './useMemberData';
import useMemberFilters from './useMemberFilters';
import useMemberModals from './useMemberModals';
import useMemberActions from './useMemberActions';
import memberService from '../services/memberService';

/**
 * Main member management hook that composes all smaller hooks together.
 * This hook provides a unified interface for the Members component.
 * 
 * @returns {Object} All necessary methods and state for member management
 */
const useMemberManagement = () => {
  // Event ID state
  const [eventId, setEventId] = useState(9);

  // ------------------------
  // 1. Initialize Hooks
  // ------------------------
  
  // Track API call frequency to prevent spam
  const fetchCallbackCountRef = useRef(0);
  const lastFetchTimeRef = useRef(Date.now());
  const minFetchIntervalMs = 300; // Minimum time between API calls (300ms)
  
  // Reset the counter periodically to allow new fetches after some time
  useEffect(() => {
    const resetIntervalId = setInterval(() => {
      fetchCallbackCountRef.current = 0;
    }, 3000); // Reset counter every 3 seconds
    
    return () => clearInterval(resetIntervalId);
  }, []);
  
  // Filter states - with optimized callback to prevent excessive API calls
  const filterHook = useMemberFilters(() => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    // Only call fetchMembers if:
    // 1. It's been defined
    // 2. Not called too many times in succession
    // 3. Enough time has passed since last call
    if (typeof fetchMembers === 'function' && 
        fetchCallbackCountRef.current < 5 &&
        timeSinceLastFetch > minFetchIntervalMs) {
      
      fetchCallbackCountRef.current += 1;
      lastFetchTimeRef.current = now;
      
      if (process.env.NODE_ENV === 'development') {
        // console.log(`Triggering fetch #${fetchCallbackCountRef.current}, interval: ${timeSinceLastFetch}ms`);        // console.log('Current filter values:', {
        //   searchTerm: filterHook?.filterValues?.searchTerm,
        //   statusFilter: filterHook?.filterValues?.statusFilter,
        //   roleFilter: filterHook?.filterValues?.roleFilter,
        //   departmentFilter: filterHook?.filterValues?.departmentFilter
        // });
      }
      
      fetchMembers();
    } else {
      if (process.env.NODE_ENV === 'development') {
        // console.log(`Filter change debounced - too many requests or too soon`);
      }
    }
  });
  
  const {
    searchTerm,
    debouncedSearchTerm,
    statusFilter,
    roleFilter,
    departmentFilter,
    currentPage,
    pageSize,
    handleSearch,
    handleStatusFilter,
    handleRoleFilter,
    handleDepartmentFilter,
    resetFilters,
    applyFilters,
    paginate,
    handlePageChange,
    handlePageSizeChange
  } = filterHook;

  // Current page is 0-based for API but 1-based for UI
  const apiPage = currentPage - 1 >= 0 ? currentPage - 1 : 0;

  // Data fetching and management
  const memberDataHook = useMemberData(eventId, {
    searchTerm: debouncedSearchTerm, // Use debounced search term for API calls
    statusFilter,
    roleFilter,
    departmentFilter
  }, {
    page: apiPage,
    size: pageSize
  });
  
  const {
    members,
    departments,
    loading,
    error,
    totalPages,
    totalElements,
    fetchMembers,
    fetchDepartments,
    clearError
  } = memberDataHook;

  // Modal and UI states
  const modalHook = useMemberModals();
  const {
    activeMenu,
    selectedUser,
    showUserDetail,
    editedUser,
    showEditModal,
    selectedMember,
    isDetailModalOpen,
    isEditModalOpen,
    toggleMenu,
    openUserDetailModal,
    closeUserDetailModal,
    openEditModal,
    closeEditModal,
    handleEditInputChange
  } = modalHook;

  // Member actions (update, ban, delete)
  const actionHook = useMemberActions(eventId);
  const {
    updateMember,
    banMember,
    unbanMember,
    deleteMember
  } = actionHook;

  // ------------------------
  // 2. Derived Values
  // ------------------------
  
  const currentMembers = members;
  const filteredMembers = members;
  const bannedUsers = members.reduce((acc, member) => {
    acc[member.id] = member.isBanned || false;
    return acc;
  }, {});
  const itemsPerPage = pageSize;

  // ------------------------
  // 3. Integration Methods
  // ------------------------
  
  // Simplified and fixed version of handleViewUser
  const handleViewUser = (user) => {
    // console.log('handleViewUser called with user:', user);

    try {
      // Close any open menus when viewing user details
      toggleMenu(null);
      
      // Create a clean copy of the user object to avoid reference issues
      const userCopy = {...user};
      
      // Make sure we have an accountId
      if (!userCopy.accountId && userCopy.id) {
        // console.log('Using id as accountId since accountId is missing');
        userCopy.accountId = userCopy.id;
      }
      
      // Create a clean user object for the modal, even if we're missing data
      const modalUser = {
        ...userCopy,
        id: userCopy.accountId || userCopy.id || Math.random().toString(36).substr(2, 9),
        name: userCopy.name || userCopy.fullName || 'Unknown User',
        role: userCopy.role || userCopy.eventRole || 'N/A',
        status: userCopy.status || (userCopy.isActive ? 'Active' : 'Inactive') || 'N/A',
        department: userCopy.department || userCopy.departmentName || 'N/A',
        isBanned: userCopy.isBanned !== undefined ? userCopy.isBanned : !userCopy.isActive,
        email: userCopy.email || 'N/A',
      };
      
      // console.log('Opening modal with cleaned user data:', modalUser);
      
      // Force modal to open immediately with what we have
      openUserDetailModal(modalUser);
      
      // If we have an accountId, fetch additional details from API
      if (userCopy.accountId) {
        // console.log('Fetching additional details from API...');
        
        // Use a separate async function for the API call
        const fetchDetails = async () => {
          try {
            const response = await memberService.getMemberDetails(eventId, userCopy.accountId);
            
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
                dateOfBirth: response.data.dateOfBirth ? 
                  new Date(response.data.dateOfBirth).toLocaleDateString('vi-VN') : null,
                // Make sure we have access to all properties
                studentId: response.data.studentId || null,
                gender: response.data.gender || null,
                avatarUrl: response.data.avatarUrl || null
              };
              
              // console.log('API returned user details:', transformedUser);
              openUserDetailModal(transformedUser);
            }
          } catch (err) {
            console.error('Error fetching user details from API:', err);
          }
        };
        
        // Execute the async function
        fetchDetails();
      }
    } catch (err) {
      console.error('Error in handleViewUser:', err);
    }
  };

  const handleEditUser = (user) => {
    // console.log('handleEditUser called with user:', user);
    // Close any open menus when editing
    toggleMenu(null);
    
    // Create a clean copy of the user object to avoid reference issues
    const userCopy = {...user};
    
    // Chuẩn bị dữ liệu user cho edit modal
    const editableUser = {
      ...userCopy,
      id: userCopy.accountId || userCopy.id,
      name: userCopy.fullName || userCopy.name,
      role: userCopy.eventRole || userCopy.role,
      status: userCopy.isActive !== undefined ? (userCopy.isActive ? 'Active' : 'Inactive') : userCopy.status,
      department: userCopy.departmentName || userCopy.department || 'N/A',
      isBanned: userCopy.isBanned !== undefined ? userCopy.isBanned : !userCopy.isActive
    };
    
    // console.log('Opening edit modal with user:', editableUser);
    
    // Open edit modal directly for improved responsiveness
    openEditModal(editableUser);
  };

  const handleSaveUser = async () => {
    try {
      // console.log('Saving edited user data:', JSON.stringify(editedUser));
      
      // Ensure the isActive field is correctly set based on status
      if (editedUser.isActive === undefined && editedUser.status) {
        const isActive = editedUser.status === 'Active';
        // console.log(`Setting missing isActive to ${isActive} based on status ${editedUser.status}`);
        editedUser.isActive = isActive;
      }
      
      const result = await updateMember(editedUser, departments);
      
      if (result.success) {
        // console.log('Member updated successfully:', result.data);
        
        // Force a full refresh of the members list to ensure UI updates
        // console.log('Forcing complete refresh of member list');
        await fetchMembers();
        closeEditModal();
      } else {
        console.error('Failed to update member');
      }
    } catch (err) {
      console.error('Error updating member:', err);
    }
  };

  const handleBanUser = async (member, shouldBeBanned) => {
    try {
      // console.log(`Ban User called for ${member.name} with shouldBeBanned=${shouldBeBanned}`);
      // Close any open menus when banning/unbanning
      toggleMenu(null);
      
      let success;
      // If shouldBeBanned is true, we want to ban the user
      // If shouldBeBanned is false, we want to unban the user
      if (shouldBeBanned) {
        // console.log('Calling banMember for', member.name);
        success = await banMember(member);
      } else {
        // console.log('Calling unbanMember for', member.name);
        success = await unbanMember(member);
      }
      
      // Refresh member list on success
      if (success) {
        // console.log('Ban operation successful, refreshing members list');
        await fetchMembers();
      } else {
        // console.log('Ban operation failed, not refreshing members list');
      }
    } catch (err) {
      console.error('Error banning/unbanning member:', err);
    }
  };

  const handleDeleteMember = async (member) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await deleteMember(member);
        // Refresh member list on success
        await fetchMembers();
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  // Handle filter changes (giữ lại cho tương thích)
  const handleFilterChange = (filterType, value) => {
    if (currentPage !== 0) {
      handlePageChange(1);
    }
    
    switch (filterType) {
      case 'role':
        handleRoleFilter(value);
        break;
      case 'department':
        handleDepartmentFilter(value);
        break;
      case 'status':
        handleStatusFilter(value);
        break;
      default:
        break;
    }
  };

  // Change event
  const changeEvent = (newEventId) => {
    setEventId(newEventId);
    if (currentPage !== 0) {
      handlePageChange(1);
    }
  };

  // ------------------------
  // 4. Method Aliases
  // ------------------------
  
  // Alias functions để tương thích với Members.jsx
  const handleViewDetails = handleViewUser;
  const handleEditMember = handleEditUser;
  const handleUpdateMember = handleSaveUser;
  const handleBanMember = handleBanUser;
  const handleCancelEdit = closeEditModal;
  
  // Create aliases for modal functions to match expected names in Members.jsx
  const closeUserDetail = closeUserDetailModal;
  const closeDetailModal = closeUserDetailModal;
  const openDetailModal = openUserDetailModal;

  // ------------------------
  // 5. Effect Hooks
  // ------------------------
  
  // Sử dụng ref để theo dõi việc fetch dữ liệu ban đầu
  const initialFetchRef = useRef(true);
  
  // Initial data fetch - chỉ gọi một lần khi component mount
  useEffect(() => {
    if (initialFetchRef.current) {
      // Đặt timeout ngắn để đảm bảo hook initialization hoàn tất
      setTimeout(() => {
        fetchMembers();
        fetchDepartments();
      }, 100);
      initialFetchRef.current = false;
    }
  }, []);

  return {
    // Data - tương thích với Members.jsx
    currentMembers,
    filteredMembers,
    bannedUsers,
    members,
    departments,
    loading,
    error,
    totalPages,
    totalElements,
    
    // Search and filter state - tương thích với Members.jsx
    searchTerm,
    statusFilter,
    roleFilter,
    departmentFilter,
    
    // Pagination state - tương thích với Members.jsx
    currentPage,
    totalPages,
    itemsPerPage,
    pageSize,
    
    // UI state - tương thích với Members.jsx
    activeMenu,
    selectedUser,
    showUserDetail,
    editedUser,
    showEditModal,
    
    // Modal states - giữ lại cho tương thích
    selectedMember,
    isDetailModalOpen,
    isEditModalOpen,
    
    // Event
    eventId,
    
    // Handlers - tương thích với Members.jsx
    handleSearch,
    handleStatusFilter,
    handleRoleFilter,
    handleDepartmentFilter,
    applyFilters,
    resetFilters,
    paginate,
    toggleMenu,
    handleBanUser,
    handleViewUser,
    closeUserDetail,
    handleEditUser,
    handleEditInputChange,
    handleSaveUser,
    handleCancelEdit,
    
    // Additional handlers - giữ lại cho tương thích
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewDetails,
    handleEditMember,
    handleUpdateMember,
    handleBanMember,
    handleDeleteMember,
    closeDetailModal,
    closeEditModal,
    clearError,
    changeEvent,
    fetchMembers
  };
};

// Export the hook as both named and default export
export { useMemberManagement };
export default useMemberManagement;
