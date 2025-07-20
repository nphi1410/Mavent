import React, { useState } from 'react';
import useMemberManagement from '../../hooks/useMemberManagement';
import useUserPermissions from '../../hooks/useUserPermissions';
import MemberFilters from '../../components/filter/MemberFilters';
import MemberTable from '../../components/member/MemberTable';
import MemberCard from '../../components/member/MemberCard';
import Pagination from '../../components/member/Pagination';
import NoResults from '../../components/member/NoResults';
import MemberDetailModal from '../../components/member/MemberDetailModal';
import EditMemberModal from '../../components/member/EditMemberModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/visual/LoadingSpinner';
import ActionLoadingButton from '../../components/visual/ActionLoadingButton';

const Members = () => {
  // State for bulk actions
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // For debugging - log when the component mounts
  React.useEffect(() => {
    console.log("Members component mounted");
    // Clear any localStorage or sessionStorage values that might be causing issues
    // sessionStorage.removeItem('editUserModal');
    // localStorage.removeItem('editUserModal');
  }, []);

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
    departmentsLoading,

    // Action loading states
    isActionLoading,
    actionType,
    actionTargetId,

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
    handleCancelEdit,
    handleBulkBanUsers
  } = useMemberManagement();

  // Function to show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
  };

  // Handlers for bulk actions
  const handleSelectMember = (memberId, event) => {
    if (event.nativeEvent.shiftKey && selectedMembers.length > 0) {
      // For shift+click selection
      const memberIds = currentMembers.map(m => m.id);
      const lastSelectedIndex = memberIds.indexOf(selectedMembers[selectedMembers.length - 1]);
      const currentIndex = memberIds.indexOf(memberId);

      if (lastSelectedIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        const rangeToSelect = memberIds.slice(start, end + 1);

        // Add all in the range to selected
        setSelectedMembers(prev => {
          const newSelected = [...new Set([...prev, ...rangeToSelect])];
          return newSelected;
        });

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
      setSelectedMembers(currentMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const areAllSelected = currentMembers.length > 0 &&
    currentMembers.every(member => selectedMembers.includes(member.id));
  // Replace local function with an action that calls the hook function
  const performBulkBanAction = async () => {
    setIsConfirmDialogOpen(false);
    if (selectedMembers.length === 0) return;

    try {
      // No need to set loading state here as it's handled in handleBulkBanUsers
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
  // UI for bulk actions
  const renderBulkActionsBar = () => {
    if (selectedMembers.length === 0) return null;

    const isBulkBanLoading = isActionLoading && actionType === 'bulkBan';

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 px-4 z-10 flex justify-between items-center">
        <div>
          <span className="font-medium">{selectedMembers.length}</span> {selectedMembers.length === 1 ? 'member' : 'members'} selected
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMembers([])}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            disabled={isBulkBanLoading}
          >
            Cancel
          </button>
          <ActionLoadingButton
            isLoading={isBulkBanLoading}
            onClick={() => setIsConfirmDialogOpen(true)}
            variant="danger"
            loadingText="Processing..."
            className="flex items-center"
            disabled={isBulkBanLoading}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1.5" />
            Ban Selected
          </ActionLoadingButton>
        </div>
      </div>
    );
  };

  // Debug info - log modal states before rendering
  React.useEffect(() => {
    console.log("Modal states before rendering:", {
      showEditModal,
      editedUser: editedUser ? `${editedUser.name || 'Unknown'} (ID: ${editedUser.id || 'Unknown'})` : null
    });
    
    // If modal is unexpectedly open on load, close it
    if (showEditModal && !editedUser) {
      console.warn("Modal is open with no edited user - this might be an error state");
      // Consider uncommenting this line if modal is always open on load unexpectedly
      // handleCancelEdit();
    }
  }, [showEditModal, editedUser]);

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
          departmentsLoading={departmentsLoading}
          onSearchChange={handleSearch}
          onStatusFilterChange={(value) => handleStatusFilter(value === '' ? '' : value)}
          onRoleFilterChange={(value) => handleRoleFilter(value === '' ? '' : value)}
          onDepartmentFilterChange={(value) => handleDepartmentFilter(value === '' ? '' : value)}
          onAddMember={() => {/* console.log('Add member clicked') */ }}
        />
        {/* Bulk action menu when members are selected */}
        {selectedMembers.length > 0 && (
          <div className="bg-blue-50 border-y border-blue-200 px-4 py-2 flex items-center justify-between">
            <div>
              <span className="font-medium">{selectedMembers.length}</span> {selectedMembers.length === 1 ? 'member' : 'members'} selected
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

        {/* Desktop Table View */}          <MemberTable
          members={currentMembers || []}
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
        />{/* Mobile & Tablet Card View */}          <MemberCard
          members={currentMembers || []}
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
        isOpen={showEditModal === true}
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
        editedUser={editedUser} />
      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Ban Selected Members</h3>
            <p className="mb-6">Are you sure you want to ban {selectedMembers.length} member(s)? This action can be undone later.</p>
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
        <div className={`fixed bottom-20 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center
            ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
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
