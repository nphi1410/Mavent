import React from 'react';

const ProfileContent = () => {
  const userData = {
    fullName: "Khoi Dang Nguyen",
    dateOfBirth: "December 19, 2005",
    gender: "Male",
    email: "khoidangnguyen@gmail.com",
    phone: "Oxxxxxxxxx",
  };

  return (
    <main className="flex-grow p-10 bg-white flex flex-col">
      {/* Avatar Section */}
      <div className="flex justify-center mb-10">
        <div className="w-40 h-40 rounded-full bg-gray-200 flex justify-center items-center text-xl text-gray-600 font-medium">
          useravatar
        </div>
      </div>

      {/* Details Section */}
      <div className="mb-10">
        {/* Full Name */}
        <div className="flex items-center py-4.5 border-b border-gray-200 text-base">
          <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">Full Name:</span>
          <span className="text-gray-800">{userData.fullName}</span>
        </div>
        {/* Date of Birth */}
        <div className="flex items-center py-4.5 border-b border-gray-200 text-base">
          <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">Date of Birth:</span>
          <span className="text-gray-800">{userData.dateOfBirth}</span>
        </div>
        {/* Gender */}
        <div className="flex items-center py-4.5 border-b border-gray-200 text-base">
          <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">Gender:</span>
          <span className="text-gray-800">{userData.gender}</span>
        </div>
        {/* Email */}
        <div className="flex items-center py-4.5 border-b border-gray-200 text-base">
          <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">Email:</span>
          <span className="text-gray-800">{userData.email}</span>
        </div>
        {/* Phone */}
        <div className="flex items-center py-4.5 border-b border-gray-200 text-base last:border-b-0">
          <span className="font-medium text-gray-700 min-w-[150px] flex-shrink-0">Phone:</span>
          <span className="text-gray-800">{userData.phone}</span>
        </div>
      </div>

      {/* Actions Section */}
      <div>
        <button className="px-6 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors">
          Change Information
        </button>
      </div>
    </main>
  );
};

export default ProfileContent;