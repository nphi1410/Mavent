import React, { useEffect, useState } from "react";
import { getSponsorships } from "../services/sponsorshipService";
import SponsorshipCard from "../components/sponsorship/SponsorshipCard";
import { useNavigate, useParams } from "react-router-dom";

const SponsorshipPage = () => {
  const [sponsorship, setSponsorship] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

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

  const handleCreateSponsorship = () => {
    navigate(`create`);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Event Sponsorships
      </h2>
      <button
        onClick={() => handleCreateSponsorship()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mb-4 rounded"
      >
        Create Sponsorship +
      </button>
      <div className="space-y-6">
        {sponsorship.map((item) => (
          <SponsorshipCard item={item} key={item.eventSponsorshipId} />
        ))}
      </div>
    </div>
  );
};

export default SponsorshipPage;
