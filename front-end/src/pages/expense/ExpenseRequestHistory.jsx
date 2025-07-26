import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllExpenses,
  getExpenseCategories,
  getExpensesByAccount,
  getExpenseById,
} from "../../services/expense/ExpenseService.jsx";
import ExpenseRequestPopup from "../../components/expense/ExpenseRequestPopup.jsx";
import ExpenseRequestDetail from "../../components/expense/ExpenseRequestDetail.jsx";
import { useEventRole } from "../../context/EventRoleContext.jsx";
import { getUserInfoInEvent } from "../../services/UserEventService.jsx";
import { formatMoney } from "../../utils/formatMoney.js";

import { getBudgetByEventId } from "../../services/expense/BudgetService.jsx";
import LottieLoader from "../../components/visual/LottieLoader.jsx";

export default function ExpenseRequestHistory() {
  const { user } = useEventRole();
  const { id: eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [role, setRole] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [budgetId, setBudgetId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");

  // Check location state for automatic popup opening
  useEffect(() => {
    if (location.state && location.state.openCreate) {
      // Set task ID if provided
      if (location.state.taskId) {
        setTaskId(location.state.taskId);
        setTaskTitle(location.state.taskTitle || "");
      }

      // Open the create form
      setShowCreateForm(true);

      // Remove the state from history to prevent re-opening on back/forward navigation
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Fetch expenses based on user role
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setDataLoaded(false);

        // Get user role in event
        const roleResponse = await getUserInfoInEvent(eventId);
        // console.log("User role response:", roleResponse);
        if (!roleResponse) {
          toast.error("Could not determine your role in this event");
          return;
        }

        setRole(roleResponse.role);

        // Fetch expenses based on role
        let expenseData = [];
        const upperRole = roleResponse.role.toUpperCase();

        // Fetch budget ID for the event
        try {
          const budget = await getBudgetByEventId(eventId);
          //   console.log("Budget data:", budget);
          if (budget && budget.budgetId) {
            setBudgetId(budget.budgetId);
          }
        } catch (budgetError) {
          console.error("Error fetching budget:", budgetError);
          // Don't show error to user as budget might be optional
        }

        switch (upperRole) {
          case "MEMBER":
            expenseData = await getExpensesByAccount(eventId, user.accountId);
            break;
          case "DEPARTMENT_MANAGER":
            expenseData = await getExpensesByAccount(eventId, user.accountId);
            break;
          case "ADMIN":
            expenseData = await getAllExpenses(eventId);
            break;
          //   case "DEPARTMENT_MANAGER":
          //     expenseData = await getExpensesByDepartment(eventId, user.departmentId);
          //     break;
          default:
            // toast.error("Unknown role");
            return;
        }

        // Fetch expense categories
        const categoriesData = await getExpenseCategories(eventId);
        setCategories(categoriesData);

        // console.log("Loaded expenses:", expenseData);
        setExpenses(expenseData);
        setFilteredExpenses(expenseData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load expense data");
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoading(true);
        // console.log("Fetching expense categories for eventId:", eventId);

        if (!eventId) {
          console.error("EventId is undefined or null");
          toast.error("Event ID is missing. Cannot load categories.");
          return;
        }

        const categories = await getExpenseCategories(eventId);
        // console.log("Categories loaded:", categoriesData);

        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchCategories();
    }

    fetchExpenses();
  }, [eventId, user.accountId, refreshData]);

  useEffect(() => {
    const filterExpenses = () => {
      let filtered = expenses;

      // No filters applied
      if (!categoryFilter && !statusFilter && !searchTitle) {
        setFilteredExpenses(expenses);
        return;
      }

      // Filter by category
      if (categoryFilter) {
        filtered = filtered.filter(
          (expense) => expense.categoryId === Number(categoryFilter)
        );
      }

      // Filter by status
      if (statusFilter) {
        filtered = filtered.filter(
          (expense) =>
            expense.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      if (searchTitle) {
        filtered = filtered.filter(
          (expense) =>
            expense.note &&
            expense.note.toLowerCase().includes(searchTitle.toLowerCase())
        );
      }

      setFilteredExpenses(filtered);
    };

    filterExpenses();
  }, [categoryFilter, statusFilter, searchTitle, expenses]);

  const handleCreateExpense = () => {
    setShowCreateForm(true);
  };

  const handleFormSubmit = () => {
    setRefreshData((prev) => !prev);
  };

  const handleViewDetail = async (expenseId) => {
    try {
      setLoading(true);
      const expenseDetail = await getExpenseById(eventId, expenseId);
      setSelectedExpense(expenseDetail);

      // Nếu expense có task ID, tìm task title nếu có thể
      if (expenseDetail.taskId) {
        try {
          // Import động để tránh circular dependency
          const { getTaskDetails } = await import(
            "../../services/ProfileService.jsx"
          );
          const taskData = await getTaskDetails(expenseDetail.taskId);

          if (taskData && taskData.title) {
            // Cập nhật task title trong state
            setTaskTitle(taskData.title);
          }
        } catch (taskError) {
          console.error("Error fetching task details:", taskError);
          // Silent fail - we'll use default title or task ID
        }
      }

      setShowDetailPopup(true);
    } catch (error) {
      console.error("Error fetching expense details:", error);
      toast.error("Failed to load expense details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-500 text-white",
      APPROVED: "bg-green-500 text-white",
      REJECTED: "bg-red-500 text-white",
      PAID: "bg-blue-500 text-white",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusStyles[status] || "bg-gray-500 text-white"
        }`}
      >
        {status}
      </span>
    );
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <LottieLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Create Expense Popup */}
      {showCreateForm && (
        <ExpenseRequestPopup
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          accountId={user.accountId}
          departmentId={user.departmentId}
          budgetId={budgetId}
          eventId={eventId}
          taskId={taskId}
          taskTitle={taskTitle}
          onSubmitSuccess={handleFormSubmit}
        />
      )}{" "}
      {showDetailPopup && selectedExpense && (
        <ExpenseRequestDetail
          isOpen={showDetailPopup}
          onClose={() => setShowDetailPopup(false)}
          expenseData={selectedExpense}
          categories={categories}
          onUpdateSuccess={(updatedExpense) => {
            // Cập nhật expense trong danh sách theo expenseId
            setExpenses((prev) =>
              prev.map((exp) =>
                exp.expenseId === updatedExpense.expenseId
                  ? updatedExpense
                  : exp
              )
            );

            // Đồng thời cập nhật filteredExpenses nếu đang filter
            setFilteredExpenses((prev) =>
              prev.map((exp) =>
                exp.expenseId === updatedExpense.expenseId
                  ? updatedExpense
                  : exp
              )
            );
          }}
          taskTitle={selectedExpense?.taskTitle || taskTitle}
          userRole={role}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">EXPENSE REQUESTS</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end">
              <div className="flex-1 min-w-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No categories available
                    </option>
                  )}
                </select>
              </div>

              <div className="flex-1 min-w-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Search by Description"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                />
              </div>

              {/* Create button for members and department managers */}
              {/* {(role.toLowerCase() === "member" ||
                role.toLowerCase() === "department_manager") && (
                <div className="flex-shrink-0">
                  <button
                    onClick={handleCreateExpense}
                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Create Expense Request
                  </button>
                </div>
              )} */}
            </div>

            {/* Expense Table */}
            {dataLoaded && expenses.length === 0 ? (
              <div className="rounded-xl p-6 bg-red-100">
                <p className="text-red-700">
                  There are no expense requests created for this event yet.
                </p>
              </div>
            ) : (
              <div className="bg-[#ffffff] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-rose-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Expense ID
                        </th>
                        {role.toLowerCase() === "admin" && (
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Requested By
                          </th>
                        )}
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Category
                        </th>
                        {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th> */}
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredExpenses.map((expense) => (
                        <tr key={expense.expenseId}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {expense.expenseId}
                          </td>
                          {(role.toLowerCase() === "admin" ||
                            role.toLowerCase() === "department_manager") && (
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {expense.createdByFullName || "Unknown"}
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatMoney(expense.amount)} VNĐ
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {expense.categoryName || "Unknown"}
                          </td>
                          {/* <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(expense.paymentDate).toLocaleDateString()}
                          </td> */}
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {getStatusBadge(expense.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() =>
                                handleViewDetail(expense.expenseId)
                              }
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
