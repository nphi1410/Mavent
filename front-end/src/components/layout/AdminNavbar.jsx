import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import { DropdownMenu, DropdownMenuItem } from '../ui/DropdownMenu';
import { Button } from '../ui/Button';

const AdminNavbar = () => {
  return (
    <div className="bg-white shadow-sm py-3 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">EventAdmin</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faMessage} className="w-5 h-5" />
        </Button>
        
        <DropdownMenu
          trigger={
            <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              </div>
            </Button>
          }
        >
          <DropdownMenuItem onClick={() => console.log('Profile clicked')}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Settings clicked')}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Logout clicked')}>Logout</DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminNavbar;
