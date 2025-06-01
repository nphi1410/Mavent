import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faBan, faUser, faTimes
} from '@fortawesome/free-solid-svg-icons';

const MemberDetailModal = ({
  isOpen,
  user,
  isBanned,
  onClose,
  onEdit,
  onBan
}) => {
  // console.log('MemberDetailModal render with props:', { 
  //   isOpen, 
  //   user: user ? `${user.name} (ID: ${user.id})` : null, 
  //   isBanned 
  // });
  
  // Add a rendering flag for debugging
  React.useEffect(() => {
    if (isOpen && user) {
      // console.log(`Modal should be visible now for user: ${user.name}`);
    }
  }, [isOpen, user]);
  
  // Return a debug placeholder if the modal shouldn't be open
  if (!isOpen || !user) {
    // console.log('MemberDetailModal not rendered: isOpen=', isOpen, 'user=', user ? 'exists' : 'null');
    // For debugging: return a hidden placeholder to confirm the component is mounting
    return <div style={{display: 'none'}}>Modal would render here if isOpen={String(isOpen)} and user exists={String(!!user)}</div>;
  }  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]" data-testid="member-detail-modal">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={(e) => {
        e.stopPropagation();
        // console.log("Modal backdrop clicked - closing modal");
        onClose();
      }}></div>
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative overflow-hidden" 
           style={{zIndex: 10000}}
           onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">User Details</h2>
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center px-6 pt-6 pb-3">
          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={`${user.name}'s avatar`} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="h-full w-full flex items-center justify-center"><svg class="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
                }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="text-gray-400 h-10 w-10" />
            )}
          </div>
          <div className="ml-4">
            <h3 className={`text-xl font-semibold ${isBanned ? 'line-through text-red-500' : ''}`}>{user.name}</h3>
            <p className="text-gray-500">{user.role} • {user.department}</p>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <div className={`text-sm text-gray-900 ${isBanned ? 'line-through text-red-500' : ''}`}>
                {user.name}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <div className={`text-sm text-gray-900 ${isBanned ? 'line-through text-red-500' : ''}`}>
                {user.email}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Student ID:</span>
              <div className="text-sm text-gray-900">{user.studentId || 'N/A'}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Gender:</span>
              <div className="text-sm text-gray-900">{user.gender || 'N/A'}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
              <div className="text-sm text-gray-900">{user.dateOfBirth || 'N/A'}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <div className="text-sm text-gray-900">{user.role}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Department:</span>
              <div className="text-sm text-gray-900">{user.department}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Date Joined:</span>
              <div className="text-sm text-gray-900">{user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="text-sm text-gray-900">
                {isBanned ? 
                  <span className="text-red-500 font-medium">Banned</span> : 
                  <span className="text-green-500 font-medium">Active</span>
                }
              </div>
            </div>
          </div>
        </div>        <div className="p-6 flex space-x-3 bg-gray-50">
          <button 
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            onClick={() => {
              // console.log('Edit button clicked in MemberDetailModal for user:', user.name);
              onEdit(user);
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit User
          </button>
          <button 
            className={`flex-1 ${
              isBanned 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center`}
            onClick={() => {
              // console.log('Ban/Unban button clicked in MemberDetailModal for user:', user.name, 'current banned status:', isBanned);
              onBan(user, !isBanned);
              onClose();
            }}
          >
            <FontAwesomeIcon icon={isBanned ? faUser : faBan} className="mr-2" />
            {isBanned ? 'Unban User' : 'Ban User'}
          </button>
          <button 
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
