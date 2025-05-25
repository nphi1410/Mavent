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
  const [isEditing, setIsEditing] = useState(false);
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

  // Handler for applying filters
  const applyFilters = () => {
    // Filters are already applied reactively
    toggleAdvancedFilter();
  };

  // Handler for resetting filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setRoleFilter('All');
    setStartDate('');
    setEndDate('');
    toggleAdvancedFilter();
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
    setCurrentPage(1); // Reset to first page when changing page size
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
    
    // If user detail modal is open, update the selected user
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
      <div className="container mx-auto px-4 relative">
        {/* CSS Test Box */}
        <div className="bg-red-500 p-4 mb-6 text-white font-medium">
          Nếu bạn thấy hộp đỏ này, CSS đã hoạt động!
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Manage Members</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center mb-2 sm:mb-0 space-x-2">
              {/* Search input */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search members..." 
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearch} 
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="text-gray-400 absolute right-3 top-2.5" 
                />
              </div>
              
              {/* Status filter dropdown */}
              <div className="relative">
                <select 
                  className="border rounded-lg px-3 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={handleStatusFilter}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className="text-gray-400 absolute right-2 top-2.5" 
                />
              </div>
              
              {/* Role filter dropdown */}
              <div className="relative">
                <select 
                  className="border rounded-lg px-3 py-2 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="text-gray-400 absolute right-2 top-2.5" 
                />
              </div>
              
              {/* Advanced filter button */}
              <button 
                className="border rounded-lg px-3 py-2 flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={toggleAdvancedFilter}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Advanced Filter
              </button>
            </div>
            
            {/* Add member button */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Member
            </button>
          </div>
          
          {/* Members table */}
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
                      {/* Action menu button */}
                      <div className="relative">
                        <button 
                          onClick={() => toggleMenu(member.id)} 
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                        </button>
                        
                        {/* Action menu */}
                        {activeMenu === member.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                            <div className="py-1">
                              <button 
                                onClick={() => handleViewUser(member)} 
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-3 h-5 w-5" />
                                View Details
                              </button>
                              <button 
                                onClick={() => handleEditUser(member)} 
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-3 h-5 w-5" />
                                Edit User
                              </button>
                              <button 
                                onClick={() => handleBanUser(member.id)} 
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FontAwesomeIcon icon={faBan} className="mr-3 h-5 w-5" />
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
          
          {/* No results message */}
          {currentMembers.length === 0 && (
            <div className="text-center py-10">
              <FontAwesomeIcon icon="search" className="text-gray-400 text-5xl mb-3" />
              <p className="text-gray-500 text-lg">No members match your search criteria</p>
            </div>
          )}
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button 
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                disabled={currentPage === totalPages || totalPages === 0}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages || totalPages === 0
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredMembers.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > filteredMembers.length ? filteredMembers.length : indexOfLastItem}
                  </span> of{' '}
                  <span className="font-medium">{filteredMembers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {/* Previous button */}
                  <button 
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === number
                          ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  {/* Next button */}
                  <button 
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages || totalPages === 0
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Filter Sidebar */}
        <div 
          className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform ${
            showAdvancedFilter ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-30`}
        >
          <div className="h-full flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Advanced Filters</h2>
              <button onClick={toggleAdvancedFilter} className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Date range filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Date Range</h3>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      id="start-date"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      id="end-date"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Role filter checkboxes */}
              <div>
                <h3 className="text-sm font-medium mb-3">Roles</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="role-all" 
                      name="role" 
                      value="All" 
                      checked={roleFilter === 'All'}
                      onChange={() => setRoleFilter('All')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="role-all" className="ml-2 block text-sm text-gray-700">All Roles</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="role-admin" 
                      name="role" 
                      value="Admin" 
                      checked={roleFilter === 'Admin'}
                      onChange={() => setRoleFilter('Admin')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-700">Admin</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="role-moderator" 
                      name="role" 
                      value="Moderator" 
                      checked={roleFilter === 'Moderator'}
                      onChange={() => setRoleFilter('Moderator')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="role-moderator" className="ml-2 block text-sm text-gray-700">Moderator</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="role-member" 
                      name="role" 
                      value="Member" 
                      checked={roleFilter === 'Member'}
                      onChange={() => setRoleFilter('Member')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="role-member" className="ml-2 block text-sm text-gray-700">Member</label>
                  </div>
                </div>
              </div>
              
              {/* Status filter checkboxes */}
              <div>
                <h3 className="text-sm font-medium mb-3">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="status-all" 
                      name="status" 
                      value="All" 
                      checked={statusFilter === 'All'}
                      onChange={() => setStatusFilter('All')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="status-all" className="ml-2 block text-sm text-gray-700">All Status</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="status-active" 
                      name="status" 
                      value="Active" 
                      checked={statusFilter === 'Active'}
                      onChange={() => setStatusFilter('Active')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">Active</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="status-inactive" 
                      name="status" 
                      value="Inactive" 
                      checked={statusFilter === 'Inactive'}
                      onChange={() => setStatusFilter('Inactive')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">Inactive</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <button 
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button 
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg mt-3 hover:bg-gray-200"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Overlay when sidebar is open */}
        {showAdvancedFilter && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-20"
            onClick={toggleAdvancedFilter}
          ></div>
        )}
        
        {/* User Detail Modal */}
        {showUserDetail && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeUserDetail}></div>
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold mb-4">User Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <div className={`text-sm text-gray-900 ${bannedUsers[selectedUser.id] ? 'line-through text-red-500' : ''}`}>
                      {selectedUser.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <div className={`text-sm text-gray-900 ${bannedUsers[selectedUser.id] ? 'line-through text-red-500' : ''}`}>
                      {selectedUser.email}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Role:</span>
                    <div className="text-sm text-gray-900">{selectedUser.role}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <div className="text-sm text-gray-900">{selectedUser.status}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date Joined:</span>
                    <div className="text-sm text-gray-900">{selectedUser.joined}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Department:</span>
                    <div className="text-sm text-gray-900">{selectedUser.department}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <div className="text-sm text-gray-900">
                      {bannedUsers[selectedUser.id] ? 
                        <span className="text-red-500 font-medium">Banned</span> : 
                        <span className="text-green-500 font-medium">Active</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 flex space-x-3">
                <button 
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    handleEditUser(selectedUser);
                    closeUserDetail();
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit User
                </button>
                <button 
                  className={`flex-1 ${
                    bannedUsers[selectedUser.id] 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white px-4 py-2 rounded-lg`}
                  onClick={() => {
                    // Ban/Unban user action
                    handleBanUser(selectedUser.id);
                    closeUserDetail();
                  }}
                >
                  <FontAwesomeIcon icon={bannedUsers[selectedUser.id] ? faUser : faBan} className="mr-2" />
                  {bannedUsers[selectedUser.id] ? 'Unban User' : 'Ban User'}
                </button>
                <button 
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  onClick={closeUserDetail}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit User Modal */}
        {showEditModal && editedUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCancelEdit}></div>
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                <form className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editedUser.name}
                      onChange={handleEditInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleEditInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                    <select
                      id="role"
                      name="role"
                      value={editedUser.role}
                      onChange={handleEditInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                    <select
                      id="status"
                      name="status"
                      value={editedUser.status}
                      onChange={handleEditInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                    <select
                      id="department"
                      name="department"
                      value={editedUser.department}
                      onChange={handleEditInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Marketing">Marketing</option>
                      <option value="HR">HR</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="joined" className="block text-sm font-medium text-gray-700 mb-1">Date Joined:</label>
                    <input
                      type="text"
                      id="joined"
                      name="joined"
                      value={editedUser.joined}
                      onChange={handleEditInputChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </div>
              <div className="p-6 flex space-x-3">
                <button 
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleSaveUser}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save Changes
                </button>
                <button 
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  onClick={handleCancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancel
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
