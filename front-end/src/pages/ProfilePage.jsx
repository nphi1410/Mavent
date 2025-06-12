import React from "react";
import ProfileContent from "../components/usercenter/ProfileContent";
import Header from "../components/common/Header";

const ProfilePage = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
