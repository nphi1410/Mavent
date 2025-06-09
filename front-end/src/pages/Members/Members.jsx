import React from 'react';
import useMemberManagement from '../../hooks/useMemberManagement';
import useUserPermissions from '../../hooks/useUserPermissions';
import MemberFilters from '../../components/MemberFilters';
import MemberTable from '../../components/MemberTable';
import MemberCard from './MemberCard';
import Pagination from './Pagination';
import MemberDetailModal from '../../components/MemberDetailModal';
import EditMemberModal from '../../components/EditMemberModal';
import NoResults from './NoResults';
import Layout from '../../components/layout/AdminLayout';

const Members = () => {
  // Get user permissions for the current event
  const {
    userRole,
    loading: permissionsLoading,
    error: permissionsError,
    canEdit,
    canBan,
    canView,
    isAdminOrManager
  } = useUserPermissions();

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
            onAddMember={() => {/* console.log('Add member clicked') */}}
          />          {/* Desktop Table View */}
          <MemberTable
            members={currentMembers}
            bannedUsers={bannedUsers}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onBanUser={handleBanUser}
            canEdit={canEdit}
            canBan={canBan}
            canView={canView}
            userRole={userRole}
          />          {/* Mobile & Tablet Card View */}
          <MemberCard
            members={currentMembers}
            bannedUsers={bannedUsers}
            onViewUser={handleViewUser}
            onEditUser={handleEditUser}
            onBanUser={handleBanUser}
            canEdit={canEdit}
            canBan={canBan}
            canView={canView}
            userRole={userRole}
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
        </div>        {/* Member Detail Modal */}        <MemberDetailModal
          isOpen={!!showUserDetail} 
          user={selectedUser || null} 
          isBanned={selectedUser && selectedUser.id ? bannedUsers[selectedUser.id] || false : false}
          onClose={() => {
            // console.log("Close detail modal called from Members.jsx");
            closeUserDetail();
          }}
          onEdit={(user) => {
            // console.log("Edit user called from detail modal for:", user);
            handleEditUser(user);
          }}
          onBan={(user, banStatus) => {
            // console.log("Ban user called from detail modal:", user, banStatus);
            handleBanUser(user, banStatus);
          }}
          canEdit={canEdit}
          canBan={canBan}
          userRole={userRole}
        />
        
        {/* Edit Member Modal */}        <EditMemberModal
          isOpen={!!showEditModal}
          user={editedUser || null}
          departments={departments || []}
          onClose={() => {
            // console.log("Close edit modal called from Members.jsx");
            handleCancelEdit();
          }}
          onSave={() => {
            // console.log("Save user called from edit modal");
            handleSaveUser();
          }}
          onChange={(field, value, depts) => {
            // console.log(`Edit field change: ${field}=${value}`);
            handleEditInputChange(field, value, depts);
          }}
          canEdit={canEdit}
          userRole={userRole}
        />

        {/* Debug logging with useEffect */}
        <DebugModalStates
          showUserDetail={showUserDetail}
          showEditModal={showEditModal}
          selectedUser={selectedUser}
          editedUser={editedUser}        />
      </div>
    </Layout>
  );
};

// Helper component for debug logging
const DebugModalStates = ({ showUserDetail, showEditModal, selectedUser, editedUser }) => {
  React.useEffect(() => {
    // console.log('Members component modal states:', { 
    //   showUserDetail, 
    //   showEditModal,
    //   selectedUser: selectedUser ? `${selectedUser.name} (ID: ${selectedUser.id})` : null,
    //   editedUser: editedUser ? `${editedUser.name} (ID: ${editedUser.id})` : null
    // });
  }, [showUserDetail, showEditModal, selectedUser, editedUser]);
  
  return null;
};

export default Members;
