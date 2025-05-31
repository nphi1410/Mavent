import React from 'react';
import useMemberManagement from '../../hooks/useMemberManagement';
import MemberFilters from '../../components/MemberFilters';
import MemberTable from '../../components/MemberTable';
import MemberCard from './MemberCard';
import Pagination from './Pagination';
import MemberDetailModal from '../../components/MemberDetailModal';
import EditMemberModal from '../../components/EditMemberModal';
import NoResults from './NoResults';

const Members = () => {
  const {
    // Data
    currentMembers,
    filteredMembers,
    bannedUsers,
    departments,
    totalElements,
    loading,
    
    // Search and filter state
    searchTerm,
    statusFilter,
    roleFilter,
    departmentFilter,
    
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
    handleDepartmentFilter,

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
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 relative">
      
      
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Manage Members</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header Controls - Responsive */}
          <MemberFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            departmentFilter={departmentFilter}
            departments={departments}
            onSearchChange={handleSearch}
            onStatusFilterChange={(value) => handleStatusFilter(value === '' ? '' : value)}
            onRoleFilterChange={(value) => handleRoleFilter(value === '' ? '' : value)}
            onDepartmentFilterChange={(value) => handleDepartmentFilter(value === '' ? '' : value)}
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
        
   
        {/* Member Detail Modal */}
        <MemberDetailModal
          isOpen={showUserDetail}
          user={selectedUser}
          isBanned={selectedUser ? bannedUsers[selectedUser.id] : false}
          onClose={closeUserDetail}
          onEdit={handleEditUser}
          onBan={handleBanUser}
        />
        
        {/* Edit Member Modal */}
        <EditMemberModal
          isOpen={showEditModal}
          user={editedUser}
          departments={departments}
          onClose={handleCancelEdit}
          onSave={handleSaveUser}
          onChange={handleEditInputChange}
        />
      </div>
  );
};

export default Members;
