import { useState, useEffect, useCallback } from 'react';

/**
 * Hook để quản lý các UI state liên quan đến modal và menu.
 * Hook này tập trung vào việc quản lý trạng thái UI và các tương tác.
 */
const useMemberModals = () => {
  // UI states
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Modal states (alias cho tương thích)
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Toggle menu open/close
  const toggleMenu = useCallback((userId) => {
    // If userId is null, we're explicitly closing the menu
    // Otherwise toggle between the current menu and the requested one
    setActiveMenu(userId === null ? null : (activeMenu === userId ? null : userId));
  }, [activeMenu]);

  // Handle click outside to close active menu
  useEffect(() => {
    function handleClickOutside(event) {
      // Skip if no menu is active
      if (activeMenu === null) return;
      
      // Check if click was on menu elements
      const menuElements = document.querySelectorAll('[data-menu]');
      const ellipsisButtons = document.querySelectorAll('[data-menu-button]');
      
      // Check if the click was inside a menu or button
      let clickedInsideMenu = false;
      
      menuElements.forEach(menu => {
        if (menu && menu.contains(event.target)) {
          clickedInsideMenu = true;
        }
      });
      
      ellipsisButtons.forEach(button => {
        if (button && button.contains(event.target)) {
          clickedInsideMenu = true;
        }
      });
      
      // Close menu if clicked outside
      if (!clickedInsideMenu) {
        setActiveMenu(null);
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]); // Re-attach when activeMenu changes  // Open view detail modal
  const openUserDetailModal = useCallback((user) => {
    // console.log('openUserDetailModal called with user:', user);
      // Log previous states
    // console.log('Previous modal states:', {
    //   showUserDetail,
    //   isDetailModalOpen,
    //   selectedUser: selectedUser ? `${selectedUser.name} (ID: ${selectedUser.id})` : null
    // });
    
    // Update state in a predictable order
    setSelectedUser(user);
    setSelectedMember(user);
    
    // Force these to be true using direct values
    setShowUserDetail(true);
    setIsDetailModalOpen(true);
    
    setActiveMenu(null); // Close any open menus
    
    // Use setTimeout to verify state was updated
    setTimeout(() => {      // console.log('Modal states updated:', {
      //   showUserDetail,
      //   isDetailModalOpen,
      //   selectedUser: selectedUser ? `${selectedUser.name} (ID: ${selectedUser.id})` : null
      // });
    }, 0);
    
    // console.log('Modal states update triggered: showUserDetail=true, isDetailModalOpen=true');
  }, [showUserDetail, isDetailModalOpen, selectedUser]);
  // Close view detail modal
  const closeUserDetailModal = useCallback(() => {
    // console.log("closeUserDetailModal called - closing detail modal");
      // Log previous state
    // console.log("Previous modal state before closing:", {
    //   showUserDetail,
    //   isDetailModalOpen,
    //   selectedUser: selectedUser ? selectedUser.name : null
    // });
    
    // Reset all related state in a strict order
    setShowUserDetail(false);
    setIsDetailModalOpen(false);
    
    // Use setTimeout to ensure state updates happen in sequence
    setTimeout(() => {
      setSelectedUser(null);
      setSelectedMember(null);
      
      // Check if state was properly updated
      setTimeout(() => {        // console.log("Modal state after closing:", {
        //   showUserDetail,
        //   isDetailModalOpen,
        //   selectedUser
        // });
      }, 0);
    }, 0);
  }, [showUserDetail, isDetailModalOpen, selectedUser]);// Open edit modal
  const openEditModal = useCallback((user) => {
    // console.log('openEditModal called with user:', user);
      // Log previous states
    // console.log('Previous edit modal states:', {
    //   showEditModal,
    //   isEditModalOpen,
    //   editedUser: editedUser ? `${editedUser.name} (ID: ${editedUser.id})` : null
    // });
    
    // Update state in a predictable order
    setEditedUser(user);
    setSelectedMember(user);
    
    // Force these to be true using direct values
    setShowEditModal(true);
    setIsEditModalOpen(true);
    
    setActiveMenu(null); // Close any open menus
    
    // Use setTimeout to verify state was updated
    setTimeout(() => {      // console.log('Edit modal states updated:', {
      //   showEditModal,
      //   isEditModalOpen,
      //   editedUser: editedUser ? `${editedUser.name} (ID: ${editedUser.id})` : null
      // });
    }, 0);
    
    // console.log('Edit modal states update triggered: showEditModal=true, isEditModalOpen=true');
  }, [showEditModal, isEditModalOpen, editedUser]);
  // Close edit modal
  const closeEditModal = useCallback(() => {
    // console.log("closeEditModal called - closing edit modal");
      // Log previous state
    // console.log("Previous edit modal state before closing:", {
    //   showEditModal,
    //   isEditModalOpen, 
    //   editedUser: editedUser ? editedUser.name : null
    // });
    
    // Reset all related state in a strict order
    setShowEditModal(false);
    setIsEditModalOpen(false);
    
    // Use setTimeout to ensure state updates happen in sequence
    setTimeout(() => {
      setEditedUser(null);
      setSelectedMember(null);
      
      // Check if state was properly updated
      setTimeout(() => {        // console.log("Edit modal state after closing:", {
        //   showEditModal,
        //   isEditModalOpen,
        //   editedUser
        // });
      }, 0);
    }, 0);
  }, [showEditModal, isEditModalOpen, editedUser]);

  // Handle edit input changes
  const handleEditInputChange = useCallback((field, value, availableDepartments = []) => {
    // console.log(`Edit input change: ${field} = "${value}"`, availableDepartments);
    
    setEditedUser(prev => {
      // When changing department, try to find the department ID as well
      if (field === 'department' && availableDepartments && availableDepartments.length > 0) {
        // console.log(`Looking for department match for: "${value}" among ${availableDepartments.length} departments`);
        // console.log('Available departments:', availableDepartments);
        
        // Strategy 1: Look for exact case-insensitive match
        const exactMatch = availableDepartments.find(dept => 
          dept.name.toLowerCase().trim() === value.toLowerCase().trim()
        );
        
        if (exactMatch) {
          // console.log(`Found exact department match: ${exactMatch.name} (ID: ${exactMatch.departmentId})`);
          return {
            ...prev,
            [field]: value,
            departmentId: exactMatch.departmentId,
            departmentName: exactMatch.name // Store normalized name for backend
          };
        }
        
        // Strategy 2: Look for partial match (contains)
        const partialMatch = availableDepartments.find(dept => 
          dept.name.toLowerCase().includes(value.toLowerCase()) || 
          value.toLowerCase().includes(dept.name.toLowerCase())
        );
        
        if (partialMatch) {
          // console.log(`Found partial department match: ${partialMatch.name} (ID: ${partialMatch.departmentId})`);
          return {
            ...prev,
            [field]: value,
            departmentId: partialMatch.departmentId,
            departmentName: partialMatch.name // Store normalized name for backend
          };
        }
        
        // console.log('No department match found');
      } else if (field === 'status') {
        // console.log(`Status changed to: ${value}`);
        // console.log(`Setting isActive to: ${value === 'Active'}`);
        
        return {
          ...prev,
          status: value,
          isActive: value === 'Active' // Explicitly set isActive based on status
        };
      } else if (field === 'isActive') {
        // console.log(`isActive explicitly set to: ${value}`);
        
        return {
          ...prev,
          isActive: Boolean(value),
          status: Boolean(value) ? 'Active' : 'Inactive' // Keep status in sync with isActive
        };
      }
      
      // Default behavior for other fields
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  return {
    // UI states
    activeMenu,
    selectedUser,
    showUserDetail,
    editedUser,
    showEditModal,
    
    // Modal states
    selectedMember,
    isDetailModalOpen,
    isEditModalOpen,
    
    // Menu functions
    toggleMenu,
    
    // Modal functions
    openUserDetailModal,
    closeUserDetailModal,
    openEditModal,
    closeEditModal,
    handleEditInputChange,
    
    // Direct state setters (only for advanced use cases)
    setEditedUser
  };
};

// Export the hook as both named and default export
export { useMemberModals };
export default useMemberModals;
