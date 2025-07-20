import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useUserPermissions from '../../hooks/useUserPermissions';
import useDebounce from '../../hooks/useDebounce';
import MemberFilters from '../../components/filter/MemberFilters';
import MemberTable from '../../components/member/MemberTable';
import MemberCard from '../../components/member/MemberCard';
import Pagination from '../../components/member/Pagination';
import NoResults from '../../components/member/NoResults';
import MemberDetailModal from '../../components/member/MemberDetailModal';
import EditMemberModal from '../../components/member/EditMemberModal';
import memberService from '../../services/memberService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/visual/LoadingSpinner';
import ActionLoadingButton from '../../components/visual/ActionLoadingButton';

const EventMemberPage = () => {
  const { id: eventIdParam } = useParams();
  const eventId = eventIdParam ? parseInt(eventIdParam) : null;
  
  // States for data
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [bannedUsers, setBannedUsers] = useState({});
  
  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // States for loading and error
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // States for action loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionTargetId, setActionTargetId] = useState(null);
  
  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // States for selection and bulk actions
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // States for modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Get user permissions for the current event
  const {
    userRole,
    loading: permissionsLoading,
    error: permissionsError,
    canEdit,
    canBan,
    canView,
    isAdminOrManager,
  } = useUserPermissions();
  
  // Function to handle search term changes
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search term changes
  }, []);
  
 
  
  // This debug effect was left in place
  // The logger utility only shows debug messages in development, not production

  // Function to fetch members - use useCallback to recreate when dependencies change
  const fetchMembers = useCallback(async (signal) => {
    if (!eventId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Calculate API page (0-indexed)
      const apiPage = currentPage - 1 >= 0 ? currentPage - 1 : 0;
      
      // Prepare params for API call
      const params = {
        page: apiPage,
        size: itemsPerPage
      };
      
      // Add search term if available
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
        // Add status filter if available - follow memberService.js format
      if (statusFilter) {
        // Normalize status to match memberService expectations
        params.status = statusFilter.toLowerCase().trim() === 'active' ? 'active' : 'inactive';
      }       // Add role filter if available - follow memberService.js format
      if (roleFilter) {
        // Đảm bảo role format đúng theo backend (uppercase)
        params.role = roleFilter.trim().toUpperCase();
      }
      
      // Add department filter if available - follow memberService.js format
      if (departmentFilter !== undefined && departmentFilter !== '') {
        // Sử dụng logic giống như trong memberService.js
        const departmentValue = Number.isInteger(Number(departmentFilter)) && 
                              Number(departmentFilter) > 0 
                                ? Number(departmentFilter) 
                                : departmentFilter.toString().trim();
        params.department = departmentValue;
      }
      
      // Check if ANY filter is applied
      const hasAnyFilter = !!(params.search || params.role || params.department || params.status);
      
      // Call existing service with abort signal
      const response = await memberService.getMembers(eventId, params, signal);
      
      // Don't update state if the request was aborted
      if (signal?.aborted) return;
      
      // Process response
      let memberData = [];
      let totalPagesCount = 1;
      let totalElementsCount = 0;
      
      // Process response data from API
      
    

      // Handle different response formats
      if (response && response.content) {
        // If response is a Page object
        memberData = response.content;
        totalPagesCount = response.totalPages || 1;
        totalElementsCount = response.totalElements || memberData.length;
      } else if (Array.isArray(response)) {
        // If response is a direct array
        memberData = response;
        totalPagesCount = Math.ceil(response.length / itemsPerPage);
        totalElementsCount = response.length;
      } else if (response && response.data) {
        // If response is wrapped in data field
        if (Array.isArray(response.data)) {
          memberData = response.data;
          totalPagesCount = Math.ceil(response.data.length / itemsPerPage);
          totalElementsCount = response.data.length;
        } else if (response.data.content) {
          memberData = response.data.content;
          totalPagesCount = response.data.totalPages || 1;
          totalElementsCount = response.data.totalElements || memberData.length;
        } else {
          // Fallback for other structures
          memberData = response.data.members || response.data || [];
          totalPagesCount = response.data.totalPages || response.totalPages || 1;
          totalElementsCount = response.data.totalElements || response.totalElements || memberData.length;
        }
      }
      
      // Transform member data for consistency
      
      // Transform member data for consistency
      const transformedMembers = memberData.map(member => {
        // Ensure isActive value is properly converted to boolean
        const isActive = 
          typeof member.isActive === 'boolean' ? member.isActive :
          member.isActive === 'true' || member.status === 'Active';
        
        return {
          ...member,
          id: member.accountId || member.id, // Add id field for UI compatibility
          name: member.fullName || member.name, // Transform fullName to name
          role: member.eventRole || member.role, // Handle both eventRole and role fields
          status: isActive ? 'Active' : 'Inactive', // Transform isActive to status
          department: member.departmentName || member.department || 'N/A', // Transform departmentName to department
          isBanned: !isActive, // Map inactive to banned for UI logic
          isActive: isActive, // Store explicit isActive value
          avatarUrl: member.avatarUrl || null, // Ensure avatarUrl is available
        };
      });
      
      // Apply client-side filtering if API doesn't seem to be filtering
      // This is a fallback when API doesn't filter correctly
      let finalMembers = transformedMembers;
      let finalCount = totalElementsCount;
      
      // Check if we have filters but the data doesn't seem filtered
      const hasFilter = !!(statusFilter || roleFilter || departmentFilter || searchTerm);
      // Variable declaration moved outside the block to be accessible in the entire function scope
      let shouldFilter = false;
      
      if (hasFilter) {
        // Check if we should manually filter
        
        // Luôn filter ở client-side khi có search, role hoặc department mà không có statusFilter
        // Vì dường như API chỉ hoạt động khi có statusFilter
        if (!statusFilter && (searchTerm || roleFilter || departmentFilter)) {
          shouldFilter = true;
        }
        
        // For status filter
        if (statusFilter) {
          const wantActive = statusFilter.toLowerCase() === 'active';
          const activeCount = transformedMembers.filter(m => m.isActive === wantActive).length;
          // If all members are returned regardless of filter, API filtering isn't working
          shouldFilter = activeCount < transformedMembers.length;
        }
        
        // Check other filters even when there's no status filter
        if (!statusFilter && (searchTerm || roleFilter || departmentFilter)) {
          shouldFilter = true;
        }
        
        // Apply client-side filtering if needed
        if (shouldFilter) {
          // Filter by status
          if (statusFilter) {
            const wantActive = statusFilter.toLowerCase() === 'active';
            finalMembers = finalMembers.filter(m => m.isActive === wantActive);
          }
          
          // Filter by role
          if (roleFilter) {
            finalMembers = finalMembers.filter(m => 
              m.role && m.role.toUpperCase() === roleFilter.toUpperCase()
            );
          }
          
          // Filter by department (if numeric, match ID; otherwise match name)
          if (departmentFilter) {
            const isDepartmentId = !isNaN(Number(departmentFilter)) && Number(departmentFilter) > 0;
            
            if (isDepartmentId) {
              const deptId = Number(departmentFilter);
              finalMembers = finalMembers.filter(m => 
                (m.departmentId && Number(m.departmentId) === deptId)
              );
            } else {
              const deptName = departmentFilter.toString().toLowerCase().trim();
              finalMembers = finalMembers.filter(m => 
                m.department && m.department.toLowerCase().includes(deptName)
              );
            }
          }
          
          // Search by name or email
          if (searchTerm && searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            finalMembers = finalMembers.filter(m =>
              (m.name && m.name.toLowerCase().includes(search)) ||
              (m.email && m.email.toLowerCase().includes(search))
            );
          }
          
          // Update pagination data
          finalCount = finalMembers.length;
          
          // Pagination with client-side filtering
          const clientPage = currentPage - 1;
          const startIndex = clientPage * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          
          // Get only the current page items
          const pagedMembers = finalMembers.slice(startIndex, endIndex);
          
          // If client filtering returned a small result that doesn't include the current page
          if (startIndex >= finalCount && finalCount > 0) {
            // Reset to first page
            setCurrentPage(1);
            finalMembers = finalMembers.slice(0, itemsPerPage);
          } else {
            finalMembers = pagedMembers;
          }
        }
      }
      
      // Update state with filtered data
      setMembers(finalMembers);
      setTotalPages(hasFilter && shouldFilter ? Math.ceil(finalCount / itemsPerPage) : totalPagesCount);
      setTotalElements(hasFilter && shouldFilter ? finalCount : totalElementsCount);
      
      // Create map of banned users for faster lookup
      const bannedMap = {};
      transformedMembers.forEach(member => {
        if (!member.isActive) {
          bannedMap[member.id] = true;
        }
      });
      setBannedUsers(bannedMap);
    } catch (err) {
      // Ignore aborted request errors
      if (err.name === 'AbortError') return;
      
      console.error('Error fetching members:', err);
      setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [eventId, currentPage, itemsPerPage, searchTerm, statusFilter, roleFilter, departmentFilter]);
  
  // Function to fetch departments
  const fetchDepartments = async (signal) => {
    if (!eventId) return;
    
    setDepartmentsLoading(true);
    
    try {
      // Call existing service with abort signal
      const response = await memberService.getDepartments(eventId, signal);
      
      // Don't update state if the request was aborted
      if (signal?.aborted) return;
      
      // Process response
      let depts = [];
      if (Array.isArray(response)) {
        depts = response;
      } else if (response && response.data) {
        depts = Array.isArray(response.data) ? response.data : [];
      }
      
      setDepartments(depts);
    } catch (err) {
      // Ignore aborted request errors
      if (err.name === 'AbortError') return;
      
      console.error('Error fetching departments:', err);
    } finally {
      if (!signal?.aborted) {
        setDepartmentsLoading(false);
      }
    }
  };
  
  // Effect to load initial data
  useEffect(() => {
    if (eventId) {
      // Create abort controller for cancelling requests when component unmounts
      const abortController = new AbortController();
      
      fetchMembers(abortController.signal);
      fetchDepartments(abortController.signal);
      
      // Cleanup function to abort requests when component unmounts
      return () => {
        abortController.abort();
      };
    }
  }, [eventId, fetchMembers]);
  
  // Effect to reload data when filters change
  useEffect(() => {
    if (eventId) {
      // Create abort controller for cancelling requests when component unmounts
      const abortController = new AbortController();
      
      fetchMembers(abortController.signal);
      
      // Cleanup function to abort requests when component unmounts
      return () => {
        abortController.abort();
      };
    }
  }, [eventId, searchTerm, statusFilter, roleFilter, departmentFilter, currentPage, fetchMembers]);
  
  // Handler functions
  const handleSearch = useCallback((value) => {
    // Immediate search instead of debounce
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);
  
  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);
  
  const handleRoleFilter = useCallback((role) => {
    setRoleFilter(role);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);
  
  const handleDepartmentFilter = useCallback((department) => {
    setDepartmentFilter(department);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);
  
  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [currentPage]);
  
  // Add debounce to pagination to prevent rapid page changes
  const paginate = useDebounce(handlePageChange, 300);
  
  // Function to show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
  };
  
  // Modal handlers
  const handleViewUser = (user) => {
    // Create a clean copy of user object
    const userCopy = { ...user };
    
    // Set default values for missing fields
    if (!userCopy.accountId && userCopy.id) {
      userCopy.accountId = userCopy.id;
    }
    
    setSelectedUser(userCopy);
    setShowUserDetail(true);
  };
  
  const closeUserDetail = () => {
    setSelectedUser(null);
    setShowUserDetail(false);
  };
  
  const handleEditUser = (user) => {
    // First close the detail modal if it's open
    if (showUserDetail) {
      setShowUserDetail(false);
    }
    
    // Create a clean copy for editing
    const userForEdit = { ...user };
    
    // Ensure required fields are present
    if (!userForEdit.accountId && userForEdit.id) {
      userForEdit.accountId = userForEdit.id;
    }
    
    setEditedUser(userForEdit);
    setShowEditModal(true);
  };
  
  const handleEditInputChange = (field, value, depts) => {
    if (!editedUser) return;
    
    setEditedUser(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'departmentId' && depts && Array.isArray(depts) && {
        departmentName: depts.find(d => d.departmentId === value)?.name || 'Unknown'
      })
    }));
  };
  
  const handleSaveUser = async () => {
    if (!editedUser) return;
    
    setIsActionLoading(true);
    setActionType('edit');
    setActionTargetId(editedUser.accountId || editedUser.id);
    
    try {
      // Prepare data for update
      const updateData = {
        eventId,
        accountId: editedUser.accountId || editedUser.id,
        role: editedUser.role || editedUser.eventRole,
        departmentId: editedUser.departmentId,
        isActive: editedUser.status === 'Active',
        reason: 'Updated by admin'
      };
      
      // Call service to update member
      await memberService.updateMember(updateData);
      
      // Close modal and reload data
      setShowEditModal(false);
      setEditedUser(null);
      fetchMembers();
      
      // Show success toast
      showToast('Thành viên đã được cập nhật thành công', 'success');
    } catch (err) {
      console.error('Error updating member:', err);
      showToast('Lỗi khi cập nhật thành viên', 'error');
    } finally {
      setIsActionLoading(false);
      setActionType(null);
      setActionTargetId(null);
    }
  };
  
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditedUser(null);
  };
  
  const handleBanUser = async (user, isBanned = true) => {
    const userId = user.accountId || user.id;
    
    setIsActionLoading(true);
    setActionType('ban');
    setActionTargetId(userId);
    
    try {
      // Prepare data for ban action
      const banData = {
        eventId,
        accountId: userId,
        isBanned,
        reason: isBanned ? 'Banned by admin' : 'Unbanned by admin'
      };
      
      // Call service to ban/unban member
      await memberService.banMember(banData);
      
      // Close modal and reload data
      if (showUserDetail) {
        setShowUserDetail(false);
        setSelectedUser(null);
      }
      fetchMembers();
      
      // Show success toast
      const action = isBanned ? 'cấm' : 'bỏ cấm';
      showToast(`Thành viên đã được ${action} thành công`, 'success');
    } catch (err) {
      console.error('Error banning/unbanning member:', err);
      showToast('Lỗi khi thực hiện thao tác', 'error');
    } finally {
      setIsActionLoading(false);
      setActionType(null);
      setActionTargetId(null);
    }
  };
  
  const handleBulkBanUsers = async () => {
    if (selectedMembers.length === 0) return false;
    
    setIsActionLoading(true);
    setActionType('bulkBan');
    
    try {
      // Prepare data for bulk ban
      const banData = {
        eventId,
        accountIds: selectedMembers,
        isBanned: true,
        reason: `Bulk banned by ${userRole || 'admin'}`
      };
      
      // Call service to bulk ban members
      await memberService.bulkBanMembers(banData);
      
      // Reload data and clear selection
      fetchMembers();
      setSelectedMembers([]);
      setIsConfirmDialogOpen(false);
      
      // Show success toast
      showToast(`Đã cấm ${selectedMembers.length} thành viên thành công`, 'success');
      return true;
    } catch (err) {
      console.error('Error in bulk ban:', err);
      showToast('Lỗi khi cấm thành viên', 'error');
      return false;
    } finally {
      setIsActionLoading(false);
      setActionType(null);
    }
  };
  
  // Function to handle member selection
  const handleSelectMember = (memberId, event) => {
    if (event.nativeEvent.shiftKey && selectedMembers.length > 0) {
      // For shift+click selection
      const memberIds = members.map(m => m.id);
      const lastSelectedIndex = memberIds.indexOf(selectedMembers[selectedMembers.length - 1]);
      const currentIndex = memberIds.indexOf(memberId);
      
      if (lastSelectedIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeToSelect = memberIds.slice(start, end + 1);
        
        setSelectedMembers(prev => [...new Set([...prev, ...rangeToSelect])]);
        return;
      }
    }
    
    // Regular toggle selection
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(members.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };
  
  const areAllSelected = members.length > 0 && members.every(member => selectedMembers.includes(member.id));
  
  // Function for bulk ban action
  const performBulkBanAction = async () => {
    setIsConfirmDialogOpen(false);
    if (selectedMembers.length === 0) return;
    
    try {
      const success = await handleBulkBanUsers(selectedMembers);
      
      if (success) {
        showToast(`Đã cấm ${selectedMembers.length} thành viên thành công`, 'success');
        setSelectedMembers([]);
      } else {
        showToast('Đã xảy ra lỗi khi cấm thành viên', 'error');
      }
    } catch (error) {
      console.error('Error in bulk ban action:', error);
      showToast('Đã xảy ra lỗi khi cấm thành viên', 'error');
    }
  };
  
  // UI for bulk actions bar with improved UX
  const renderBulkActionsBar = () => {
    if (selectedMembers.length === 0) return null;
    
    const isBulkBanLoading = isActionLoading && actionType === 'bulkBan';
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 px-4 z-10 flex justify-between items-center">
        <div className="flex items-center">
          {isBulkBanLoading && (
            <div className="w-5 h-5 mr-2">
              <LoadingSpinner size="sm" color="primary" />
            </div>
          )}
          <span className="font-medium">{selectedMembers.length}</span>{' '}
          {selectedMembers.length === 1 ? 'member' : 'members'} selected
          {isBulkBanLoading && <span className="ml-2 text-blue-600 text-sm">Processing...</span>}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMembers([])}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={isBulkBanLoading}
          >
            Cancel
          </button>
          <ActionLoadingButton
            isLoading={isBulkBanLoading}
            onClick={() => setIsConfirmDialogOpen(true)}
            variant="danger"
            loadingText="Processing..."
            className="flex items-center transition-all"
            disabled={isBulkBanLoading}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
            Ban Selected
          </ActionLoadingButton>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Manage Members
      </h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header Controls - Responsive */}
        <MemberFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          departmentFilter={departmentFilter}
          departments={departments}
          departmentsLoading={departmentsLoading}
          onSearchChange={handleSearch}
          onStatusFilterChange={handleStatusFilter}
          onRoleFilterChange={handleRoleFilter}
          onDepartmentFilterChange={handleDepartmentFilter}
          onAddMember={() => {}}
        />
        
        {/* Bulk action menu when members are selected */}
        {selectedMembers.length > 0 && (
          <div className="bg-blue-50 border-y border-blue-200 px-4 py-2 flex items-center justify-between">
            <div>
              <span className="font-medium">{selectedMembers.length}</span>{' '}
              {selectedMembers.length === 1 ? 'member' : 'members'} selected
            </div>
            <div className="flex space-x-2">
              <ActionLoadingButton
                isLoading={isActionLoading && actionType === 'bulkBan'}
                onClick={() => setIsConfirmDialogOpen(true)}
                variant="danger"
                loadingText="Processing..."
                size="md"
                className="flex items-center"
                disabled={isActionLoading && actionType === 'bulkBan'}
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
                Ban Selected
              </ActionLoadingButton>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <MemberTable
              members={members || []}
              bannedUsers={bannedUsers || {}}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onBanUser={handleBanUser}
              canEdit={canEdit}
              canBan={canBan}
              canView={canView}
              userRole={userRole || sessionStorage.getItem('userRole') || 'GUEST'}
              selectedMembers={selectedMembers}
              onSelectMember={handleSelectMember}
              areAllSelected={areAllSelected}
              onSelectAll={handleSelectAll}
              isActionLoading={isActionLoading}
              actionType={actionType}
              actionTargetId={actionTargetId}
            />
            
            {/* Mobile & Tablet Card View */}
            <MemberCard
              members={members || []}
              bannedUsers={bannedUsers || {}}
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onBanUser={handleBanUser}
              canEdit={canEdit}
              canBan={canBan}
              canView={canView}
              userRole={userRole || sessionStorage.getItem('userRole') || 'GUEST'}
              selectedMembers={selectedMembers}
              onSelectMember={handleSelectMember}
              isActionLoading={isActionLoading}
              actionType={actionType}
              actionTargetId={actionTargetId}
            />
            
            {/* No results message with improved UI */}
            {members.length === 0 && !loading && (
              <NoResults 
                message={
                  searchTerm || statusFilter || roleFilter || departmentFilter 
                    ? "Không tìm thấy thành viên nào phù hợp với bộ lọc. Vui lòng thử lại với điều kiện khác."
                    : "Chưa có thành viên nào trong sự kiện này. Hãy thêm thành viên mới."
                }
                icon={searchTerm || statusFilter || roleFilter || departmentFilter ? "search" : "users"}
              />
            )}
            
            {/* Pagination */}
            {members.length > 0 && (
              <>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalElements}
                  itemsPerPage={itemsPerPage}
                  onPageChange={paginate}
                />
              </>
            )}
          </>
        )}
      </div>
      
      {/* Member Detail Modal */}
      <MemberDetailModal
        isOpen={!!showUserDetail}
        user={selectedUser || null}
        isBanned={selectedUser && selectedUser.id ? bannedUsers[selectedUser.id] || false : false}
        onClose={() => closeUserDetail()}
        onEdit={(user) => handleEditUser(user)}
        onBan={(user, banStatus) => handleBanUser(user, banStatus)}
        canEdit={canEdit}
        canBan={canBan}
        userRole={userRole}
      />
      
      {/* Edit Member Modal */}
      <EditMemberModal
        isOpen={showEditModal === true}
        user={editedUser || null}
        departments={departments || []}
        onClose={() => handleCancelEdit()}
        onSave={() => handleSaveUser()}
        onChange={(field, value, depts) => handleEditInputChange(field, value, depts)}
        canEdit={canEdit}
        userRole={userRole}
      />
      
      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ban Selected Members</h3>
            <p className="mb-6">
              Are you sure you want to ban {selectedMembers.length} member(s)?
              This action can be undone later.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={isActionLoading && actionType === 'bulkBan'}
              >
                Cancel
              </button>
              <ActionLoadingButton
                isLoading={isActionLoading && actionType === 'bulkBan'}
                onClick={performBulkBanAction}
                variant="danger"
                loadingText="Banning..."
                size="md"
              >
                Ban Members
              </ActionLoadingButton>
            </div>
          </div>
        </div>
      )}
      
      {/* Render bulk actions bar */}
      {renderBulkActionsBar()}
      
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-20 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center
            ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          <span>{toast.message}</span>
          <button
            className="ml-3 text-white font-bold"
            onClick={() => setToast({ show: false, message: '', type: '' })}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Global Loading Overlay */}
      {isActionLoading && actionType === 'bulkBan' && (
        <LoadingSpinner
          overlay={true}
          size="lg"
          color="primary"
          variant="circle"
          text={`Processing ${selectedMembers.length} members...`}
        />
      )}
    </div>
  );
};

export default EventMemberPage;
