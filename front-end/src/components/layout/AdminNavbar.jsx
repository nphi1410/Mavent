import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getUserProfile } from '../../services/profileService';
import { getEventById } from '../../services/eventService';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ onMenuClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Extract eventId from URL path /event/{eventId}/members
  const getEventIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/event\/(\d+)\/members/);
    return match ? parseInt(match[1]) : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await getUserProfile();
        if (userResponse?.data) {
          setUserData(userResponse.data);
        }

        // Fetch event data
        const eventId = getEventIdFromUrl();
        if (eventId) {
          const eventResponse = await getEventById(eventId);
          if (eventResponse) {
            setEventData(eventResponse);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleLogout = () => {
    navigate('/logout');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">          {/* Logo/Title - Responsive text sizes */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 truncate">
              <span className="hidden sm:inline">
                {loading ? 'Loading...' : eventData?.name || 'Member Management System'}
              </span>
              <span className="sm:hidden">
                {loading ? 'Loading...' : (eventData?.name?.substring(0, 10) + '...' || 'MMS')}
              </span>
            </h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
              <FontAwesomeIcon icon={faBell} className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>            {/* User Profile */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="h-8 w-8 lg:h-10 lg:w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200"
                  onClick={handleProfileClick}
                  title="Go to Profile"
                >
                  {userData?.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">
                    {loading ? 'Loading...' : userData?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {loading ? '...' : 'Administrator'}
                  </p>
                </div>
              </div>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Sidebar Toggle Button */}
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
            </button>
            
            {/* More Options */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FontAwesomeIcon 
                icon={isMobileMenuOpen ? faTimes : faUser} 
                className="h-5 w-5" 
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-3">            {/* User Info */}
            <div 
              className="flex items-center space-x-3 pb-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
              onClick={handleProfileClick}
              title="Go to Profile"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {userData?.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {loading ? 'Loading...' : userData?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {loading ? '...' : 'Administrator'}
                </p>
              </div>
            </div>
            
            {/* Mobile Menu Items */}
            <div className="space-y-2">
              <button className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-gray-500" />
                <span className="text-sm">Notifications</span>
                <span className="ml-auto h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
                <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-gray-500" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
