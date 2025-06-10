import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import { getDashboardMetrics } from '../../services/superadmin/dashboardService';
import { getEvents } from '../../services/eventService';
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
    Filler
} from 'chart.js';
import SuperAdminSidebar from "../../components/superadmin/SuperAdminSidebar";
import SuperAdminHeader from "../../components/superadmin/SuperAdminHeader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const SuperAdminDashboard = () => {
    const [metrics, setMetrics] = useState({ totalEvents: 0, totalAccounts: 0, totalUpcomingEvents: 0, totalOngoingEvents: 0 });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEventChart, setShowEventChart] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(null);
    const eventLineRef = useRef(null);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [m, evs] = await Promise.all([getDashboardMetrics(), getEvents()]);
                setMetrics({
                    totalEvents: m.totalEvents,
                    totalAccounts: m.totalAccounts,
                    totalUpcomingEvents: m.totalUpcomingEvents,
                    totalOngoingEvents: m.totalOngoingEvents,
                });
                setEvents(evs);
            } catch (err) {
                setError("Không thể tải dữ liệu dashboard.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statsConfig = [
        { title: "Total Events", icon: faCalendarAlt, value: metrics.totalEvents, onClick: () => setShowEventChart(!showEventChart) },
        { title: "Total Accounts", icon: faUser, value: metrics.totalAccounts, onClick: null },
        { title: "Upcoming Events", icon: faClock, value: metrics.totalUpcomingEvents, onClick: null },
        { title: "Ongoing Events", icon: faClock, value: metrics.totalOngoingEvents, onClick: null },
    ];

    const getMonthlyCounts = () => {
        const arr = Array(12).fill(0);
        events.forEach(ev => {
            const d = new Date(ev.startDatetime);
            if (d.getFullYear() === selectedYear) arr[d.getMonth()]++;
        });
        return arr;
    };

    const getWeeklyCountsForMonth = (mi) => {
        const weeks = [0, 0, 0, 0];
        events.forEach(ev => {
            const d = new Date(ev.startDatetime);
            if (d.getFullYear() === selectedYear && d.getMonth() === mi) {
                const day = d.getDate();
                const w = Math.min(3, Math.floor((day - 1) / 7));
                weeks[w]++;
            }
        });
        return weeks;
    };

    const handleYearChange = e => {
        setSelectedYear(+e.target.value);
        setSelectedMonthIndex(null);
    };

    const handleMonthClick = (event, chart) => {
        if (!chart) return;
        const points = chart.getElementsAtEventForMode(event.native, 'nearest', { intersect: true }, true);
        if (points.length > 0) {
            const index = points[0].index;
            setSelectedMonthIndex(index);
        }
    };

    const lineData = {
        labels: monthNames,
        datasets: [{
            label: `Events in ${selectedYear}`,
            data: getMonthlyCounts(),
            borderColor: 'teal',
            backgroundColor: 'rgba(0,128,128,0.2)',
            tension: 0.3,
            fill: true,
        }],
    };

    const lineOpts = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Events by Month (${selectedYear})` },
        },
        scales: {
            y: { beginAtZero: true, precision: 0 },
        },
        onClick: (event, elements, chart) => handleMonthClick(event, chart),
    };

    const barData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: selectedMonthIndex !== null ? `Events in ${monthNames[selectedMonthIndex]}` : '',
            data: selectedMonthIndex !== null ? getWeeklyCountsForMonth(selectedMonthIndex) : [],
            backgroundColor: 'mediumpurple',
            borderColor: 'rebeccapurple',
            borderWidth: 1,
        }],
    };

    const barOpts = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Events by Week' },
        },
        scales: {
            y: { beginAtZero: true, precision: 0 },
        },
    };

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className="flex flex-col flex-1">
                <SuperAdminHeader />
                <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
                    <div className="py-10 w-full">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-500 mb-6">Welcome back, Super Admin!</p>

                        {loading && <div className="text-center text-blue-600">Loading...</div>}
                        {error && <div className="text-center text-red-600">{error}</div>}

                        {!loading && !error && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    {statsConfig.map((stat, i) => (
                                        <div
                                            key={i}
                                            onClick={stat.onClick}
                                            className={`bg-zinc-100 p-6 rounded-xl shadow ${stat.onClick ? 'cursor-pointer' : ''}`}
                                        >
                                            <div className="flex justify-between">
                                                <h2>{stat.title}</h2>
                                                <FontAwesomeIcon icon={stat.icon} />
                                            </div>
                                            <div className="text-3xl font-bold">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {showEventChart && (
                                    <>
                                        <div className="mb-4">
                                            <label className="font-medium mr-2">Select Year:</label>
                                            <select
                                                value={selectedYear}
                                                onChange={handleYearChange}
                                                className="p-2 border rounded"
                                            >
                                                {[...new Set(events.map(ev => new Date(ev.startDatetime).getFullYear()))]
                                                    .sort((a, b) => b - a)
                                                    .map(yr => (
                                                        <option key={yr} value={yr}>{yr}</option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-1/2 bg-gray-200 p-6 rounded-xl shadow">
                                                <Line ref={eventLineRef} data={lineData} options={lineOpts} />
                                            </div>
                                            <div className="w-full md:w-1/2 bg-gray-200 p-6 rounded-xl shadow flex items-center justify-center">
                                                {selectedMonthIndex !== null ? (
                                                    <Bar data={barData} options={barOpts} />
                                                ) : (
                                                    <span className="text-gray-500 italic text-center">
                                                        Click vào một tháng trên biểu đồ bên trái để xem thống kê theo tuần
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </>
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
