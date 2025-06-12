import React from "react";
import UserTasksContent from "../components/usercenter/UserTasksContent";
import Header from "../components/common/Header";

const UserTasksPage = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <UserTasksContent />
    </div>
  );
};

export default UserTasksPage;
