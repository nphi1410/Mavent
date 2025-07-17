import React, { useEffect, useState } from "react";
import { getSponsors } from "../services/sponsorService";

const EventSponsorsPage = () => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSponsors();
      if (data) {
        setSponsors(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sponsors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.sponsorId}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-4">
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                <p className="text-sm text-gray-500">{sponsor.industry}</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {sponsor.contactPersonName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {sponsor.contactEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {sponsor.contactPhone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {sponsor.address}
              </p>
              <p>
                <span className="font-medium">Note:</span> {sponsor.notes}
              </p>
            </div>

            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-600 hover:underline text-sm"
            >
              Visit Website →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSponsorsPage;
