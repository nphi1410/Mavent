import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faClock, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminHeader from '../components/SuperAdminHeader';
const SuperAdminDashboard = () => {

    // Test API
    const stats = [
        {
            title: "Total Events",
            icon: faCalendarAlt,
            value: 24,
            description: "+2 from last month"
        },
        {
            title: "Active Users",
            icon: faUser,
            value: 573,
            description: "+18 from last month"
        },
        {
            title: "Upcoming Events",
            icon: faClock,
            value: 12,
            description: "Next event in 3 days"
        },
        {
            title: "Registrations",
            icon: faArrowTrendUp,
            value: "1,324",
            description: "+12% from last month"
        }

    ];
    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <SuperAdminHeader />
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>

                    <div className="py-10 w-full">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
                        <p className="text-gray-500 mb-6">Welcome back, Super Admin!</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-zinc-100 p-6 rounded-2xl shadow border hover:shadow-neutral-700 transition"
                                >
                                    <div className="flex items-center gap-8 mb-3">
                                        <h2 className="font-semibold text-gray-700 flex-1/2">{stat.title}</h2>
                                        <FontAwesomeIcon icon={stat.icon} className="text-gray-500" />
                                    </div>
                                    <div className="text-2xl font-bold text-black">{stat.value}</div>
                                    <div className="text-sm text-gray-500 mt-1">{stat.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}

export default SuperAdminDashboard;
