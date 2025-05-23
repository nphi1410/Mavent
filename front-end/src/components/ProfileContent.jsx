
import React, { useEffect, useState } from "react";
import { getUserProfile, uploadAvatar } from "../services/profileService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faUpload } from '@fortawesome/free-solid-svg-icons';
import UpdateProfile from './UpdateProfile';

const ProfileContent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserData(response.data);
      setEditedData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
      setLoading(false);
    }
  };
  const handleUpdateProfile = (updatedData) => {
    setUserData(updatedData);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const response = await uploadAvatar(formData);
        setUserData(prev => ({
          ...prev,
          avatarImg: response.data.avatarUrl
        }));
      } catch (err) {
        console.error('Error uploading avatar:', err);
        alert(err.response?.data?.message || 'Failed to upload avatar');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-red-600 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">😕</div>
        <div>Error: {error}</div>
      </div>
    </div>
  );

  return (
    <main className="flex-grow p-10 bg-white flex flex-col">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-10 relative">
        <div className="relative group">
          {userData?.avatarImg ? (
            <img
              src={userData.avatarImg}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex justify-center items-center text-xl text-gray-600 font-medium">
              {userData?.fullName?.charAt(0) || "U"}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">            <FontAwesomeIcon icon={faUpload} className="text-white w-4 h-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-10 bg-white rounded-lg shadow-sm">
        {[
          ["Full Name", "fullName"],
          ["Gender", "gender"],
          ["Email", "email"],
          ["Phone", "phone"]
        ].map(([label, field]) => (
          <div
            key={field}
            className="flex items-center py-4 px-6 border-b border-gray-100 last:border-none"
          >
            <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">
              {label}:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editedData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="text-gray-800">{userData[field] || "-"}</span>
            )}
          </div>
        ))}
      </div>      {/* Actions Section */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowUpdateForm(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >          <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" /> Edit Profile
          </button>
        </div>

      {/* Update Profile Modal */}
      {showUpdateForm && (
        <UpdateProfile
          userData={userData}
          onClose={() => setShowUpdateForm(false)}
          onUpdate={handleUpdateProfile}
        />
      )}
    </main>
  );
};

export default ProfileContent;