import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faClock, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import SuperAdminHeader from '../../components/superadmin/SuperAdminHeader';
import { getDashboardMetrics } from '../../services/dashboardService'; // Import hàm service của bạn

const SuperAdminDashboard = () => {
    // Sử dụng useState để lưu trữ trạng thái của các chỉ số, loading và lỗi
    const [metrics, setMetrics] = useState({
        totalEvents: 0,
        totalAccounts: 0,
        totalUpcomingEvents: 0,
        totalOngoingEvents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect để gọi API khi component được mount
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true); // Bắt đầu tải dữ liệu
                const data = await getDashboardMetrics(); // Gọi hàm service
                setMetrics({
                    totalEvents: data.totalEvents,
                    totalAccounts: data.totalAccounts,
                    totalUpcomingEvents: data.totalUpcomingEvents,
                    totalOngoingEvents: data.totalOngoingEvents,
                });
            } catch (err) {
                setError("Failed to load dashboard data. Please try again later.");
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []); // Mảng dependency rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

    // Dữ liệu cho các thẻ thống kê, giờ đây được xây dựng trực tiếp từ state `metrics`
    const statsConfig = [
        {
            title: "Total Events",
            icon: faCalendarAlt,
            value: metrics.totalEvents,
        },
        {
            title: "Total Accounts",
            icon: faUser,
            value: metrics.totalAccounts,
        },
        {
            title: "Upcoming Events",
            icon: faClock,
            value: metrics.totalUpcomingEvents,
        },
        {
            title: "Ongoing Events",
            icon: faClock,
            value: metrics.totalOngoingEvents,
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

                        {/* Hiển thị trạng thái tải hoặc lỗi */}
                        {loading && (
                            <div className="text-center text-blue-600 text-lg">Loading dashboard data...</div>
                        )}
                        {error && (
                            <div className="text-center text-red-600 text-lg">Error: {error}</div>
                        )}

                        {/* Chỉ hiển thị dữ liệu khi không tải và không có lỗi */}
                        {!loading && !error && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hover:cursor-pointer">
                                {statsConfig.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-zinc-100 p-6 rounded-2xl shadow border hover:shadow-neutral-700 transition"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="font-semibold text-gray-700">{stat.title}</h2>
                                            <FontAwesomeIcon icon={stat.icon} className="text-gray-500 text-xl" />
                                        </div>
                                        <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;