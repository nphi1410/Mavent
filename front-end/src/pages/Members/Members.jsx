import React from 'react';
import Layout from '../../components/layout/Layout';
import { useMemberManagement } from './hooks/useMemberManagement';
import MemberFilters from './components/MemberFilters';
import AdvancedFilterSidebar from './components/AdvancedFilterSidebar';
import MemberTable from './components/MemberTable';
import MemberCard from './components/MemberCard';
import Pagination from './components/Pagination';
import UserDetailModal from './components/UserDetailModal';
import EditUserModal from './components/EditUserModal';
import NoResults from './components/NoResults';

const Members = () => {
  const {
    // Data
    currentMembers,
    filteredMembers,
    bannedUsers,
    departments, // Add departments from the hook
    totalElements, // Add totalElements from API
    
    // Search and filter state
    searchTerm,
    statusFilter,
    roleFilter,
    startDate,
    endDate,
    showAdvancedFilter,
    
    // Pagination state
    currentPage,
    totalPages,
    itemsPerPage,
    
    // UI state
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
    handleCancelEdit
  } = useMemberManagement();
  
  return (
    <Layout activeItem="members">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative">
        {/* CSS Test Box
        <div className="bg-red-500 p-4 mb-6 text-white font-medium rounded-lg">
          Nếu bạn thấy hộp đỏ này, CSS đã hoạt động!
        </div> */}
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Members</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header Controls - Responsive */}
          <MemberFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            onSearchChange={handleSearch}
            onStatusFilterChange={(value) => handleStatusFilter(value === '' ? '' : value)}
            onRoleFilterChange={(value) => handleRoleFilter(value === '' ? '' : value)}
            onAdvancedFilterToggle={toggleAdvancedFilter}
            onAddMember={() => console.log('Add member clicked')}
          />
          
          {/* Desktop Table View */}
          <MemberTable
            members={currentMembers}
            bannedUsers={bannedUsers}
            activeMenu={activeMenu}
            onToggleMenu={toggleMenu}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onBanUser={handleBanUser}
          />

          {/* Mobile & Tablet Card View */}
          <MemberCard
            members={currentMembers}
            bannedUsers={bannedUsers}
            activeMenu={activeMenu}
            onToggleMenu={toggleMenu}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onBanUser={handleBanUser}
          />
          
          {/* No results message */}
          {currentMembers.length === 0 && <NoResults />}
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalElements}
            itemsPerPage={itemsPerPage}
            onPageChange={paginate}
          />
        </div>
        
        {/* Advanced Filter Sidebar */}
        <AdvancedFilterSidebar
          isOpen={showAdvancedFilter}
          startDate={startDate}
          endDate={endDate}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          onClose={toggleAdvancedFilter}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onStatusFilterChange={handleStatusFilter}
          onRoleFilterChange={handleRoleFilter}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />
        
        {/* User Detail Modal */}
        <UserDetailModal
          isOpen={showUserDetail}
          user={selectedUser}
          isBanned={selectedUser ? bannedUsers[selectedUser.id] : false}
          onClose={closeUserDetail}
          onEdit={handleEditUser}
          onBan={handleBanUser}
        />
        
        {/* Edit User Modal */}
        <EditUserModal
          isOpen={showEditModal}
          user={editedUser}
          departments={departments}
          onClose={handleCancelEdit}
          onSave={handleSaveUser}
          onChange={handleEditInputChange}
        />
      </div>
    </Layout>
  );
};

export default Members;
