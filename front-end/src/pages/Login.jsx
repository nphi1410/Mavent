import React, { useState } from 'react'
import { Link } from 'react-router-dom';
function Login() {
  const [form, setForm] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.usernameOrEmail,
          password: form.password
        })
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      // Handle successful login (e.g., redirect, store token, etc.)
      // Example: window.location.href = '/home';
    } catch (err) {
      setError('Invalid username/email or password');
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
              name="usernameOrEmail"
              placeholder="Username or email"
              value={form.usernameOrEmail}
              onChange={handleChange}
              className=" px-4 py-2 border-2 border-black rounded-full focus:outline-none
                  focus:border-blue-800 hover:border-blue-300 w-19/24
                    transition"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className=" px-4 py-2 border-2 border-black rounded-full focus:outline-none
                  focus:border-blue-800 hover:border-blue-300 w-19/24
                    transition"
              required
            />

            <button className="px-6 py-2 rounded-full bg-blue-900 text-white hover:bg-[#2f52bc] transition">
              LOGIN
            </button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
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


