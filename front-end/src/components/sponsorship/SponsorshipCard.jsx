import React from "react";
import { vietnameseDate } from "../../utils/DateConvert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { deleteSponsorship } from "../../services/SponsorshipService";

const SponsorshipCard = ({ item }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`create`, {
      state: {
        sponsorship: item,
      },
    });
  };
  const handleDelete = () => {
    try {
      deleteSponsorship(item.eventSponsorshipId);
      alert("Delete successfully!");
      window.location.reload();
    } catch (error) {
      alert("Delete failed!");
      console.log(error);
    }
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex gap-2 items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Sponsorship #{item.eventSponsorshipId}
          </h2>
          <button
            onClick={() => handleEdit()}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faPen} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete()}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Delete</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
            {item.amount.toLocaleString()}₫
          </div>
          <div className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {item.status}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm text-slate-700">
        {/* LEFT COLUMN - Single-column stack */}
        <div className="flex flex-col gap-4">
          <Detail label="Event" value={item.eventName} />
          <Detail label="Sponsor" value={item.sponsorName} />
          <Detail label="Contact ID" value={item.mainContactAccountId} />
          <Detail label="Contact Name" value={item.accountName} />
        </div>

        {/* RIGHT COLUMN - Span 2 columns */}
        <div className="sm:col-span-2 flex flex-col gap-4">
          <Detail
            label="Package"
            value={
              item.packageName || (
                <span className="italic text-gray-400">Not selected</span>
              )
            }
          />
          <Detail
            label="Period"
            value={
              item.startDate && item.endDate ? (
                `${vietnameseDate(item.startDate)} → ${vietnameseDate(
                  item.endDate
                )}`
              ) : (
                <span className="italic text-gray-400">Not scheduled</span>
              )
            }
          />
          <Detail
            label="Agreement"
            value={
              item.agreementDocumentUrl ? (
                <a
                  href={item.agreementDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium underline"
                >
                  View Agreement
                </a>
              ) : (
                <span className="italic text-gray-400">Not available</span>
              )
            }
          />
          <Detail
            label="Notes"
            value={
              item.notes || <span className="italic text-gray-400">None</span>
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-gray-400">
        Created: {new Date(item.createdAt).toLocaleString()} &nbsp;|&nbsp;
        Updated: {new Date(item.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

// Reusable detail row
const Detail = ({ label, value }) => (
  <div>
    <div className="text-slate-500 font-medium">{label}</div>
    <div className="text-slate-800">{value}</div>
  </div>
);

export default SponsorshipCard;
