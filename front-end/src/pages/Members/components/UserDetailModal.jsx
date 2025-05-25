import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, faBan, faUser, faTimes
} from '@fortawesome/free-solid-svg-icons';

const UserDetailModal = ({
  isOpen,
  user,
  isBanned,
  onClose,
  onEdit,
  onBan
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl relative">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
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
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <div className="text-sm text-gray-900">{user.role}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="text-sm text-gray-900">{user.status}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Date Joined:</span>
              <div className="text-sm text-gray-900">{user.joined}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Department:</span>
              <div className="text-sm text-gray-900">{user.department}</div>
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
        </div>
        <div className="p-6 flex space-x-3">
          <button 
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => {
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
            } text-white px-4 py-2 rounded-lg`}
            onClick={() => {
              onBan(user, !isBanned);
              onClose();
            }}
          >
            <FontAwesomeIcon icon={isBanned ? faUser : faBan} className="mr-2" />
            {isBanned ? 'Unban User' : 'Ban User'}
          </button>
          <button 
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
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

export default UserDetailModal;
