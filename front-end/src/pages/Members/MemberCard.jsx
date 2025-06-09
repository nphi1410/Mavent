import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEdit, faBan, faEye, faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const MemberCard = ({
  members,
  bannedUsers,
  onViewUser,
  onEditUser,
  onBanUser,
  canEdit,
  canBan,
  canView,
  userRole
}) => {
  
  return (
    <div className="block lg:hidden">
      <div className="divide-y divide-gray-200">
        {members.map(member => (
          <div key={member.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">              {/* User Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div 
                  className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // console.log("Mobile - Avatar clicked for:", member.name);
                    onViewUser(member);
                  }}
                >
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
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div 
                    className={`text-sm font-medium text-blue-600 truncate cursor-pointer ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mobile - Name clicked for:", member.name);
                      onViewUser(member);
                    }}
                  >
                    {member.name}
                  </div>
                  <div className={`text-sm text-gray-500 truncate ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}>
                    {member.email}
                  </div>
                  <div className="mt-1 text-xs">
                    {member.department && member.department !== 'N/A' ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {member.department}
                      </span>
                    ) : (
                      <span className="text-gray-400">No Department</span>
                    )}
                  </div>
                </div>
              </div>              {/* Action buttons */}
              <div className="flex flex-shrink-0 ml-2 items-center">
                {/* View button - always visible if user has view permission */}
                {canView && canView(member.role) && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mobile - Direct view button clicked for:", member.name);
                      onViewUser(member);
                    }}
                    className="p-1 mr-2 text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                  </button>
                )}
                
                {/* Edit button - only visible if user has edit permission */}
                {canEdit && canEdit(member.role) && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mobile - Direct edit button clicked for:", member.name);
                      onEditUser(member);
                    }}
                    className="p-1 mr-2 text-green-600 hover:text-green-800"
                    title="Edit Member"
                  >
                    <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                  </button>
                )}
                
                {/* Ban/unban button - only visible if user has ban permission */}
                {canBan && canBan(member.role) && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Mobile - Direct ban/unban button clicked for:", member.name);
                      onBanUser(member, !bannedUsers[member.id]);
                    }}
                    className={`p-1 ${bannedUsers[member.id] ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                    title={bannedUsers[member.id] ? 'Unban User' : 'Ban User'}
                  >
                    <FontAwesomeIcon icon={faBan} className="h-5 w-5" />
                  </button>
                )}
                
                {/* Show message if no actions are available */}
                {(!canView || !canView(member.role)) && (!canEdit || !canEdit(member.role)) && (!canBan || !canBan(member.role)) && (
                  <span className="text-xs text-gray-400 px-2">No actions available</span>
                )}
              </div>
            </div>
            
            {/* Badges */}
            <div className="mt-3 flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                member.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : member.role === 'DEPARTMENT_MANAGER'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {member.role === 'ADMIN' ? 'Admin' : 
                 member.role === 'DEPARTMENT_MANAGER' ? 'Dept Manager' : 
                 'Member'}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {member.status}
              </span>
              <span className="px-2 py-1 text-xs text-gray-500">
                Joined: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberCard;
