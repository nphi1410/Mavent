import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faFilter, faPlus, faUser, faEdit, 
  faTrashAlt, faChevronLeft, faChevronRight, faTimes, faChevronDown,
  faEllipsisV, faBan, faEye, faSave
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/layout/Layout';

const Members = () => {
  // State for members data
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

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageSizeOptions] = useState([5, 10, 15, 20]);
  
  // State for advanced filter sidebar
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  
  // State for date range filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for banned users
  const [bannedUsers, setBannedUsers] = useState({});
  
  // State for action menu
  const [activeMenu, setActiveMenu] = useState(null);
  
  // State for user detail modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  
  // State for edit user
  const [editedUser, setEditedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for status filter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handler for role filter
  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  // Handler for date filters
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

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
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, roleFilter, startDate, endDate]);
  
  // Toggle advanced filter sidebar
  const toggleAdvancedFilter = () => {
    setShowAdvancedFilter(!showAdvancedFilter);
  };
  
  // Toggle action menu
  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };
  
  // Handle ban user
  const handleBanUser = (id) => {
    setBannedUsers({
      ...bannedUsers,
      [id]: !bannedUsers[id]
    });
    setActiveMenu(null);
  };
  
  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
    setActiveMenu(null);
  };
  
  // Close user detail modal
  const closeUserDetail = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };
  
  // Handle pagination size change
  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle edit user button click
  const handleEditUser = (user) => {
    setEditedUser({...user});
    setShowEditModal(true);
    setActiveMenu(null);
  };

  // Handle edit input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save edited user
  const handleSaveUser = () => {
    setMembers(members.map(member => 
      member.id === editedUser.id ? editedUser : member
    ));
    setShowEditModal(false);
    setEditedUser(null);
    
    if (showUserDetail && selectedUser?.id === editedUser.id) {
      setSelectedUser(editedUser);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditedUser(null);
  };
  
  return (
    <Layout activeItem="members">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative">
        {/* CSS Test Box */}
        <div className="bg-red-500 p-4 mb-6 text-white font-medium rounded-lg">
          Nếu bạn thấy hộp đỏ này, CSS đã hoạt động!
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Members</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header Controls - Responsive */}
          <div className="p-3 sm:p-4 border-b space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            {/* Search and Filters */}
            <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
              {/* Search input */}
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search members..." 
                  className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchTerm}
                  onChange={handleSearch} 
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
                    value={statusFilter}
                    onChange={handleStatusFilter}
                  >
                    <option value="All">All Status</option>
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
                    value={roleFilter}
                    onChange={handleRoleFilter}
                  >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Member">Member</option>
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
                onClick={toggleAdvancedFilter}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                <span className="hidden sm:inline">Advanced Filter</span>
                <span className="sm:hidden">Filter</span>
              </button>
            </div>
            
            {/* Add member button */}
            <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium text-blue-600 ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                            {member.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                        {member.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : member.role === 'Moderator'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center">
                        <div className="relative">
                          <button 
                            onClick={() => toggleMenu(member.id)} 
                            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                          </button>
                          
                          {activeMenu === member.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                              <div className="py-1">
                                <button 
                                  onClick={() => handleViewUser(member)} 
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <FontAwesomeIcon icon={faEye} className="mr-3 h-4 w-4" />
                                  View Details
                                </button>
                                <button 
                                  onClick={() => handleEditUser(member)} 
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <FontAwesomeIcon icon={faEdit} className="mr-3 h-4 w-4" />
                                  Edit User
                                </button>
                                <button 
                                  onClick={() => handleBanUser(member.id)} 
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <FontAwesomeIcon icon={faBan} className="mr-3 h-4 w-4" />
                                  {bannedUsers[member.id] ? 'Unban' : 'Ban'} User
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="block lg:hidden">
            <div className="divide-y divide-gray-200">
              {currentMembers.map(member => (
                <div key={member.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400 h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium text-blue-600 truncate ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                          {member.name}
                        </div>
                        <div className={`text-sm text-gray-500 truncate ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                          {member.email}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {member.department}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div className="relative flex-shrink-0 ml-2">
                      <button 
                        onClick={() => toggleMenu(member.id)} 
                        className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                      </button>
                      
                      {activeMenu === member.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                          <div className="py-1">
                            <button 
                              onClick={() => handleViewUser(member)} 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FontAwesomeIcon icon={faEye} className="mr-3 h-4 w-4" />
                              View Details
                            </button>
                            <button 
                              onClick={() => handleEditUser(member)} 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-3 h-4 w-4" />
                              Edit User
                            </button>
                            <button 
                              onClick={() => handleBanUser(member.id)} 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <FontAwesomeIcon icon={faBan} className="mr-3 h-4 w-4" />
                              {bannedUsers[member.id] ? 'Unban' : 'Ban'} User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="mt-3 flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      member.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : member.role === 'Moderator'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {member.role}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* No results message */}
          {currentMembers.length === 0 && (
            <div className="text-center py-8 sm:py-10">
              <div className="text-gray-400 text-4xl sm:text-5xl mb-3">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <p className="text-gray-500 text-base sm:text-lg">No members match your search criteria</p>
            </div>
          )}
          
          {/* Responsive Pagination */}
          <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 border-t border-gray-200">
            {/* Mobile Pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                    : 'text-gray-700 hover:bg-gray-50 bg-white'
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <span className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                    : 'text-gray-700 hover:bg-gray-50 bg-white'
                }`}
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredMembers.length)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{filteredMembers.length}</span>
                  {' '}results
                </p>
                
                {/* Items per page selector */}
                <div className="flex items-center space-x-2 ml-4">
                  <label className="text-sm text-gray-700">Per page:</label>
                  <select 
                    value={itemsPerPage} 
                    onChange={handlePageSizeChange}
                    className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                </button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 2 && page <= currentPage + 2) return true;
                      return false;
                    })
                    .map((page, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => paginate(page)}
                            className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>
                
                <button 
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                      : 'text-gray-700 hover:bg-gray-50 bg-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Filter Sidebar - Responsive */}
        {showAdvancedFilter && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={toggleAdvancedFilter}
            />
            
            {/* Sidebar */}
            <div className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl flex flex-col">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Advanced Filters</h2>
                  <button onClick={toggleAdvancedFilter} className="text-gray-500 hover:text-gray-700 p-1">
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Date range filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Date Range</h3>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          id="start-date"
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">End Date</label>
                        <input
                          type="date"
                          id="end-date"
                          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          value={endDate}
                          onChange={handleEndDateChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Role filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Roles</h3>
                    <div className="space-y-2">
                      {['All', 'Admin', 'Moderator', 'Member'].map(role => (
                        <div key={role} className="flex items-center">
                          <input 
                            type="radio" 
                            id={`role-${role.toLowerCase()}`}
                            name="role" 
                            value={role} 
                            checked={roleFilter === role}
                            onChange={() => setRoleFilter(role)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`role-${role.toLowerCase()}`} className="ml-2 block text-sm text-gray-700">
                            {role === 'All' ? 'All Roles' : role}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Status</h3>
                    <div className="space-y-2">
                      {['All', 'Active', 'Inactive'].map(status => (
                        <div key={status} className="flex items-center">
                          <input 
                            type="radio" 
                            id={`status-${status.toLowerCase()}`}
                            name="status" 
                            value={status} 
                            checked={statusFilter === status}
                            onChange={() => setStatusFilter(status)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`status-${status.toLowerCase()}`} className="ml-2 block text-sm text-gray-700">
                            {status === 'All' ? 'All Status' : status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="p-4 sm:p-6 border-t border-gray-200 space-y-3">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setRoleFilter('All');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear All Filters
                </button>
                <button 
                  onClick={toggleAdvancedFilter}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Members;
