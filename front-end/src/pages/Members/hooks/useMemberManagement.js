import { useState, useEffect } from 'react';
import memberService from '../../../services/memberService';

// Custom hook to manage member data and related state
export const useMemberManagement = () => {
  // State cho member data từ API
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State cho filters và pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [eventId, setEventId] = useState(1); // Mặc định event ID = 1, có thể thay đổi
  
  // Filter states để tương thích với Members.jsx
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // UI states để tương thích với Members.jsx
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Modal states (alias cho tương thích)
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch members từ API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
        page: currentPage,
        size: pageSize
      };

      const response = await memberService.getMembers(eventId, params);
      
      if (response.success && response.data) {
        // Transform API data to match front-end expectations
        const transformedMembers = (response.data.content || []).map(member => ({
          ...member,
          id: member.accountId, // Add id field for UI compatibility
          name: member.fullName, // Transform fullName to name
          role: member.eventRole, // Transform eventRole to role
          status: member.isActive ? 'Active' : 'Inactive', // Transform isActive to status
          department: member.departmentName || 'N/A', // Transform departmentName to department
          isBanned: !member.isActive // Map inactive to banned for UI logic
        }));
        
        setMembers(transformedMembers);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        setError('Không thể tải danh sách thành viên');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Load members khi component mount hoặc khi filter thay đổi
  useEffect(() => {
    fetchMembers();
  }, [currentPage, pageSize, eventId, searchTerm, roleFilter, departmentFilter, statusFilter]);

  // Computed values để tương thích với Members.jsx
  const currentMembers = members; // Đồng bộ với members từ API
  const filteredMembers = members; // Có thể thêm logic filter local nếu cần
  const bannedUsers = members.reduce((acc, member) => {
    acc[member.id] = member.isBanned || false;
    return acc;
  }, {}); // Transform to object with member.id as key for UI compatibility
  const itemsPerPage = pageSize; // Alias cho pageSize

  // Handler functions để tương thích với Members.jsx
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    setCurrentPage(0);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(0);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(0);
  };

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilter(!showAdvancedFilter);
  };

  const applyFilters = () => {
    setCurrentPage(0);
    fetchMembers();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setRoleFilter('');
    setDepartmentFilter('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const toggleMenu = (userId) => {
    setActiveMenu(activeMenu === userId ? null : userId);
  };

  const handleViewUser = async (user) => {
    try {
      setLoading(true);
      const response = await memberService.getMemberDetails(eventId, user.accountId);
      
      if (response.success && response.data) {
        // Transform API data to match front-end expectations
        const transformedUser = {
          ...response.data,
          id: response.data.accountId,
          name: response.data.fullName,
          role: response.data.eventRole,
          status: response.data.isActive ? 'Active' : 'Inactive',
          department: response.data.departmentName || 'N/A',
          isBanned: !response.data.isActive
        };
        
        setSelectedUser(transformedUser);
        setSelectedMember(transformedUser);
        setShowUserDetail(true);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching member details:', err);
      setError('Không thể tải chi tiết thành viên');
    } finally {
      setLoading(false);
    }
  };

  const closeUserDetail = () => {
    setShowUserDetail(false);
    setIsDetailModalOpen(false);
    setSelectedUser(null);
    setSelectedMember(null);
  };

  const handleEditUser = (user) => {
    setEditedUser(user);
    setSelectedMember(user);
    setShowEditModal(true);
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      const response = await memberService.updateMember(editedUser);
      
      if (response.success) {
        await fetchMembers();
        setShowEditModal(false);
        setIsEditModalOpen(false);
        setEditedUser(null);
        setSelectedMember(null);
      }
    } catch (err) {
      console.error('Error updating member:', err);
      setError('Không thể cập nhật thông tin thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setIsEditModalOpen(false);
    setEditedUser(null);
    setSelectedMember(null);
  };

  // Handle search với alias
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const handleBanMember = async (member, isBanned) => {
    try {
      setLoading(true);
      const banData = {
        eventId: eventId,
        accountId: member.accountId || member.id,
        isBanned: isBanned,
        reason: isBanned ? 'Banned by admin' : 'Unbanned by admin'
      };
      
      const response = await memberService.banMember(banData);
      
      if (response.success) {
        await fetchMembers();
      }
    } catch (err) {
      console.error('Error banning/unbanning member:', err);
      setError('Không thể thực hiện hành động này');
    } finally {
      setLoading(false);
    }
  };

  // Alias cho handleBanMember
  const handleBanUser = handleBanMember;

  const handleDeleteMember = async (member) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        setLoading(true);
        await memberService.removeMember(eventId, member.accountId);
        await fetchMembers();
      } catch (err) {
        console.error('Error deleting member:', err);
        setError('Không thể xóa thành viên');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle filter changes (giữ lại cho tương thích)
  const handleFilterChange = (filterType, value) => {
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
  };

  // Handle pagination (giữ lại cho tương thích)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  // Close modals
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMember(null);
    setSelectedUser(null);
    setShowUserDetail(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMember(null);
    setEditedUser(null);
    setShowEditModal(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Change event
  const changeEvent = (newEventId) => {
    setEventId(newEventId);
    setCurrentPage(0);
  };

  // Alias functions để tương thích với Members.jsx
  const handleViewDetails = handleViewUser;
  const handleEditMember = handleEditUser;
  const handleUpdateMember = handleSaveUser;

  return {
    // Data - tương thích với Members.jsx
    currentMembers,
    filteredMembers,
    bannedUsers,
    members, // Giữ lại cho các component khác
    loading,
    error,
    totalPages,
    totalElements,
    
    // Search and filter state - tương thích với Members.jsx
    searchTerm,
    statusFilter,
    roleFilter,
    departmentFilter,
    startDate,
    endDate,
    showAdvancedFilter,
    
    // Pagination state - tương thích với Members.jsx
    currentPage,
    totalPages,
    itemsPerPage,
    pageSize, // Giữ lại cho tương thích
    
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
    handleStartDateChange,
    handleEndDateChange,
    toggleAdvancedFilter,
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
