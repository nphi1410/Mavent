import React from 'react';
import SideBar from '../components/SideBar';
import ProfileContent from '../components/ProfileContent';
import Header from '../components/Header';

const ProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100">
      <Header/>
      <div className="flex flex-grow w-full">
        <SideBar/>
        <ProfileContent/>
      </div>
    </div>
  );
};

export default ProfilePage;

