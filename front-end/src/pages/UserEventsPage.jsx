import React from 'react';
import UserEventsContent from '../components/usercenter/UserEventsContent';
import Sidebar from '../components/usercenter/SidebarSettings';

const UserEventsPage = () => {
  return (
    <div className="flex h-full w-full bg-gray-100">
      <Sidebar />
      <UserEventsContent />
    </div>
  );
};

export default UserEventsPage;