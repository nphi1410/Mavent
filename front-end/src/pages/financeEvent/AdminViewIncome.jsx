// AdminViewIncome.jsx

import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faPlus,
  faEdit,
} from "@fortawesome/free-solid-svg-icons"; // Import icons for buttons
import {
  getIncomeOverview,
  getIncomesListByEventId,
} from "../../services/incomeService";

Chart.register(...registerables);
import CreateIncomeModal from "../../components/income/CreateIncomeModal";
import UpdateIncomeModal from "../../components/income/UpdateIncomeModal";

const AdminViewIncome = () => {
  const { id } = useParams();
  const [dateRange, setDateRange] = useState("all");

  const [incomeOverview, setIncomeOverview] = useState(null);
  const [detailedIncomeEntries, setDetailedIncomeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIncomeToUpdate, setSelectedIncomeToUpdate] = useState(null); // State to hold data for update modal

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Function to fetch all data (overview and detailed list)
  const fetchData = async () => {
    if (id) {
      setLoading(true);
      setError(null);
      try {
        const overviewData = await getIncomeOverview(Number(id), dateRange);
        setIncomeOverview(overviewData);

        const detailedData = await getIncomesListByEventId(Number(id));
        setDetailedIncomeEntries(detailedData);
      } catch (err) {
        setError("Không thể tải dữ liệu thu nhập. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setIncomeOverview(null);
      setDetailedIncomeEntries([]);
      setError("Không tìm thấy ID sự kiện trong URL.");
    }
  };

  // useEffect to fetch data when 'id' or dateRange changes
  useEffect(() => {
    fetchData();
  }, [id, dateRange]);

  // Chart data and options
  const totalRevenue = incomeOverview?.totalRevenue || 0;
  const revenueByType = incomeOverview?.revenueByType || {};
  const numberOfSources = incomeOverview?.numberOfSources || 0;

  const chartLabels = Object.keys(revenueByType);
  const chartValues = Object.values(revenueByType);
  const chartBackgroundColors = [
    "#3B82F6",
    "#14B8A6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  // Effect for Chart.js
  useEffect(() => {
    if (chartRef.current && incomeOverview) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: chartLabels,
          datasets: [
            {
              data: chartValues,
              backgroundColor: chartBackgroundColors.slice(
                0,
                chartLabels.length
              ),
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed !== null) {
                    label +=
                      context.parsed.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      }) + " VNĐ";
                  }
                  return label;
                },
              },
            },
          },
        },
      });
    }
  }, [incomeOverview, chartLabels, chartValues]); // Added chartLabels, chartValues to dependencies

  // Helper functions for icons and colors
  const getTypeIcon = (type, size = "w-4 h-4") => {
    let iconClass = "";
    const lowerCaseType = type ? type.toLowerCase() : "";

    switch (lowerCaseType) {
      case "ticket_sales":
        iconClass = "fa-solid fa-ticket-alt";
        break;
      case "sponsor":
        iconClass = "fa-solid fa-handshake";
        break;
      case "merchandise":
        iconClass = "fa-solid fa-box-open";
        break;
      case "donation":
        iconClass = "fa-solid fa-hand-holding-dollar";
        break;
      case "other":
        iconClass = "fa-solid fa-ellipsis-h";
        break;
      default:
        iconClass = "fa-solid fa-dollar-sign";
        break;
    }
    return <i className={`${iconClass} ${size}`}></i>;
  };

  const getTypeColor = (type) => {
    const lowerCaseType = type ? type.toLowerCase() : "";
    switch (lowerCaseType) {
      case "ticket_sales":
        return "bg-blue-500";
      case "sponsor":
        return "bg-teal-500";
      case "merchandise":
        return "bg-green-500";
      case "donation":
        return "bg-purple-500";
      case "other":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatSourceType = (type) => {
    if (!type) return "N/A";
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Handlers for modals
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchData(); // Reload data after successful creation
  };

  const handleUpdateClick = (incomeEntry) => {
    setSelectedIncomeToUpdate(incomeEntry);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setSelectedIncomeToUpdate(null);
    fetchData(); // Reload data after successful update
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

  const currentEventName =
    incomeOverview?.selectedEventName || `Event ID: ${id}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Bảng điều khiển doanh thu
              </h1>
              <p className="text-gray-600 mt-2">
                Theo dõi và phân tích thu nhập sự kiện của bạn
              </p>
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
              {/* Create and Update buttons */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                Tạo Thu nhập
              </button>
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
                <h2 className="text-xl lg:text-2xl font-semibold">
                  Tổng doanh thu
                </h2>
              </div>
              <p className="text-5xl lg:text-6xl font-bold mb-2">
                {totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                VNĐ
              </p>
              <p className="text-blue-100 text-lg">
                từ {numberOfSources} nguồn thu nhập
              </p>
            </div>
            <div className="hidden lg:block text-right">
              <p className="text-blue-100 mb-2">Sự kiện</p>
              <p className="text-xl font-semibold">{currentEventName}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Phân tích thu nhập
              </h3>
              <i className="fa-solid fa-filter w-5 h-5 text-gray-400"></i>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-gray-600">Tên</th>
                    <th className="text-left py-3 px-2 text-gray-600">Loại</th>
                    <th className="text-left py-3 px-2 text-gray-600">
                      Số tiền
                    </th>
                    <th className="text-left py-3 px-2 text-gray-600">Ngày</th>
                    <th className="text-left py-3 px-2 text-gray-600">
                      Hành động
                    </th>
                    {/* New column for actions */}
                  </tr>
                </thead>
                <tbody>
                  {detailedIncomeEntries.length > 0 ? (
                    detailedIncomeEntries.map((entry) => (
                      <tr
                        key={entry.incomeId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-2 font-semibold text-gray-900">
                          {entry.source}
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${getTypeColor(
                                entry.type
                              )} text-white`}
                            >
                              {getTypeIcon(entry.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatSourceType(entry.type)}
                              </p>
                              {entry.notes && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {entry.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 font-semibold text-gray-900">
                          {entry.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          VNĐ
                        </td>
                        <td className="py-4 px-2 text-gray-600">
                          {entry.date
                            ? new Date(entry.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="py-4 px-2">
                          <button
                            onClick={() => handleUpdateClick(entry)}
                            className="px-3 py-1 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-1 text-sm"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
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
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Phân phối doanh thu
            </h3>
            <div className="relative w-full h-64 mx-auto mb-6">
              <canvas ref={chartRef}></canvas>
            </div>

            <div className="space-y-3">
              {chartLabels.map((type, index) => {
                const percentage =
                  totalRevenue > 0
                    ? (revenueByType[type] / totalRevenue) * 100
                    : 0;
                const amount = revenueByType[type] || 0;
                const colors = [
                  "bg-blue-500",
                  "bg-teal-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-purple-500",
                ];
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded ${
                          colors[index % colors.length]
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {formatSourceType(type)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        VNĐ
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
              TICKET_SALES: getTypeIcon("TICKET_SALES", "w-6 h-6"),
              SPONSOR: getTypeIcon("SPONSOR", "w-6 h-6"),
              MERCHANDISE: getTypeIcon("MERCHANDISE", "w-6 h-6"),
              DONATION: getTypeIcon("DONATION", "w-6 h-6"),
              OTHER: getTypeIcon("OTHER", "w-6 h-6"),
            };
            const bgMap = {
              TICKET_SALES: "bg-blue-100",
              SPONSOR: "bg-teal-100",
              MERCHANDISE: "bg-green-100",
              DONATION: "bg-purple-100",
              OTHER: "bg-gray-100",
            };
            return (
              <div
                key={type}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 ${
                      bgMap[type] || "bg-gray-100"
                    } rounded-full`}
                  >
                    {iconMap[type] || getTypeIcon("Default", "w-6 h-6")}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {formatSourceType(type)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(amount || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Income Modal */}
      {showCreateModal && (
        <CreateIncomeModal
          eventId={Number(id)}
          eventName={currentEventName} // Truyền tên sự kiện
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Update Income Modal */}
      {showUpdateModal && selectedIncomeToUpdate && (
        <UpdateIncomeModal
          incomeData={selectedIncomeToUpdate}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminViewIncome;
