import React, { useEffect, useState } from "react";
import { getUserProfile, uploadAvatar, updateProfile as updateProfileService } from "../../services/ProfileService"; // Đổi tên updateProfile để tránh trùng
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser } from '@fortawesome/free-solid-svg-icons';
import UpdateProfile from "./UpdateProfile"; 

const ProfileContent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); 
  const [updateLoading, setUpdateLoading] = useState(false); 

  const fetchUserProfile = async () => {
    setLoading(true); 
    setError(null);
    try {
      const profileData = await getUserProfile(); 
      setUserData(profileData);
    } catch (err) {
      console.error('ProfileContent: Error fetching profile:', err);
      setError(err.message || err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []); 

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('ProfileContent: Uploading avatar file:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      try {        const response = await uploadAvatar(formData);
        console.log('ProfileContent: Avatar upload response:', response);
        if (response && response.avatarUrl) { 
          setUserData(prev => ({
            ...prev,
            avatarUrl: response.avatarUrl
          }));
           alert('Avatar updated successfully!');
        } else {
            throw new Error("Invalid response from avatar upload");
        }
      } catch (err) {
        console.error('ProfileContent: Avatar upload error:', err);
        alert(err.response?.data?.message || err.message || 'Failed to upload avatar');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }); 
    } catch (e) {
      console.error("Error parsing date:", dateString, e);
      return null;
    }
  };

  const handleProfileUpdate = async (dataFromChildForm) => {
    setUpdateLoading(true);
    setError(null);
    try {
      console.log('ProfileContent: Starting update with data from child form:', dataFromChildForm);
      
      const updatedUserProfile = await updateProfileService(dataFromChildForm);
      console.log('ProfileContent: Response from updateProfileService:', updatedUserProfile);

      if (updatedUserProfile && typeof updatedUserProfile === 'object') {
        setUserData(updatedUserProfile); 
        alert('Update successful!');
      } else {
        console.log('ProfileContent: Update processed, re-fetching profile for consistency.');
        await fetchUserProfile();
        alert('Update successful, data is being refreshed.');
      }
      setIsUpdating(false); 
    } catch (error) {
      console.error('ProfileContent: Error during profile update:', error);
      let alertMessage = 'Unable to update profile. Please try again.';
      if (error.message === 'Authentication required') { 
        return; 
      } else if (error.response && error.response.data && error.response.data.message) {
        alertMessage = error.response.data.message;
      } else if (error.message) {
        alertMessage = error.message;
      }
      setError(alertMessage);
      alert(alertMessage);
    } finally {
      setUpdateLoading(false); 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error && !isUpdating) return ( 
    <div className="p-10 text-red-600 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">😕</div>
        <div>Error: {error}</div>
        <button onClick={fetchUserProfile} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!userData && !loading) return ( 
    <div className="p-10 text-gray-600 text-center">Unable to load user data.</div>
  );


  return (
    <main className="flex-grow p-6 sm:p-10 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8 sm:mb-10 relative">
          <div className="relative group w-32 h-32 sm:w-40 sm:h-40">
            {userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl} 
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex justify-center items-center text-gray-500 text-5xl border-4 border-white shadow-lg">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-[#00155c] p-2 rounded-full cursor-pointer hover:bg-[#172c70] transition-colors shadow-md">
              <FontAwesomeIcon icon={faUpload} className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-gray-800 truncate max-w-[250px]">
            @{userData?.username?.length > 15 
              ? `${userData.username.substring(0, 15)}...` 
              : userData?.username || "User Profile"}
          </h1>
          {/* <p className="text-sm text-gray-500">@{userData?.username}</p> */}
        </div>

        <div className="mb-8 sm:mb-10 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="divide-y divide-gray-200">
          {
            [
              ["Full Name", "fullName"],
              ["Student ID", "studentId"],
              ["Email", "email"], // Email vẫn hiển thị dù không sửa được
              ["Phone", "phoneNumber"],
              ["Date of Birth", "dateOfBirth"], 
              ["Gender", "gender"]
            ].map(([label, field]) => {
              let displayValue = userData?.[field];

              if (field === "dateOfBirth") {
                displayValue = formatDate(displayValue);
              }
              if (field === "gender" && displayValue) {
                displayValue = displayValue.charAt(0).toUpperCase() + displayValue.slice(1).toLowerCase();
              }


              const valueToRender = (displayValue === null || displayValue === undefined || displayValue === "") ? (
                <span className="text-gray-400 italic">Not provided</span>
              ) : (
                displayValue
              );

              return (
                <div
                  key={field}
                  className="py-3 sm:py-4 px-4 sm:px-6 grid grid-cols-3 gap-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-600 col-span-1">{label}:</span>
                  <span className="text-sm text-gray-800 col-span-2 break-words">{valueToRender}</span>
                </div>
              );
            })
          }
          </div>
        </div>

        <div className="flex justify-end px-0 sm:px-6 mb-6"> 
          <button
            onClick={() => { 
              setError(null); 
              setIsUpdating(true);
            }}
            className="bg-[#00155c] hover:bg-[#172c70] text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#00155c] focus:ring-opacity-50"
          >
            Update Profile
          </button>
        </div>

        {isUpdating && (
          <UpdateProfile 
            userData={userData}
            onClose={() => setIsUpdating(false)}
            onUpdate={handleProfileUpdate} 
          />
        )}
      </div>
    </main>
  );
};

export default ProfileContent;