import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteSponsorshipPackage } from "../../services/SponsorshipService";

const SponsorshipPackage = ({ pkg, onEdit, onReload, setSelectedPackage }) => {
  const handleDelete = async () => {
    try {
      setSelectedPackage(null);
      await deleteSponsorshipPackage(pkg.packageId);
      await onReload();
      alert("Delete successfully!");
    } catch (error) {
      alert("Delete failed!");
      console.error("Error deleting sponsorship package:", error);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 px-5 pt-3 pb-5 bg-white shadow hover:shadow-md transition flex flex-col justify-between h-full space-y-4">
      <div className="flex justify-center gap-0.5">
        <button
          onClick={onEdit}
          className="inline-flex flex-1/2 justify-center items-center gap-1 px-3 py-1 text-sm text-indigo-600 border border-indigo-200 rounded-l-lg hover:bg-indigo-50 transition"
        >
          <FontAwesomeIcon icon={faPen} />
          Edit
        </button>
        <button
          onClick={() => handleDelete()}
          className="inline-flex flex-1/2 justify-center items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-200 rounded-r-lg hover:bg-red-50 transition"
        >
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </button>
      </div>
      {/* Title */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
        <p className="text-md text-gray-600 italic">{pkg.description}</p>
      </div>

      {/* Benefits */}
      <ul className="text-sm text-gray-800 space-y-1">
        {pkg.benefits?.split(",").map((benefit, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-500">🌟</span>
            <span>{benefit.trim()}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-t-gray-200 pt-4 mt-auto">
        <span className="text-lg font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-xl">
          {pkg.amount.toLocaleString()} VND
        </span>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${
            pkg.isActive
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {pkg.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

export default SponsorshipPackage;
