import { jwtDecode } from 'jwt-decode'; // ✅ Correct for named exports

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/public/login",
        {
          username,
          password
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        const decoded = jwtDecode(token);
        const roles = decoded.roles || [];
        // console.log("Decoded JWT:", decoded);
        // console.log("User roles:", roles);

        // Store token and basic info
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", decoded.sub);

        // Redirect based on role
        if (roles.includes("ROLE_SUPER_ADMIN")) {
          console.log("Super Admin logged in");
          navigate("/superadmin");
        } else if (roles.includes("ROLE_USER")) {
          console.log("User logged in");
          navigate("/profile");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data || "Login failed. Please try again.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-blue-900">
      <div className="flex w-8/12 h-9/12 bg-white rounded-[40px] overflow-hidden">
        {/* Left Panel */}        <div className="w-1/2 flex items-center justify-center border-r border-black">
          {/* <p className="text-center text-sm">Ảnh sự kiện gần nhất hiện tại</p> */}
          <img
            src="/images/fptu-showcase.png"
            alt="Event"
            className="w-full h-full object-cover rounded-l-[30px]" />
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 space-y-5">
          <h1 className="text-5xl font-semibold text-center pb-4 text-blue-900">WELCOME TO MAVENT</h1>

          <form onSubmit={handleLoginFormSubmit} className="flex flex-col items-center space-y-4 w-full">
            <input
              type="text"
              name="username"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" px-4 py-2 border-2 border-blue-900 rounded-full focus:outline-none
                  focus:border-blue-700 hover:border-blue-300 w-19/24
                    transition"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" px-4 py-2 border-2 border-blue-900 rounded-full focus:outline-none
                  focus:border-blue-700 hover:border-blue-300 w-19/24
                    transition"
              required
            />

            <button className="px-6 py-2 rounded-full bg-blue-900 text-white hover:bg-[#2f52bc] transition">
              LOGIN
            </button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>

          <Link to="/reset-password-request" className="text-xs text-blue-900 hover:underline">
            Forgot Password?
          </Link>

          <p className="text-[0.9rem]">
            Don’t have an account? Click{' '}
            <Link to="/register" className="font-bold hover:underline hover:text-blue-900 text-xs">HERE</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login