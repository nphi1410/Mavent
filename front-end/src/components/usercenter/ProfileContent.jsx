import React, { useEffect, useState } from "react";
// Đổi từ getAllAccounts sang getUserProfile
import { getUserProfile, uploadAvatar } from "../../services/profileService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser } from '@fortawesome/free-solid-svg-icons'; // Thêm faUser icon

const ProfileContent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err); // Cập nhật log
      setError(err.response?.data?.message || 'Failed to load user profile'); // Cập nhật lỗi
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await uploadAvatar(formData);
        setUserData(prev => ({
          ...prev,
          avatarImg: response.data.avatarUrl // Đảm bảo backend trả về avatarUrl
        }));
      } catch (err) {
        console.error('Error uploading avatar:', err);
        alert(err.response?.data?.message || 'Failed to upload avatar');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { // Kiểm tra ngày hợp lệ
        return null;
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error parsing date:", dateString, e);
      return null;
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
      <div className="flex flex-col items-center mb-10 relative">
        <div className="relative group">
          {userData?.avatarImg ? (
            <img
              src={userData.avatarImg}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex justify-center items-center text-gray-500 text-5xl">
              <FontAwesomeIcon icon={faUser} />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-[#00155c] p-2 rounded-full cursor-pointer hover:bg-[#172c70] transition-colors">
            <FontAwesomeIcon icon={faUpload} className="text-white w-6 h-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>
      </div>

      <div className="mb-10 bg-white rounded-lg shadow-sm">
        {
          [
            ["Full Name", "fullName"],
            ["Student ID", "studentId"], 
            ["Email", "email"],
            ["Phone", "phone"],
            ["Date of Birth", "dateOfBirth"], 
            ["Gender", "gender"]
          ].map(([label, field]) => {
            let displayValue = userData?.[field];

            if (field === "dateOfBirth") {
              displayValue = formatDate(displayValue);
            }

            const isNullOrEmpty = displayValue === null || displayValue === undefined || displayValue === "";
            const valueToRender = isNullOrEmpty ? (
              <span className="text-gray-500">null</span>
            ) : (
              displayValue
            );

            return (
              <div
                key={field}
                className="flex items-center py-4 px-6 border-b border-gray-100 last:border-none"
              >
                <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">
                  {label}:
                </span>
                <span className="text-gray-800">{valueToRender}</span>
              </div>
            );
          })
        }
      </div>
    </main>
  );
};

export default ProfileContent;