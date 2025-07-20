import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../services/AuthService";
import { useNavigate } from 'react-router-dom';

function SuperAdminHeader() {

  const navigate = useNavigate();
  // State để quản lý việc hiển thị/ẩn modal đăng xuất
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Ref để tham chiếu đến phần tử avatar, giúp định vị modal và phát hiện click bên ngoài
  const avatarRef = useRef(null);

  // Hàm để chuyển đổi trạng thái hiển thị của modal
  const toggleLogoutModal = () => {
    setShowLogoutModal(prevState => !prevState);
  };

  // Effect hook để đóng modal khi người dùng click ra bên ngoài modal hoặc avatar
  useEffect(() => {
    function handleClickOutside(event) {
      // Nếu click bên ngoài khu vực avatar (bao gồm cả modal)
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowLogoutModal(false);
      }
    }
    // Gắn lắng nghe sự kiện click vào toàn bộ tài liệu
    document.addEventListener("mousedown", handleClickOutside);
    // Dọn dẹp sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [avatarRef]); // Chạy lại khi avatarRef thay đổi (thường chỉ chạy 1 lần)

  // Hàm xử lý đăng xuất (placeholder)
  const handleLogout = async () => {
    try {
      await logout();         // call logout logic
      setShowLogoutModal(false);
      navigate("/login");      // redirect to login page
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 bg-white z-10">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center p-4 text-xl font-bold text-gray-800">
          <img src="/mavent-text-logo.svg" alt="mavent" className="w-40" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div
          ref={avatarRef} // Gắn ref vào div chứa avatar để theo dõi click
          className="relative flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
          onClick={toggleLogoutModal} // Thêm sự kiện click để bật/tắt modal
        >
          <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
          <span className="text-xl font-medium text-gray-700">
            <span className="text-black">Super</span> Admin
          </span>

          {/* Logout Modal - Chỉ hiển thị khi showLogoutModal là true */}
          {showLogoutModal && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
              <button
                className="block w-full text-left px-4 py-2 text-md text-red-600 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên div cha, tránh việc đóng modal ngay lập tức
                  handleLogout(); // Gọi hàm xử lý đăng xuất
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default SuperAdminHeader;