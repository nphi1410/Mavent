import React from 'react'

function Login() {

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

          <input
            type="text"
            placeholder="Username or email"
            className=" px-4 py-2 border-2 border-black rounded-full focus:outline-none
                  focus:border-blue-800 hover:border-blue-300 w-19/24
                    transition"
          />

          <input
            type="password"
            placeholder="Password"
            className=" px-4 py-2 border-2 border-black rounded-full focus:outline-none
                  focus:border-blue-800 hover:border-blue-300 w-19/24
                    transition"
          />

          <button className="px-6 py-2 rounded-full bg-blue-900 text-white hover:bg-[#2f52bc] transition">
            LOGIN
          </button>

          <a href="#" className="text-xs text-blue-900 hover:underline">
            Forgot Password?
          </a>

          <p className="text-[0.9rem]">
            Don’t have an account? Click{' '}
            <a href="#" className="hover:underline hover:text-blue-900 text-xs">HERE</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login


