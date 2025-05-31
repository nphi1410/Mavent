import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEdit, faBan, faEye, faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';

const MemberTable = ({
  members,
  bannedUsers,
  activeMenu,
  onToggleMenu,
  onViewUser,
  onEditUser,
  onBanUser
}) => {
  // Track which menus should open upward
  const [menuDirections, setMenuDirections] = useState({});
  const [menuPositions, setMenuPositions] = useState({});
  const menuButtonRefs = useRef({});
  const tableRef = useRef(null);
  
  // Check menu position when active menu changes
  useEffect(() => {
    if (activeMenu) {
      const buttonElement = menuButtonRefs.current[activeMenu];
      if (buttonElement && tableRef.current) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const tableRect = tableRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Space available below and above the button
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        
        // Menu height (approximate) - adjust based on your actual menu height
        const menuHeight = 150; 
        
        // Determine if menu should open upward
        const shouldOpenUpward = spaceBelow < menuHeight && spaceAbove > menuHeight;
        
        // Calculate position for the menu
        const position = {
          left: buttonRect.left - 160 + buttonRect.width, // Align right edge of menu with button (plus some offset)
          top: shouldOpenUpward ? buttonRect.top - menuHeight : buttonRect.bottom + 5,
        };
        
        setMenuDirections(prev => ({
          ...prev,
          [activeMenu]: shouldOpenUpward
        }));
        
        setMenuPositions(prev => ({
          ...prev,
          [activeMenu]: position
        }));
      }
    }
  }, [activeMenu]);
  
  // Menu component to be rendered in portal
  const MenuPortal = ({ member }) => {
    if (!activeMenu || activeMenu !== member.id) return null;
    
    const position = menuPositions[member.id] || { top: 0, left: 0 };
    
    return createPortal(
      <div 
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 9999,
        }}
        className="w-48 bg-white rounded-lg shadow-lg border"
      >
        <div className="py-1">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewUser(member);
            }} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <FontAwesomeIcon icon={faEye} className="mr-3 h-4 w-4" />
            View Details
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditUser(member);
            }} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-3 h-4 w-4" />
            Edit Member
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBanUser(member, !bannedUsers[member.id]);
            }} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <FontAwesomeIcon icon={faBan} className="mr-3 h-4 w-4" />
            {bannedUsers[member.id] ? 'Unban' : 'Ban'} Member
          </button>
        </div>
      </div>,
      document.body
    );
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu) {
        const isMenuButton = event.target.closest(`[data-menu-button="menu-button-${activeMenu}"]`);
        const isMenuContent = event.target.closest(`[data-menu="menu-${activeMenu}"]`);
        
        if (!isMenuButton && !isMenuContent) {
          onToggleMenu(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu, onToggleMenu]);
  
  return (
    <div className="hidden lg:block overflow-x-auto" ref={tableRef}>
      <table className="min-w-full table-fixed">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Department</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map(member => (
            <tr key={member.id} className="hover:bg-gray-50">
              {/* Name cell */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {member.avatarUrl ? (
                      <img 
                        src={member.avatarUrl} 
                        alt={`${member.name}'s avatar`} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="h-full w-full flex items-center justify-center"><svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                        }}
                      />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className={`text-sm font-medium text-blue-600 truncate max-w-[150px] ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                      {member.name}
                    </div>
                  </div>
                </div>
              </td>
              
              {/* Email cell */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`truncate block max-w-[150px] ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                  {member.email}
                </span>
              </td>
              
              {/* Role cell */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : member.role === 'DEPARTMENT_MANAGER'
                      ? 'bg-blue-100 text-blue-800'
                      : member.role === 'MEMBER'
                        ? 'bg-green-100 text-green-800'
                        : member.role === 'PARTICIPANT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.role === 'ADMIN' ? 'Admin' : 
                   member.role === 'DEPARTMENT_MANAGER' ? 'Department Manager' : 
                   member.role === 'MEMBER' ? 'Member' :
                   member.role === 'PARTICIPANT' ? 'Participant' :
                   member.role === 'GUEST' ? 'Guest' :
                   member.role}
                </span>
              </td>
              
              {/* Status cell */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </td>
              
              {/* Department cell */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {member.department && member.department !== 'N/A' ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100 truncate block max-w-[150px]">
                    {member.department}
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              
              {/* Actions cell */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white">
                <div className="flex justify-end items-center">
                  <div className="relative">
                    <button 
                      ref={el => menuButtonRefs.current[member.id] = el}
                      data-menu-button={`menu-button-${member.id}`}
                      onClick={() => onToggleMenu(member.id)} 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                    </button>
                    
                    {/* Portal-based menu that won't be clipped */}
                    <MenuPortal member={member} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;