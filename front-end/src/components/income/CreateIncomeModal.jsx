// src/components/modals/CreateIncomeModal.jsx
import React, { useState } from "react";
import { createIncome } from "../../services/IncomeService"; // Import hàm createIncome

const CreateIncomeModal = ({ eventId, eventName, onClose, onSuccess }) => {
  // Thêm eventName vào props
  const [formData, setFormData] = useState({
    eventId: eventId, // Đặt eventId mặc định từ prop
    amount: "",
    title: "",
    description: "",
    sourceType: "TICKET_SALES", // Giá trị mặc định
    sourceId: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sourceTypes = [
    { value: "TICKET_SALES", label: "Bán vé" },
    { value: "SPONSOR", label: "Tài trợ" },
    { value: "MERCHANDISE", label: "Hàng hóa" },
    { value: "DONATION", label: "Quyên góp" },
    { value: "OTHER", label: "Khác" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "sourceId"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Đảm bảo amount không rỗng và là số
    if (formData.amount === "" || isNaN(formData.amount)) {
      setError("Số tiền không hợp lệ.");
      setLoading(false);
      return;
    }

    try {
      await createIncome(formData);
      console.log("Tạo khoản thu nhập thành công!"); // Thay thế alert
      onSuccess(); // Gọi hàm onSuccess để đóng modal và tải lại dữ liệu cha
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tạo khoản thu nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Thêm backdrop-blur-sm để làm mờ nền phía sau
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Tạo Khoản Thu nhập Mới
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Số tiền (VNĐ)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="sourceType"
              className="block text-sm font-medium text-gray-700"
            >
              Loại nguồn
            </label>
            <select
              id="sourceType"
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              {sourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="sourceId"
              className="block text-sm font-medium text-gray-700"
            >
              ID nguồn (Tùy chọn)
            </label>
            <input
              type="number"
              id="sourceId"
              name="sourceId"
              value={formData.sourceId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Mô tả (Tùy chọn)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Ghi chú (Tùy chọn)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo Thu nhập"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncomeModal;
