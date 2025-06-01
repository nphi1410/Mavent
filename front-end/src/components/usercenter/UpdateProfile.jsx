import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../services/profileService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const UpdateProfile = ({ userData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    studentId: userData?.studentId || '',
    gender: userData?.gender || '',
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth) : null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({
      fullName: userData?.fullName || '',
      studentId: userData?.studentId || '',
      gender: userData?.gender || '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
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
    setError(null);

    try {
      if (formData.fullName.length > 100) {
        setError('Full name không được quá 100 ký tự.');
        setLoading(false);
        return;
      }

      if (!/^0\d{9}$/.test(formData.phoneNumber)) {
        setError('Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.');
        setLoading(false);
        return;
      }

      if (!/^[A-Za-z]{2}\d{6}$/.test(formData.studentId)) {
        setError('Mã số sinh viên phải gồm 2 chữ cái và 6 chữ số, ví dụ: SE123456.');
        setLoading(false);
        return;
      }

      const dataToSubmit = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : null
      };

      console.log('UpdateProfile.jsx: Đang gửi dữ liệu lên service:', dataToSubmit);
      onUpdate(dataToSubmit);
    } catch (err) {
      console.error('UpdateProfile.jsx: Lỗi khi chuẩn bị dữ liệu hoặc gọi onUpdate:', err);
      setError(err.message || 'Lỗi không xác định khi chuẩn bị dữ liệu.');
      setLoading(false);
    }
  };

  return (
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

            <div className="w-full">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <DatePicker
                id="dateOfBirth"
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select date of birth"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
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
                <option value="MALE">Male</option>
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
                value={formData.email}
                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
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
