import React from 'react';
import UserTasksContent from '../components/usercenter/UserTasksContent';
import Sidebar from '../components/usercenter/SidebarSettings';
import Header from '../components/common/Header';

const UserTasksPage = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
    <div className="flex h-full w-full bg-gray-100">
      
      <Sidebar />
      <UserTasksContent />
    </div>
    </div>
  );
};

export default UserTasksPage;