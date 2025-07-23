"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"
import CreatedEventsSidebar from "./CreatedEventSidebar"

const CreatedEventLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    // console.log("CreatedEventLayout rendered")

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-30">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Desktop Sidebar Toggle */}
            <div className="hidden md:block fixed z-30 border-gray-700 m-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-white rounded-lg shadow-lg hover:shadow-lg transition-shadow"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar */}
            <CreatedEventsSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div
                className={`
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "md:ml-64" : "ml-0"}
      `}
            >
                <div className="pt-16 md:pt-4">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default CreatedEventLayout
