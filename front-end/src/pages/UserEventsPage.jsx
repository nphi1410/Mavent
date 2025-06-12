import React from "react";
import UserEventsContent from "../components/usercenter/UserEventsContent";
import Header from "../components/common/Header";

const UserEventsPage = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <UserEventsContent />
    </div>
  );
};

export default UserEventsPage;
