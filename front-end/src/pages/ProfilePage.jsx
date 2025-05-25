import React from 'react';
import Sidebar from '../components/SidebarSettings';
import ProfileContent from '../components/ProfileContent';
import Header from '../components/common/Header';

const ProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100">
      <Header/>
      <div className="flex flex-grow w-full">
        <Sidebar/>
        <ProfileContent/>
      </div>
    </div>
  );
};

export default ProfilePage;

