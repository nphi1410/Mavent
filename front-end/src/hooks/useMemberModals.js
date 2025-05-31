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
  }, [activeMenu]); // Re-attach when activeMenu changes

  // Open view detail modal
  const openUserDetailModal = useCallback((user) => {
    setSelectedUser(user);
    setSelectedMember(user);
    setShowUserDetail(true);
    setIsDetailModalOpen(true);
    setActiveMenu(null); // Close any open menus
  }, []);

  // Close view detail modal
  const closeUserDetailModal = useCallback(() => {
    setShowUserDetail(false);
    setIsDetailModalOpen(false);
    setSelectedUser(null);
    setSelectedMember(null);
  }, []);

  // Open edit modal
  const openEditModal = useCallback((user) => {
    setEditedUser(user);
    setSelectedMember(user);
    setShowEditModal(true);
    setIsEditModalOpen(true);
    setActiveMenu(null); // Close any open menus
  }, []);

  // Close edit modal
  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setIsEditModalOpen(false);
    setEditedUser(null);
    setSelectedMember(null);
  }, []);

  // Handle edit input changes
  const handleEditInputChange = useCallback((field, value, availableDepartments = []) => {
    console.log(`Edit input change: ${field} = "${value}"`, availableDepartments);
    
    setEditedUser(prev => {
      // When changing department, try to find the department ID as well
      if (field === 'department' && availableDepartments && availableDepartments.length > 0) {
        console.log(`Looking for department match for: "${value}" among ${availableDepartments.length} departments`);
        console.log('Available departments:', availableDepartments);
        
        // Strategy 1: Look for exact case-insensitive match
        const exactMatch = availableDepartments.find(dept => 
          dept.name.toLowerCase().trim() === value.toLowerCase().trim()
        );
        
        if (exactMatch) {
          console.log(`Found exact department match: ${exactMatch.name} (ID: ${exactMatch.departmentId})`);
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
          console.log(`Found partial department match: ${partialMatch.name} (ID: ${partialMatch.departmentId})`);
          return {
            ...prev,
            [field]: value,
            departmentId: partialMatch.departmentId,
            departmentName: partialMatch.name // Store normalized name for backend
          };
        }
        
        console.log('No department match found');
      } else if (field === 'status') {
        console.log(`Status changed to: ${value}`);
        console.log(`Setting isActive to: ${value === 'Active'}`);
        
        return {
          ...prev,
          status: value,
          isActive: value === 'Active' // Explicitly set isActive based on status
        };
      } else if (field === 'isActive') {
        console.log(`isActive explicitly set to: ${value}`);
        
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
