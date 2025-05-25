import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEdit, faBan, faEye, faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

const MemberTable = ({
  members,
  bannedUsers,
  activeMenu,
  onToggleMenu,
  onViewUser,
  onEditUser,
  onBanUser
}) => {
  return (
    <div className="hidden lg:block">
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
          {members.map(member => (
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
                      onClick={() => onToggleMenu(member.id)} 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} className="h-5 w-5" />
                    </button>
                    
                    {/* Action menu */}
                    {activeMenu === member.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
