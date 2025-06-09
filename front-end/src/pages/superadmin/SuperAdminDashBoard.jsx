import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminHeader from '../components/SuperAdminHeader';
import { getDashboardMetrics } from '../services/dashboardService';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SuperAdminDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalEvents: 0,
        totalAccounts: 0,
        totalUpcomingEvents: 0,
        totalOngoingEvents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEventChart, setShowEventChart] = useState(false);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await getDashboardMetrics();
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
    }, []);

    const statsConfig = [
        {
            title: "Total Events",
            icon: faCalendarAlt,
            value: metrics.totalEvents,
            onClick: () => setShowEventChart(!showEventChart),
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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const eventLineData = {
        labels: monthNames,
        datasets: [
            {
                label: 'Events Created',
                data: [5, 6, 4, 10, 12, 1, 3, 20, 22, 21, 28, 4],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.3,
            },
        ],
    };

    const handleLineChartClick = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            setSelectedMonthIndex(index);
        }
    };

    const eventLineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Monthly Event Statistics',
            },
        },
        onClick: handleLineChartClick,
    };

    const weeklyDataPerMonth = {
        0: [1, 2, 1, 1],
        1: [0, 3, 2, 1],
        2: [2, 0, 1, 1],
        3: [4, 2, 3, 1],
        4: [3, 5, 2, 2],
        5: [0, 0, 1, 0],
        6: [1, 1, 0, 1],
        7: [6, 5, 4, 5],
        8: [5, 4, 6, 7],
        9: [7, 5, 6, 3],
        10: [8, 9, 7, 4],
        11: [1, 1, 1, 1],
    };

    const barData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: selectedMonthIndex !== null ? `Events in ${monthNames[selectedMonthIndex]}` : '',
                data: weeklyDataPerMonth[selectedMonthIndex] || [],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Weekly Events in Selected Month',
            },
        },
    };

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <SuperAdminHeader />
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>
                    <div className="py-10 w-full">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
                        <p className="text-gray-500 mb-6">Welcome back, Super Admin!</p>

                        {loading && (
                            <div className="text-center text-blue-600 text-lg">Loading dashboard data...</div>
                        )}
                        {error && (
                            <div className="text-center text-red-600 text-lg">Error: {error}</div>
                        )}

                        {!loading && !error && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hover:cursor-pointer">
                                    {statsConfig.map((stat, index) => (
                                        <div
                                            key={index}
                                            onClick={stat.onClick}
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

                                {showEventChart && (
                                    <div className="mt-10 flex gap-6">
                                        <div className="w-1/2 bg-gray-200 p-6 rounded-xl shadow">
                                            <Line data={eventLineData} options={eventLineOptions} />
                                        </div>
                                        {selectedMonthIndex !== null && (
                                            <div className="w-1/2 bg-gray-200 p-6 rounded-xl shadow">
                                                <Bar data={barData} options={barOptions} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
