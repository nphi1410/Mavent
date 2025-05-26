import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        // redirect to home page
        window.location.href = "/profile";
      } else if (response.status === 401) {
        const message = await response.text();
        setError(message || "Invalid username or password");
      }
      // if we get other errors, it goes to the catch block
    } catch (err) {
      setError("Network error. Please try again later.");
      console.error("Login error", err);
    }
  };
 

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-blue-900">
      <div className="flex w-8/12 h-9/12 bg-white rounded-[40px] overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center border-r border-black">
          {/* <p className="text-center text-sm">Ảnh sự kiện gần nhất hiện tại</p> */}
          <img
            src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/500241004_1167279355199938_6596002086529846154_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=foSz0fJFckoQ7kNvwE6hEnf&_nc_oc=Adm5W8dX4GHiM5e4sh_OLjySpiV9QVHGJ0GceqZZXKagDzagOh4stGKqJlEM-wVHC6c&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=x7PXBO4qz810RpaQdUQ3uA&oh=00_AfKQrOCrJ1yNRqgI6MFQXENOMN6G-RxlyOvEydCPmYfehw&oe=6838E740"
            alt="Event"
            className="w-full h-full object-cover rounded-l-[20px]"/>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 space-y-5">
          <h1 className="text-xl font-semibold text-center pb-4 text-blue-900">WELCOME TO MAVENT</h1>

          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full">
            <input
              type="text"
              name="username"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" px-4 py-2 border-2 border-blue-900 rounded-full focus:outline-none
                  focus:border-blue-700 hover:border-blue-300 w-19/24"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" px-4 py-2 border-2 border-blue-900 rounded-full focus:outline-none
                  focus:border-blue-700 hover:border-blue-300 w-19/24"
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
  );
}

export default Login;