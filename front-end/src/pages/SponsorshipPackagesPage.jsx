import React, { useEffect, useState } from "react";
import { getSponsorshipPackages } from "../services/sponsorshipService";

const SponsorshipPackagesPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSponsorshipPackages();
      if (data) {
        setPackages(data);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="p-4">
      <div className="w-full flex justify-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse min-w-[300px] text-center leading-tight">
          Sponsorship Packages
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {packages.map((pkg, index) => {
          const gradients = [
            "from-yellow-300 via-orange-400 to-red-500",
            "from-sky-300 via-indigo-400 to-purple-500",
            "from-green-300 via-emerald-400 to-teal-500",
            "from-pink-300 via-rose-400 to-red-400",
          ];
          const gradient = gradients[index % gradients.length];

          return (
            <div
              key={pkg.packageId}
              className={`group relative overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-white transition transform hover:scale-[1.02]`}
            >
              {/* Glowing Background Animation */}
              <div
                className={`absolute inset-0 blur-2xl opacity-40 group-hover:opacity-60 transition duration-700 bg-gradient-to-r ${gradient}`}
              ></div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>

                <p className="text-md text-gray-600 italic mb-3">
                  {pkg.description}
                </p>

                <ul className="text-sm text-gray-800 space-y-1 mb-4">
                  {pkg.benefits.split(",").map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 animate-bounce">
                        🌟
                      </span>
                      <span>{benefit.trim()}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-xl">
                    ${pkg.amount.toLocaleString()}
                  </span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      pkg.isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {pkg.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Max Sponsors: {pkg.maxSponsors}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorshipPackagesPage;
