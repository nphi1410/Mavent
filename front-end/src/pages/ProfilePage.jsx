import React from 'react';
import Sidebar from '../components/usercenter/SidebarSettings';
import ProfileContent from '../components/usercenter/ProfileContent';
import Header from '../components/common/Header';

const ProfilePage = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar />
        
        <ProfileContent />
        
      </div>
    </div>
  );
};

export default ProfilePage;

