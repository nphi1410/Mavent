import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/profileService";
import SideBar from "./SideBar";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (!sessionStorage.getItem("token")) {
        // navigate("/login"); 
        return;
      }
      const response = await getUserProfile({ requireAuth: false });
      if (response) {
        setUserData(response);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const navigateAllEvents = (type, isTrending) => {
    const searchParams = new URLSearchParams();
    if (type) searchParams.set("type", type);
    if (isTrending) searchParams.set("isTrending", "true");

    navigate(`/events?${searchParams.toString()}`);
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
              <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
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
    </header>
  );
};

export default Header;
