import React from 'react';
import UserEventsContent from '../components/usercenter/UserEventsContent';
import Sidebar from '../components/usercenter/SidebarSettings';
import Header from '../components/common/Header';

const UserEventsPage = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
    <div className="flex h-full w-full bg-gray-100">
      <Sidebar />
      <UserEventsContent />
    </div>
    </div>
  );
};

export default UserEventsPage;