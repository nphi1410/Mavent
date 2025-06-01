import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/profileService";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      console.log(response.data);

      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err); // Cập nhật log
      setError(err.response?.data?.message || "Failed to load user profile"); // Cập nhật lỗi
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-9999 w-full bg-white shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center w-40">
          <img
            onClick={() => navigate("/")}
            src="/mavent-text-logo.svg"
            alt="Mavent Logo"
            className="w-full"
          />
        </div>

        {/* Navigation Labels */}
        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium text-base">
          <span className="hover:text-black cursor-pointer">Upcoming</span>
          <span className="hover:text-black cursor-pointer">Trending</span>
          <span className="hover:text-black cursor-pointer">Featured</span>
          <span className="hover:text-black cursor-pointer">Explore more</span>
        </nav>

        {/* Greeting + Avatar */}
        <div className="flex items-center gap-6">
          {userData ? (
            <>
              <span className="font-semibold text-lg text-gray-800">
                Hello, {userData.fullName}
              </span>
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
                <img
                  onClick={() => navigate("/profile/")}
                  src="/avatar.jpg"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          ) : (
            <span
              onClick={() => navigate("/login")}
              className="font-semibold text-lg text-gray-800"
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
