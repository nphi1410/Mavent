import React from "react";
import { getLogoUrl } from "../../services/logoService";
import { vietnameseDate } from "../../utils/DateConvert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const SponsorTable = ({ sponsors, handleSort, handleDelete, handleEdit }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th
              className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-blue-600"
              onClick={() => handleSort("name")}
            >
              Name
            </th>
            <th
              className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-blue-600"
              onClick={() => handleSort("industry")}
            >
              Industry
            </th>
            <th className="px-4 py-3 text-left">Address</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Created Account</th>
            <th
              className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-blue-600"
              onClick={() => handleSort("created_at")}
            >
              Created At
            </th>
            <th
              className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-blue-600"
              onClick={() => handleSort("updated_at")}
            >
              Updated At
            </th>
            <th className="px-4 py-3 text-left">Deleted</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sponsors.map((sponsor) => (
            <tr key={sponsor.sponsorId} className="hover:bg-gray-50">
              <td className="px-4 py-2 flex items-center gap-2">
                {sponsor.logoUrl ? (
                  <img
                    src={getLogoUrl(sponsor.logoUrl)}
                    alt={sponsor.name}
                    className="w-10 h-10 rounded-md object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                    N/A
                  </div>
                )}
                {sponsor.name}
              </td>
              <td className="px-4 py-2">{sponsor.industry}</td>
              <td className="px-4 py-2">{sponsor.address}</td>
              <td className="px-4 py-2">{sponsor.contactEmail}</td>
              <td className="px-4 py-2">{sponsor.contactPhone}</td>
              <td className="px-4 py-2">{sponsor.createdByAccountId}</td>
              <td className="px-4 py-2 text-gray-500">
                {vietnameseDate(sponsor.createdAt)}
              </td>
              <td className="px-4 py-2 text-gray-500">
                {vietnameseDate(sponsor.updatedAt)}
              </td>
              <td className="px-4 py-2">{sponsor.isDeleted ? "Yes" : "No"}</td>
              <td className="px-4 py-2">
                <div className="flex gap-3">
                  <button
                    className=" rounded-full hover:bg-blue-100 text-blue-600 transition"
                    title="Edit Sponsor"
                    onClick={() => handleEdit(sponsor)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className=" rounded-full hover:bg-red-100 text-red-600 transition"
                    title="Delete Sponsor"
                    onClick={() => handleDelete(sponsor.sponsorId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SponsorTable;
