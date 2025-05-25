import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Member Management System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-700 relative">
            <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            
            {/* Logout */}
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
