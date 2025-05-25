import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // redirect to home page
      window.location.href = "/home";
    } else {
      console.error("Login failed");
    }
  };
 

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex w-8/12 h-9/12 bg-white rounded-[40px] border border-black overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center border-r border-black p-4">
          <p className="text-center text-sm">Ảnh sự kiện gần nhất hiện tại</p>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 space-y-5">
          <h1 className="text-xl font-semibold text-center pb-4">WELCOME TO MAVENT</h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full">
            <input
              type="text"
              name="username"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" px-4 py-2 border-2 border-black rounded-full focus:outline-none
                  focus:border-blue-800 hover:border-blue-300 w-19/24
                    transition"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" px-4 py-2 border-2 border-black rounded-full focus:outline-none
                  focus:border-blue-800 hover:border-blue-300 w-19/24
                    transition"
              required
            />

            <button className="px-6 py-2 rounded-full bg-blue-900 text-white hover:bg-[#2f52bc] transition">
              LOGIN
            </button>
            {/* {error && <div className="text-red-600 text-sm mt-2">{error}</div>} */}
          </form>

          <Link to="/about" className="text-xs text-blue-900 hover:underline">
            Forgot Password?
          </Link>

          <p className="text-[0.9rem]">
            Don’t have an account? Click{' '}
            <Link to="/about" className="hover:underline hover:text-blue-900 text-xs">HERE</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login


