import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/register", {
    // const response = await fetch(`${import.meta.env.VITE_API_URL}`, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include', 
    });

    if (response.ok) {
      // redirect to home page
      window.location.href = "/login";
    } else {
      console.error("Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">

      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-3xl">
        
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-6 text-blue-900 pb-3">
          REGISTER NEW ACCOUNT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pb-3">

          <div className="flex flex-col">

            <label className="mb-1 text-sm font-medium text-gray-700 pl-2.5">Username:</label>
            <input 
              type="text"   
              placeholder="Enter username..." 
              className="pl-4 p-2 border border-blue-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-700" 
            />
            
            <label className="mb-1 mt-4 text-sm font-medium text-gray-700 pl-2.5">Email:</label>
            <input 
              type="email" 
              placeholder="Enter email..." 
              className="pl-4 p-2 border border-blue-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
              />
          </div>

          <div className="flex flex-col">

            <label className="mb-1 text-sm font-medium text-gray-700 pl-2.5">Password:</label>
            <input 
              type="password" 
              placeholder="Enter password..." 
              className="pl-4 p-2 border border-blue-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />

            <label className="mb-1 mt-4 text-sm font-medium text-gray-700 pl-2.5">Confirm password:</label>
            <input 
            type="password" 
            placeholder="Confirm password..." 
            className="pl-4 p-2 border border-blue-400 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />

          </div>
        </div>

        <div className="flex justify-center mt-6">

          <button className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-950 hover:text-gray-100 transition">
            Register
          </button>

        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already had an account? {' '}
          <Link to="/register" className="font-bold hover:underline hover:text-blue-900">Login now</Link>
        </p>

      </div>

    </div>
  );
};

export default Register;
