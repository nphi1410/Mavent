import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/ProfileService";
import { getUnreadNotificationCount } from "../../services/NotificationService";
import SideBar from "./SideBar";
import NotificationModal from "./NotificationModal";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn")) {
      fetchUserProfile();
      fetchUnreadCount();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile({ requireAuth: false });
      if (response) {
        setUserData(response);
        sessionStorage.setItem("fullName", response.fullName);
        sessionStorage.setItem("accountId", response.id);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const navigateAllEvents = (type, isTrending) => {
    const searchParams = new URLSearchParams();
    if (type) searchParams.set("type", type);
    if (isTrending) searchParams.set("isTrending", "true");

    navigate(`/events?${searchParams.toString()}`);
    window.location.reload();
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
  };

  const handleUnreadCountUpdate = () => {
    fetchUnreadCount();
  };

  return (
    <header className="sticky top-0 z-9999 w-full bg-white shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-40">
          <img
            onClick={() => navigate("/")}
            src="/mavent-text-logo.svg"
            alt="Mavent Logo"
            className="w-full cursor-pointer"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium text-base">
          <span
            onClick={() => navigateAllEvents("upcoming", true)}
            className="hover:text-black cursor-pointer"
          >
            Upcoming
          </span>
          <span
            onClick={() => navigateAllEvents("recently", true)}
            className="hover:text-black cursor-pointer"
          >
            Recently
          </span>
          <span
            onClick={() => navigateAllEvents("ongoing", true)}
            className="hover:text-black cursor-pointer"
          >
            Ongoing
          </span>
          <span
            onClick={() => navigateAllEvents("", true)}
            className="hover:text-black cursor-pointer"
          >
            Trending
          </span>
        </nav>

        <div className="flex items-center gap-6">
          {userData ? (
            <>
              {/* Icon thông báo - chỉ hiển thị khi đã đăng nhập */}
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              </div>

              <span className="font-semibold text-lg text-gray-800">
                Hello,{" "}
                {userData.fullName?.length > 15
                  ? `${userData.fullName.substring(0, 15)}...`
                  : userData.fullName}
              </span>
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
                <img
                  onClick={() => setIsOpen(!isOpen)}
                  src={userData.avatarUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
            </>
          ) : (
            <span
              onClick={() => navigate("/login")}
              className="font-semibold text-lg text-gray-800 cursor-pointer"
            >
              Login
            </span>
          )}
        </div>
      </div>

      {/* Modal thông báo - chỉ render khi đã đăng nhập */}
      {userData && (
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={handleNotificationClose}
          onUnreadCountUpdate={handleUnreadCountUpdate}
        />
      )}
    </header>
  );
};

export default Header;
