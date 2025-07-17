import React, { useEffect, useState } from "react";
import { getSponsorships } from "../services/sponsorshipService";

const SponsorshipPage = () => {
  const [sponsorship, setSponsorship] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSponsorships();
      if (data) {
        setSponsorship(data);
        console.log(data);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Event Sponsorships
      </h2>

      <div className="space-y-6">
        {sponsorship.map((item) => (
          <div
            key={item.eventSponsorshipId}
            className="border border-gray-200 rounded-2xl p-6 shadow bg-gradient-to-br from-white via-slate-50 to-slate-100 hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Sponsorship #{item.eventSponsorshipId}
              </h3>
              <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full font-bold">
                {item.amount.toLocaleString()}₫
              </span>
            </div>

            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Event ID:</span> {item.eventId}
              </p>
              <p>
                <span className="font-medium">Sponsor ID:</span>{" "}
                {item.sponsorId}
              </p>
              <p>
                <span className="font-medium">Package ID:</span>{" "}
                {item.packageId ?? (
                  <span className="italic text-gray-400">Not selected</span>
                )}
              </p>
              <p>
                <span className="font-medium">Start - End:</span>{" "}
                {item.startDate && item.endDate ? (
                  `${item.startDate} → ${item.endDate}`
                ) : (
                  <span className="italic text-gray-400">Not scheduled</span>
                )}
              </p>
              <p>
                <span className="font-medium">Contact Account ID:</span>{" "}
                {item.mainContactAccountId}
              </p>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">Notes:</span>{" "}
                {item.notes}
              </p>

              <p className="mt-1">
                <span className="font-medium text-gray-700">Agreement:</span>{" "}
                {item.agreementDocumentUrl ? (
                  <a
                    href={item.agreementDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Agreement
                  </a>
                ) : (
                  <span className="italic text-gray-400">Not available</span>
                )}
              </p>
            </div>

            <div className="mt-3 text-xs text-gray-400">
              Created: {new Date(item.createdAt).toLocaleString()} | Updated:{" "}
              {new Date(item.updatedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorshipPage;
