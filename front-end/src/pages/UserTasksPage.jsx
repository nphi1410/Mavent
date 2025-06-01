import React from 'react';
import UserTasksContent from '../components/usercenter/UserTasksContent';
import Sidebar from '../components/usercenter/SidebarSettings';

const UserTasksPage = () => {
  return (
    <div className="flex h-full w-full bg-gray-100">
      
      <Sidebar />
      <UserTasksContent />
    </div>
  );
};

export default UserTasksPage;