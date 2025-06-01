import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars, faCalendar, faUserTie } from "@fortawesome/free-solid-svg-icons";

// Hàm mock giả lập fetch avatar từ DB
const getMockAvatarUrl = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });
};

function SuperAdminHeader() {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      const url = await getMockAvatarUrl();
      setAvatarUrl(url);
    };

    fetchAvatar();
  }, []);

  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 bg-white">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center p-4 text-xl font-bold text-gray-800">
          <img src="../assets/mavent-text-logo.svg" alt="mavent" className="w-40" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-gray-300">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <span className="text-xl font-medium text-gray-700">
            <span className="text-black">Super</span> Admin
          </span>
        </div>
      </div>
    </header>
  );
}

export default SuperAdminHeader;
