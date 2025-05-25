import React from 'react';
import Sidebar from '../components/SidebarSettings';
import ProfileContent from '../components/ProfileContent';
import Header from '../components/common/Header';

const ProfilePage = () => {
  return (
      <div className="flex h-screen w-screen bg-gray-100">
        <Sidebar />
        
        <ProfileContent />
        
      </div>
    
  );
};

export default ProfilePage;

