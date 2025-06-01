import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCorrectPassword, setIsCorrectPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const verifyOldPassword = async (e) => {
    e?.preventDefault();
    try {
      console.log("Verifying old password:", oldPassword);
      const response = await axios.post("http://localhost:8080/api/verify-password",
        { oldPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
      if (response.status === 200) {
        setIsCorrectPassword(true);
        setStatus("Old password verified successfully.");
        console.log(status);
      }
    } catch (error) {
      setIsCorrectPassword(false);
      setStatus("Old password is incorrect. Please try again.");
      console.error("Error verifying old password:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/change-password",
        {
          oldPassword,
          newPassword
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
      if (response.status === 200) {
        setStatus("Password updated successfully.");
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (err) {
      setStatus("Failed to update password. Check old password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white p-8 rounded-2xl w-80 text-center shadow-lg">
        <p className="text-left text-sm text-gray-600 mb-2 cursor-pointer hover:underline">
          <Link to="/profile">← Back to Profile</Link>
        </p>
        <h1 className="text-2xl font-bold mb-4 text-blue-900">CHANGE PASSWORD</h1>

        <form onSubmit={isCorrectPassword ? handleChangePassword : verifyOldPassword} className="space-y-4">

          <input
            type="password"
            placeholder="Old Password..."
            className="w-full px-4 py-2 mb-3 border border-blue-300 rounded-full focus:outline-none"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          {isCorrectPassword && (
            <div>
              <input
                type="password"
                placeholder="New Password..."
                className="w-full px-4 py-2 mb-3 border border-blue-300 rounded-full focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm password..."
                className="w-full px-4 py-2 mb-4 border border-blue-300 rounded-full focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
          >
            {isCorrectPassword ? "Change Password" : "Verify Old Password"}
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
