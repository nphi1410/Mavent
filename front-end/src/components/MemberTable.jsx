import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEdit, faBan, faEye
} from '@fortawesome/free-solid-svg-icons';

const MemberTable = ({
  members,
  bannedUsers,
  onViewUser,
  onEditUser,
  onBanUser
}) => {
  const tableRef = useRef(null);
  
  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Department</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                {/* Name cell */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        // console.log("Avatar clicked - opening view modal for:", member.name);
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
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div 
                        className={`text-sm font-medium text-blue-600 truncate cursor-pointer ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // console.log("Name clicked - opening view modal for:", member.name);
                          onViewUser(member);
                        }}
                        title={member.name}
                      >
                        {member.name}
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Email cell */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className={`truncate ${bannedUsers[member.id] ? 'line-through text-red-500' : ''}`} title={member.email}>
                    {member.email}
                  </div>
                </td>
                
                {/* Role cell */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
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
                     member.role === 'DEPARTMENT_MANAGER' ? 'Dept Manager' : 
                     member.role === 'MEMBER' ? 'Member' :
                     member.role === 'PARTICIPANT' ? 'Participant' :
                     member.role === 'GUEST' ? 'Guest' :
                     member.role}
                  </span>
                </td>
                
                {/* Status cell */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                
                {/* Department cell */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {member.department && member.department !== 'N/A' ? (
                    <div className="truncate" title={member.department}>
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {member.department}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                
                {/* Actions cell */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // console.log("Direct view button clicked for:", member.name);
                        onViewUser(member);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // console.log("Direct edit button clicked for:", member.name);
                        onEditUser(member);
                      }}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                      title="Edit Member"
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // console.log("Direct ban/unban button clicked for:", member.name);
                        onBanUser(member, !bannedUsers[member.id]);
                      }}
                      className={`p-1 transition-colors duration-200 ${bannedUsers[member.id] ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                      title={bannedUsers[member.id] ? 'Unban Member' : 'Ban Member'}
                    >
                      <FontAwesomeIcon icon={faBan} className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
