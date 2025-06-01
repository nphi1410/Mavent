<<<<<<< Updated upstream:front-end/src/components/UpdateProfile.jsx
import React, { useState } from 'react';
import { updateProfile } from '../services/profileService';
=======
import React, { useState, useEffect } from 'react';
// Giả sử profileService.updateProfile đã được import ở ProfileContent và truyền xuống qua props
// Hoặc nếu bạn muốn gọi trực tiếp từ đây, bạn cần import:
// import { updateProfile } from '../../services/profileService'; 
>>>>>>> Stashed changes:front-end/src/components/usercenter/UpdateProfile.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const UpdateProfile = ({ userData, onClose, onUpdate }) => {
  // State cho dữ liệu form, khởi tạo với giá trị từ userData
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    studentId: userData?.studentId || '',
    gender: userData?.gender || '',
    email: userData?.email || '', // Email thường không cho sửa
    // Đảm bảo key ở đây khớp với key trong userData và key backend mong đợi
    phoneNumber: userData?.phoneNumber || '', // Đổi 'phone' thành 'phoneNumber' nếu userData dùng 'phoneNumber'
    // Hoặc nếu backend mong đợi 'phone' và userData là 'phoneNumber':
    // phone: userData?.phoneNumber || '', 
    dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth) : null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Lỗi cục bộ cho form này

  // Đồng bộ formData nếu userData prop thay đổi từ bên ngoài (hiếm khi cần nếu modal được render mới mỗi lần)
  useEffect(() => {
    setFormData({
        fullName: userData?.fullName || '',
        studentId: userData?.studentId || '',
        gender: userData?.gender || '',
        email: userData?.email || '',
        phoneNumber: userData?.phoneNumber || '', // Khớp với key trong userData
        dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth) : null
    });
  }, [userData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Xóa lỗi cũ

    try {
      // Chuẩn bị dữ liệu để gửi đi, đảm bảo định dạng dateOfBirth là ISO string
      const dataToSubmit = {
        ...formData,
        // Nếu backend không nhận 'email' hoặc không cho phép cập nhật email, hãy loại bỏ nó khỏi dataToSubmit
        // delete dataToSubmit.email; 
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : null // Gửi YYYY-MM-DD
      };
      // Kiểm tra xem key 'phone' hay 'phoneNumber' được backend sử dụng
      // Nếu backend dùng 'phone' nhưng formData dùng 'phoneNumber':
      // if (dataToSubmit.phoneNumber !== undefined) {
      //   dataToSubmit.phone = dataToSubmit.phoneNumber;
      //   delete dataToSubmit.phoneNumber;
      // }


      console.log('UpdateProfile.jsx: Đang gửi dữ liệu lên service:', dataToSubmit);
      
      // Gọi service updateProfile (đã được import ở ProfileContent và truyền xuống)
      // Hoặc nếu bạn import trực tiếp ở đây:
      // const resultFromService = await updateProfileService(dataToSubmit);
      // Vì onUpdate trong ProfileContent sẽ gọi service, nên ở đây chúng ta chỉ cần gọi onUpdate với dataToSubmit
      // **CHỈNH SỬA QUAN TRỌNG THEO THẢO LUẬN CUỐI:**
      // UpdateProfile sẽ KHÔNG gọi service updateProfile nữa.
      // Nó chỉ chuẩn bị dữ liệu và gọi onUpdate của cha.
      
      // Gọi prop onUpdate của cha và truyền dữ liệu form đã chuẩn bị
      onUpdate(dataToSubmit); 
      // onClose(); // Cha sẽ quyết định đóng modal sau khi onUpdate của nó xử lý xong

    } catch (err) {
      // Lỗi này thường là lỗi chuẩn bị dữ liệu (ví dụ: toISOString trên null)
      // Lỗi gọi API sẽ được xử lý ở component cha (ProfileContent)
      console.error('UpdateProfile.jsx: Lỗi khi chuẩn bị dữ liệu hoặc gọi onUpdate:', err);
      setError(err.message || 'Lỗi không xác định khi chuẩn bị dữ liệu.');
      setLoading(false); // Dừng loading nếu có lỗi ở đây
    }
    // setLoading sẽ được quản lý bởi onUpdate của cha nếu API call được chuyển lên đó
  };

  return (
    // Lớp CSS ngoài cùng của modal (fixed inset-0 ...) nên nằm ở ProfileContent
    // để UpdateProfile chỉ là nội dung form. Tuy nhiên, giữ nguyên theo code bạn cung cấp.
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="my-8 bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Update Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
                <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-full"> {/* DatePicker nên chiếm full width nếu không bị giới hạn bởi grid */}
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <DatePicker
                id="dateOfBirth"
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy" // Định dạng phổ biến ở Việt Nam
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select date of birth"
                maxDate={new Date()} // Không cho chọn ngày tương lai
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100} // Số năm hiển thị trong dropdown
                peekNextMonth
                showMonthDropdown
                dropdownMode="select"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option> {/* Sử dụng giá trị enum của backend nếu có */}
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email} // Email thường không được phép thay đổi
                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled // Vô hiệu hóa trường email
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber" // Khớp với key trong formData
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3 sm:w-4 sm:h-4" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00157be1] text-sm font-medium text-white rounded-md shadow-sm hover:bg-[#001168] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00157be1] transition-colors flex items-center gap-2 disabled:opacity-70"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className="w-3 h-3 sm:w-4 sm:h-4" /> {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;