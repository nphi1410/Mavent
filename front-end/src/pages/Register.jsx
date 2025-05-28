import React from 'react';

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-800">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-blue-900">
          REGISTER NEW ACCOUNT
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Username:</label>
            <input type="text" placeholder="Enter username..." className="p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <label className="mb-1 mt-4 text-sm font-medium text-gray-700">Email:</label>
            <input type="email" placeholder="Enter email..." className="p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Password:</label>
            <input type="password" placeholder="Enter password..." className="p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <label className="mb-1 mt-4 text-sm font-medium text-gray-700">Confirm password:</label>
            <input type="password" placeholder="Confirm password..." className="p-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">Register</button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already had an account? <a href="#" className="text-black underline">Login now</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
