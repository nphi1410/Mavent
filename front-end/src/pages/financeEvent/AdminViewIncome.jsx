// AdminViewIncome.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useParams } from 'react-router-dom'; // Import useParams
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { getIncomeOverview, getIncomesListByEventId } from '../../services/incomeService'; // Import cả hai hàm API

Chart.register(...registerables);

const AdminViewIncome = () => {
    // Lấy 'id' từ URL parameters, vì route được định nghĩa là 'event/:id'
    const { id } = useParams(); // THAY ĐỔI TỪ eventId SANG id
    const [dateRange, setDateRange] = useState('all');

    const [incomeOverview, setIncomeOverview] = useState(null);
    const [detailedIncomeEntries, setDetailedIncomeEntries] = useState([]); // State cho danh sách chi tiết
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // useEffect để fetch dữ liệu thu nhập khi 'id' (eventId) hoặc dateRange thay đổi
    useEffect(() => {
        const fetchData = async () => {
            // Sử dụng 'id' từ useParams trực tiếp
            if (id) { // Kiểm tra id thay vì eventId
                setLoading(true);
                setError(null);
                try {
                    // Fetch overview data, đảm bảo id là số
                    const overviewData = await getIncomeOverview(Number(id), dateRange);
                    setIncomeOverview(overviewData);

                    // Fetch detailed income entries for the table
                    const detailedData = await getIncomesListByEventId(Number(id));
                    setDetailedIncomeEntries(detailedData);

                } catch (err) {
                    setError('Không thể tải dữ liệu thu nhập. Vui lòng thử lại.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Nếu không có 'id' trong URL, đặt loading thành false và không có lỗi
                setLoading(false);
                setIncomeOverview(null); // Xóa dữ liệu cũ
                setDetailedIncomeEntries([]); // Xóa dữ liệu chi tiết
                setError("Không tìm thấy ID sự kiện trong URL.");
            }
        };

        fetchData();
    }, [id, dateRange]); // Chạy lại khi 'id' hoặc dateRange thay đổi

    const totalRevenue = incomeOverview?.totalRevenue || 0;
    const revenueByType = incomeOverview?.revenueByType || {};
    const numberOfSources = incomeOverview?.numberOfSources || 0;

    const chartLabels = Object.keys(revenueByType);
    const chartValues = Object.values(revenueByType);
    const chartBackgroundColors = ['#3B82F6', '#14B8A6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    useEffect(() => {
        if (chartRef.current && incomeOverview) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: 'pie',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: chartValues,
                        backgroundColor: chartBackgroundColors.slice(0, chartLabels.length),
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                                callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += '$' + context.parsed.toLocaleString('en-US', { minimumFractionDigits: 2 });
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [incomeOverview]);

    const getTypeIcon = (type, size = 'w-4 h-4') => {
        let iconClass = '';
        const lowerCaseType = type ? type.toLowerCase() : '';

        switch (lowerCaseType) {
            case 'ticket_sales': // Đảm bảo khớp với tên enum từ backend
                iconClass = 'fa-solid fa-ticket-alt';
                break;
            case 'sponsor': // Đảm bảo khớp với tên enum từ backend
                iconClass = 'fa-solid fa-handshake';
                break;
            case 'merchandise': // Đảm bảo khớp với tên enum từ backend
                iconClass = 'fa-solid fa-box-open';
                break;
            case 'donation':
                iconClass = 'fa-solid fa-hand-holding-dollar';
                break;
            case 'other':
                iconClass = 'fa-solid fa-ellipsis-h';
                break;
            default:
                iconClass = 'fa-solid fa-dollar-sign';
                break;
        }
        return <i className={`${iconClass} ${size}`}></i>;
    };

    const getTypeColor = (type) => {
        const lowerCaseType = type ? type.toLowerCase() : '';
        switch (lowerCaseType) {
            case 'ticket_sales': // Đảm bảo khớp với tên enum từ backend
                return 'bg-blue-500';
            case 'sponsor': // Đảm bảo khớp với tên enum từ backend
                return 'bg-teal-500';
            case 'merchandise': // Đảm bảo khớp với tên enum từ backend
                return 'bg-green-500';
            case 'donation':
                return 'bg-purple-500';
            case 'other':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Hàm để định dạng tên loại nguồn (ví dụ: TICKET_SALES -> Ticket Sales)
    const formatSourceType = (type) => {
        if (!type) return 'N/A';
        return type.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };


    if (loading && !incomeOverview) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center">
                <p className="text-gray-700 text-lg">Đang tải dữ liệu thu nhập...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 lg:p-8 flex items-center justify-center">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    // Sử dụng selectedEventName từ incomeOverview nếu có, nếu không thì dùng placeholder
    const currentEventName = incomeOverview?.selectedEventName || `Event ID: ${id}`;

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Bảng điều khiển doanh thu</h1>
                            <p className="text-gray-600 mt-2">Theo dõi và phân tích thu nhập sự kiện của bạn</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả thời gian</option>
                                <option value="30">30 ngày qua</option>
                                <option value="7">7 ngày qua</option>
                                <option value="today">Hôm nay</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Total Revenue Summary */}
                <div className="bg-gradient-to-br from-purple-300 to-indigo-400 rounded-2xl shadow-lg text-white p-8 lg:p-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <FontAwesomeIcon icon={faDollarSign} className="text-2xl" />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-semibold">Tổng doanh thu</h2>
                            </div>
                            <p className="text-5xl lg:text-6xl font-bold mb-2">
                                {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} VNĐ
                            </p>
                            <p className="text-blue-100 text-lg">
                                từ {numberOfSources} nguồn thu nhập
                            </p>
                        </div>
                        <div className="hidden lg:block text-right">
                            <p className="text-blue-100 mb-2">Sự kiện</p>
                            <p className="text-xl font-semibold">{currentEventName}</p> {/* Display dynamic event name */}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Table */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">Phân tích thu nhập</h3>
                            <i className="fa-solid fa-filter w-5 h-5 text-gray-400"></i>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 text-gray-600">Loại</th>
                                        <th className="text-left py-3 px-2 text-gray-600">Số tiền</th>
                                        <th className="text-left py-3 px-2 text-gray-600">Ngày</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedIncomeEntries.length > 0 ? (
                                        detailedIncomeEntries.map((entry) => (
                                            <tr key={entry.incomeId} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${getTypeColor(entry.type)} text-white`}>
                                                            {getTypeIcon(entry.type)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{formatSourceType(entry.type)}</p>
                                                            {entry.notes && <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 font-semibold text-gray-900">
                                                    {entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} VNĐ
                                                </td>
                                                <td className="py-4 px-2 text-gray-600">
                                                    {entry.date ? new Date(entry.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    }) : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-gray-500">
                                                Không có dữ liệu thu nhập.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Phân phối doanh thu</h3>
                        <div className="relative w-full h-64 mx-auto mb-6">
                            <canvas ref={chartRef}></canvas>
                        </div>

                        <div className="space-y-3">
                            {chartLabels.map((type, index) => {
                                const percentage = (revenueByType[type] / totalRevenue) * 100 || 0;
                                const amount = revenueByType[type] || 0;
                                const colors = ['bg-blue-500', 'bg-teal-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                                return (
                                    <div key={type} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                                            <span className="text-sm font-medium text-gray-700">{formatSourceType(type)}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {percentage.toFixed(1)}%
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} VNĐ
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(revenueByType).map(([type, amount]) => {
                        const iconMap = {
                            'TICKET_SALES': getTypeIcon('TICKET_SALES', 'w-6 h-6'),
                            'SPONSOR': getTypeIcon('SPONSOR', 'w-6 h-6'),
                            'MERCHANDISE': getTypeIcon('MERCHANDISE', 'w-6 h-6'),
                            'DONATION': getTypeIcon('DONATION', 'w-6 h-6'),
                            'OTHER': getTypeIcon('OTHER', 'w-6 h-6'),
                        };
                        const bgMap = {
                            'TICKET_SALES': 'bg-blue-100',
                            'SPONSOR': 'bg-teal-100',
                            'MERCHANDISE': 'bg-green-100',
                            'DONATION': 'bg-purple-100',
                            'OTHER': 'bg-gray-100',
                        };
                        return (
                            <div
                                key={type}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 ${bgMap[type] || 'bg-gray-100'} rounded-full`}>
                                        {iconMap[type] || getTypeIcon('Default', 'w-6 h-6')}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">{formatSourceType(type)}</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} VNĐ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminViewIncome;