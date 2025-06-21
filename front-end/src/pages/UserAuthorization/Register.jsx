import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [registerError, setRegisterError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const confirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }

  const sendOtp = async (e) => {
    e?.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      setRegisterError("");
      const response = await axios.post("http://localhost:8080/api/public/send-register-otp", {
        username,
        email,
        password
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.status === 200) {
        setOtpSent(true);
        setRegisterError("");
      }
    } catch (error) {
      console.log(error)
      if (error.response?.status === 400) {
        setRegisterError(response?.data);
      } else {
        setRegisterError("Failed to send OTP. Please try again.");
      }
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:8080/api/public/register", {
        otp
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.status === 200) {
        setIsRegistered(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after 2 seconds      
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setRegisterError("Incorrect or expired OTP.");
      } else {
        setRegisterError("Registration failed. Try again later.");
      }
    }
    setIsLoading(false);
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-6 text-blue-900 pb-3">
          REGISTER NEW ACCOUNT
        </h2>

        <form onSubmit={otpSent ? handleRegister : sendOtp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pb-3">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 pl-2.5">Username:</label>
              <input
                type="text"
                placeholder="Enter username..."
                className="pl-4 p-2 border border-blue-400 rounded-full"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
                disabled={otpSent}
              />

              <label className="mb-1 mt-4 text-sm font-medium text-gray-700 pl-2.5">Email:</label>
              <input
                type="email"
                placeholder="Enter email..."
                className="pl-4 p-2 border border-blue-400 rounded-full"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                disabled={otpSent}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 pl-2.5">Password:</label>
              <input
                type="password"
                placeholder="Enter password..."
                className="pl-4 p-2 border border-blue-400 rounded-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />

              <label className="mb-1 mt-4 text-sm font-medium text-gray-700 pl-2.5">Confirm password:</label>
              <input
                type="password"
                placeholder="Confirm password..."
                className="pl-4 p-2 border border-blue-400 rounded-full"
                onChange={confirmPasswordChange}
                value={confirmPassword}
                required
              />
              {passwordError && (
                <div className="text-red-600 text-sm mt-2">{passwordError}</div>
              )}
            </div>
          </div>

          {otpSent && (
            <div className="">
              <label className="mb-1 text-sm font-medium text-gray-700 pl-2.5">Enter OTP:</label>
              <div className='flex w-full justify-between items-center gap-4'>
                <input
                  type="text"
                  placeholder="Enter OTP sent to email"
                  className="pl-4 p-2 border border-blue-400 rounded-full w-3/4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  id='otp-input'
                  required
                />
                <button
                  type="button"
                  className="w-fit py-3 px-6 rounded-full bg-[#f1f900] text-blue-900 font-semibold hover:bg-[#dde428] transition self-end"
                  onClick={sendOtp}
                >
                  Resend OTP
                </button>

              </div>
            </div>
          )}

          { isLoading && (
            <div className="text-blue-600 text-sm text-center mt-4">
              {otpSent ? "Registering..." : "Sending OTP..."}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-950 transition"
              // onClick={isRegistered ? `disabled` : ""}
              id='register-button'
            >
              {otpSent ? "Register" : "Send OTP"}
            </button>
          </div>
        </form>

        {registerError && (
          <div className="text-red-600 text-sm mt-4 text-center">
            {registerError}
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Already had an account?{' '}
          <Link to="/login" className="font-bold hover:underline hover:text-blue-900">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
