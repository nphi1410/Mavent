import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function SuperAdminHeader() {

  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 bg-white">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center p-4 text-xl font-bold text-gray-800">
          <img src="/mavent-text-logo.svg" alt="mavent" className="w-40" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
          <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xl" />
          <span className="text-xl font-medium text-gray-700">
            <span className="text-black">Super</span> Admin
          </span>
        </div>
      </div>
    </header>
  )
}

export default SuperAdminHeader
