import React from "react";
import { getLogoUrl } from "../../services/logoService";

const SponsorCard = ({ sponsor }) => {
  const logoUrl = getLogoUrl(sponsor.logoUrl);
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-lg p-6 flex flex-col items-center space-y-5 mb-6 text-gray-800 text-center">
      {/* Logo */}
      <img
        src={logoUrl}
        alt={sponsor.name}
        className="h-20 w-auto object-contain rounded-md border border-gray-200"
      />

      {/* Name & Industry */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold uppercase">{sponsor.name}</h2>
        <p className="text-sm text-gray-500">{sponsor.industry}</p>
        <span className="text-sm text-gray-500">"{sponsor.notes || " "}"</span>
        {sponsor.websiteLink && (
          <a
            href={sponsor.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {new URL(sponsor.websiteLink).hostname}
          </a>
        )}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-200" />

      {/* Sub Info */}
      <div className="grid grid-cols-1 gap-4 text-sm w-full items-center">
        {[
          { label: "Address", value: sponsor.address || "—" },
          { label: "Contact Person", value: sponsor.contactPersonName || "—" },
          {
            label: "Email",
            value: (
              <a
                href={`mailto:${sponsor.contactEmail}`}
                className="text-blue-600 hover:underline"
              >
                {sponsor.contactEmail || "—"}
              </a>
            ),
          },
          { label: "Phone", value: sponsor.contactPhone || "—" },
        ]
          .filter(Boolean)
          .map((info, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-gray-600 font-medium mb-0.5">
                {info.label}
              </div>
              <div className="text-gray-700">{info.value}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SponsorCard;
