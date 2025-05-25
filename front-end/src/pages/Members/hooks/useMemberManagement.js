import { useState, useEffect } from 'react';

// Custom hook to manage member data and related state
export const useMemberManagement = () => {
  // Initial members data
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      role: 'Admin',
      status: 'Active',
      joined: '2/20/2024',
      department: 'Marketing'
    },
    {
      id: 2,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      role: 'Member',
      status: 'Active',
      joined: '3/1/2024',
      department: 'HR'
    },
    {
      id: 3,
      name: 'James Martin',
      email: 'james.martin@example.com',
      role: 'Moderator',
      status: 'Active',
      joined: '3/7/2024',
      department: 'IT'
    },
    {
      id: 4,
      name: 'Patricia White',
      email: 'patricia.white@example.com',
      role: 'Member',
      status: 'Active',
      joined: '3/14/2024',
      department: 'Finance'
    },
    {
      id: 5,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      role: 'Member',
      status: 'Inactive',
      joined: '1/15/2024',
      department: 'Sales'
    },
    {
      id: 6,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Member',
      status: 'Active',
      joined: '4/2/2024',
      department: 'Marketing'
    },
    {
      id: 7,
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'Member',
      status: 'Inactive',
      joined: '2/10/2024',
      department: 'IT'
    },
    {
      id: 8,
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      role: 'Moderator',
      status: 'Active',
      joined: '3/22/2024',
      department: 'HR'
    },
    {
      id: 9,
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Member',
      status: 'Active',
      joined: '2/28/2024',
      department: 'Finance'
    },
    {
      id: 10,
      name: 'Laura Wilson',
      email: 'laura.wilson@example.com',
      role: 'Member',
      status: 'Active',
      joined: '4/10/2024',
      department: 'IT'
    },
    {
      id: 11,
      name: 'Thomas Lee',
      email: 'thomas.lee@example.com',
      role: 'Member',
      status: 'Active',
      joined: '3/5/2024',
      department: 'Sales'
    },
    {
      id: 12,
      name: 'Jessica Clark',
      email: 'jessica.clark@example.com',
      role: 'Member',
      status: 'Inactive',
      joined: '2/15/2024',
      department: 'Marketing'
    }
  ]);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Advanced filter state
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // User management state
  const [bannedUsers, setBannedUsers] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    
    // Role filter
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (startDate && endDate) {
      const memberDate = new Date(member.joined);
      const startFilterDate = new Date(startDate);
      const endFilterDate = new Date(endDate);
      matchesDateRange = memberDate >= startFilterDate && memberDate <= endFilterDate;
    }
    
    return matchesSearch && matchesStatus && matchesRole && matchesDateRange;
  });

  // Get current members for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, startDate, endDate]);

  // Handler functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const applyFilters = () => {
    setShowAdvancedFilter(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setRoleFilter('All');
    setStartDate('');
    setEndDate('');
    setShowAdvancedFilter(false);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleAdvancedFilter = () => {
    setShowAdvancedFilter(!showAdvancedFilter);
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleBanUser = (id) => {
    setBannedUsers({
      ...bannedUsers,
      [id]: !bannedUsers[id]
    });
    setActiveMenu(null);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
    setActiveMenu(null);
  };

  const closeUserDetail = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setEditedUser({...user});
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = () => {
    setMembers(members.map(member => 
      member.id === editedUser.id ? editedUser : member
    ));
    setShowEditModal(false);
    setEditedUser(null);
    
    // If user detail modal is open, update the selected user
    if (showUserDetail && selectedUser?.id === editedUser.id) {
      setSelectedUser(editedUser);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditedUser(null);
  };

  return {
    // Data
    members,
    filteredMembers,
    currentMembers,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    
    // State
    searchTerm,
    statusFilter,
    roleFilter,
    currentPage,
    itemsPerPage,
    showAdvancedFilter,
    startDate,
    endDate,
    bannedUsers,
    activeMenu,
    selectedUser,
    showUserDetail,
    editedUser,
    showEditModal,
    
    // Handlers
    handleSearch,
    handleStatusFilter,
    handleRoleFilter,
    handleStartDateChange,
    handleEndDateChange,
    applyFilters,
    resetFilters,
    paginate,
    toggleAdvancedFilter,
    toggleMenu,
    handleBanUser,
    handleViewUser,
    closeUserDetail,
    handleEditUser,
    handleEditInputChange,
    handleSaveUser,
    handleCancelEdit,
    
    // Setters
    setStatusFilter,
    setRoleFilter
  };
};
