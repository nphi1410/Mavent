import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEdit, faBan, faEye, faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const MemberCard = ({
  members,
  bannedUsers,
  activeMenu,
  onToggleMenu,
  onViewUser,
  onEditUser,
  onBanUser
}) => {
  
  return (
    <div className="block lg:hidden">
      <div className="divide-y divide-gray-200">
        {members.map(member => (
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
                  onClick={() => onToggleMenu(member.id)} 
                  className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                </button>
                
                {/* Action menu */}
                {activeMenu === member.id && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border"
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => onViewUser(member)} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-3 h-4 w-4" />
                        View Details
                      </button>
                      <button 
                        onClick={() => onEditUser(member)} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-3 h-4 w-4" />
                        Edit User
                      </button>
                      <button 
                        onClick={() => onBanUser(member, !bannedUsers[member.id])} 
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
  );
};

export default MemberCard;
