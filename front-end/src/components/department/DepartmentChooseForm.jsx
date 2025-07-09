import React, { useEffect, useState } from "react";
import { getDepartmentsByEventId } from "../../services/departmentService";

const DepartmentChooseForm = ({ eventId, onDepartmentSelect, onClose }) => {
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartmentsByEventId(eventId);
        setDepartmentList(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [eventId]);

  const handleConfirm = () => {
    const selectedDepartment = departmentList.find(
      (d) => d.departmentId === selectedId
    );
    if (selectedDepartment) {
      onDepartmentSelect(selectedDepartment); // ← calls handleDepartmentSelect from EventBanner
      onClose();
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Choose a Department
      </h2>

      <div className="space-y-3">
        {departmentList.map((department) => (
          <label
            key={department.departmentId}
            className={`flex items-start border rounded-xl px-4 py-3 cursor-pointer transition duration-200 ${
              selectedId === department.departmentId
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input
              type="radio"
              name="department"
              value={department.departmentId}
              checked={selectedId === department.departmentId}
              onChange={() => setSelectedId(department.departmentId)}
              className="mt-1 mr-3 accent-blue-600"
            />
            <div>
              <p className="font-medium text-gray-900">{department.name}</p>
              <p className="text-sm text-gray-600">{department.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedId}
          className={`px-4 py-2 rounded-md text-white transition ${
            selectedId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default DepartmentChooseForm;
