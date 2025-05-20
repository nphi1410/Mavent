import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getUserStart, getUserSuccess, getUserFailure } from '../../store/slices/userSlice';
import userService from '../../services/userService';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserStart());
      userService.getCurrentUserProfile()
        .then(data => {
          dispatch(getUserSuccess(data));
        })
        .catch(err => {
          dispatch(getUserFailure(err.message || 'Failed to load user profile'));
        });
    }
  }, [dispatch, isAuthenticated]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentUser?.username || 'User'}</h2>
                <p className="text-gray-600">{currentUser?.email || 'email@example.com'}</p>
                <p className="text-sm text-gray-500 mt-1">Role: {currentUser?.role || 'USER'}</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Widgets */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Widget 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">Recent Activity</h3>
              <p className="text-gray-600 mb-4">Your recent account activities</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Login</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profile Updated</span>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Password Changed</span>
                  <span className="text-xs text-gray-500">5 days ago</span>
                </div>
              </div>
            </div>
            
            {/* Widget 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">Account Status</h3>
              <p className="text-gray-600 mb-4">Overview of your account</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Membership</span>
                  <span className="text-sm font-medium">Basic</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Member since</span>
                  <span className="text-xs text-gray-500">January 2023</span>
                </div>
              </div>
            </div>
            
            {/* Widget 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
              <p className="text-gray-600 mb-4">Common tasks for your account</p>
              <div className="space-y-3">
                <button className="w-full text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded transition-colors">
                  Edit Profile
                </button>
                <button className="w-full text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded transition-colors">
                  Change Password
                </button>
                <button className="w-full text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded transition-colors">
                  Privacy Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;
