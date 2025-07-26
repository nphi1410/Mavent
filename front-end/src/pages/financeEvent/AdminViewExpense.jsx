import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

import {
    fetchTotalExpenseByEventId,
    fetchExpensesByCategoryForEvent,
    fetchExpensesByDepartmentForEvent,
    fetchDistinctPaymentMethodsByEventId,
    fetchExpenseCountByStatusForEvent
} from '../../services/expenseAdminService';

import { getEventById } from '../../services/eventService';
import ExpenseExportButton from '../../components/export/ExpenseExportButton';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
    if (value === null || value === undefined) {
        return '0 VNĐ';
    }
    // Đảm bảo giá trị là số nguyên nếu nó là BigInteger từ backend
    // Sử dụng Number() để xử lý BigInt nếu có thể, hoặc đảm bảo backend trả về số thông thường
    const numericValue = typeof value === 'bigint' ? Number(value) : parseInt(value);
    if (isNaN(numericValue)) {
        return '0 VNĐ'; // Xử lý trường hợp không phải số
    }
    return `${numericValue.toLocaleString('vi-VN')} VNĐ`;
};

function StatCard({ title, value, icon, sourceText, subtitle }) {
    return (
        <div className="bg-gradient-to-br from-blue-200 to-blue-500 rounded-2xl shadow-lg text-white p-8 lg:p-10">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-full">
                            <FontAwesomeIcon icon={icon} className="text-2xl" />
                        </div>
                        <h2 className="text-xl lg:text-2xl font-semibold">{title}</h2>
                    </div>
                    <p className="text-5xl lg:text-6xl font-bold mb-2">{value}</p>
                    {sourceText && (
                        <p className="text-blue-100 text-lg">{sourceText}</p>
                    )}
                </div>
                {subtitle && (
                    <div className="hidden lg:block text-right">
                        <p className="text-blue-100 mb-2">Sự kiện</p>
                        <p className="text-xl font-semibold">{subtitle}</p>
                    </div>
                )}
            </div>
        </div>
    );
}


function ChartCard({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
            <div className="h-64 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

function VerticalBarChart({ title, data }) {
    if (!data || data.length === 0) return (
        <ChartCard title={title}>
            <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
        </ChartCard>
    );

    const chartData = {
        labels: data.map(d => String(d.categoryName || d.departmentName || d.label)), // Chuyển đổi thành String
        datasets: [
            {
                label: 'Tổng số tiền',
                data: data.map(d => d.totalAmount || d.value),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(20, 184, 166, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(251, 146, 60, 1)',
                    'rgba(20, 184, 166, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    }
                }
            },
        },
    };

    return (
        <ChartCard title={title}>
            <Bar data={chartData} options={chartOptions} />
        </ChartCard>
    );
}

function HorizontalBarChart({ title, data }) {
    if (!data || data.length === 0) return (
        <ChartCard title={title}>
            <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
        </ChartCard>
    );

    const chartData = {
        labels: data.map(d => String(d.departmentName || d.categoryName || d.label)), // Chuyển đổi thành String
        datasets: [
            {
                label: 'Tổng số tiền',
                data: data.map(d => d.totalAmount || d.value),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(20, 184, 166, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(251, 146, 60, 1)',
                    'rgba(20, 184, 166, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += formatCurrency(context.parsed.x);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    }
                }
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <ChartCard title={title}>
            <Bar data={chartData} options={chartOptions} />
        </ChartCard>
    );
}

function PieChart({ title, data }) {
    if (!data || data.length === 0) return (
        <ChartCard title={title}>
            <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
        </ChartCard>
    );

    const chartData = {
        labels: data.map(d => String(d.label || d.paymentMethod)), // Use d.paymentMethod for labels
        datasets: [
            {
                data: data.map(d => d.totalAmount || d.value || 1), // Use d.totalAmount for data
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(251, 146, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(251, 146, 60, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return `${label}: ${formatCurrency(value)} (${percentage})`;
                    }
                }
            }
        },
    };

    return (
        <ChartCard title={title}>
            <Pie data={chartData} options={chartOptions} />
        </ChartCard>
    );
}

function StatusChart({ title, data }) {
    if (!data || data.length === 0) return (
        <ChartCard title={title}>
            <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
        </ChartCard>
    );

    const total = data.reduce((sum, item) => sum + (item.count || item.value), 0);
    const chartJsColors = {
        PAID: 'rgba(34, 197, 94, 0.8)',
        APPROVED: 'rgba(59, 130, 246, 0.8)',
        PENDING: 'rgba(251, 191, 36, 0.8)',
        RECEIPT_SUBMITTED: 'rgba(118, 61, 230, 0.63)',
        REJECTED: 'rgba(239, 68, 68, 0.8)'
    };

    const tailwindDotColors = {
        PAID: 'bg-green-500',
        APPROVED: 'bg-blue-500',
        PENDING: 'bg-yellow-500',
        RECEIPT_SUBMITTED: 'rgba(118, 61, 230, 0.63)',
        REJECTED: 'bg-red-500'
    };

    const chartData = {
        labels: data.map(d => String(d.status)), // Chuyển đổi thành String
        datasets: [
            {
                label: 'Số lượng Expense',
                data: data.map(d => d.count || d.value),
                backgroundColor: data.map(d => chartJsColors[d.status] || 'rgba(107, 114, 128, 0.8)'),
                borderColor: data.map(d => chartJsColors[d.status].replace('0.8', '1') || 'rgba(107, 114, 128, 1)'),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed.y;
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
            <div className="h-64 mb-6">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {data.map((item, index) => (
                    <div key={item.status || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${tailwindDotColors[item.status] || 'bg-gray-500'}`}></div>
                            <span className="text-sm font-medium text-gray-700">{item.status}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-800">{item.count || item.value}</div>
                            <div className="text-xs text-gray-500">
                                {((item.count || item.value) / total * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminViewExpense() {
    const { id } = useParams(); // Lấy id từ URL

    const [totalSpentData, setTotalSpentData] = useState(null);
    const [categoriesData, setCategoriesData] = useState([]);
    const [departmentsData, setDepartmentsData] = useState([]);
    const [paymentMethodsData, setPaymentMethodsData] = useState([]);
    const [statusesData, setStatusesData] = useState([]);
    const [eventName, setEventName] = useState('Đang tải...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch event name
                // Đảm bảo id có giá trị trước khi gọi API
                if (!id) {
                    setError("Event ID không được cung cấp.");
                    setLoading(false);
                    return;
                }

                const eventDetails = await getEventById(id);
                if (eventDetails) {
                    setEventName(eventDetails.name);
                } else {
                    setEventName('Không tìm thấy sự kiện');
                }

                const totalSpent = await fetchTotalExpenseByEventId(id);
                setTotalSpentData(totalSpent);

                const categories = await fetchExpensesByCategoryForEvent(id);
                const mappedCategories = categories.map((cat) => ({
                    categoryId: cat.categoryId,
                    categoryName: cat.categoryName,
                    totalAmount: parseInt(cat.totalAmount),
                    label: cat.categoryName,
                    value: parseInt(cat.totalAmount),
                }));
                setCategoriesData(mappedCategories);

                const departments = await fetchExpensesByDepartmentForEvent(id);
                const mappedDepartments = departments.map((dep) => ({
                    departmentId: dep.departmentId,
                    departmentName: dep.departmentName,
                    totalAmount: parseInt(dep.totalAmount),
                    label: dep.departmentName,
                    value: parseInt(dep.totalAmount),
                }));
                setDepartmentsData(mappedDepartments);

                // Modified to use real data from fetchDistinctPaymentMethodsByEventId
                const paymentMethods = await fetchDistinctPaymentMethodsByEventId(id);
                const mappedPaymentMethods = paymentMethods.map((method) => ({
                    paymentMethod: method.paymentMethod, // Use the actual paymentMethod from the API
                    totalAmount: parseInt(method.totalAmount), // Use the actual totalAmount from the API
                    label: method.paymentMethod, // Ensure label is set for PieChart
                    value: parseInt(method.totalAmount), // Ensure value is set for PieChart
                }));
                setPaymentMethodsData(mappedPaymentMethods);

                const statuses = await fetchExpenseCountByStatusForEvent(id);
                const mappedStatuses = statuses.map((s) => ({
                    status: s.status,
                    count: s.count,
                    label: s.status,
                    value: s.count,
                }));
                setStatusesData(mappedStatuses);

            } catch (err) {
                setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng hoặc server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const currentTotal = totalSpentData ? parseInt(totalSpentData.totalAmount) : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg text-gray-700">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg text-red-600">Lỗi: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Dashboard Expense Overview</h1>
                            <p className="text-gray-600 mt-2">Event: {eventName}</p>
                        </div>
                        {/* BỔ SUNG DÒNG NÀY */}
                        <ExpenseExportButton eventId={id} fileName={`expense_report_event_${id}`} />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 mb-8">
                        <StatCard
                            title="Total Expense"
                            value={formatCurrency(currentTotal)}
                            icon={faDollarSign}
                            color="text-blue-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <VerticalBarChart title="Chi tiêu theo danh mục" data={categoriesData} />
                        <HorizontalBarChart title="Chi tiêu theo phòng ban" data={departmentsData} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <PieChart title="Phương thức thanh toán" data={paymentMethodsData} />
                        <StatusChart title="Tổng quan trạng thái chi tiêu" data={statusesData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminViewExpense;