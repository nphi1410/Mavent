import React, { useEffect, useState } from "react";
import { getSponsorshipPackages } from "../services/sponsorshipService";
import { useParams } from "react-router-dom";
import SubmitPackageModal from "../components/sponsorship/SubmitPackageModal";
import SponsorshipPackage from "../components/sponsorship/sponsorshipPackage";

const SponsorshipPackagesPage = () => {
  const { id } = useParams();
  const [packages, setPackages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const fetchPackages = async () => {
    try {
      const data = await getSponsorshipPackages(id);
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [id]);

  const handleCreate = () => {
    setSelectedPackage(null);
    setIsOpen(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPackage(null);
  };

  return (
    <div className="p-4">
      <div className="w-full flex justify-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse min-w-[300px] text-center leading-tight">
          Sponsorship Packages
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Create New Card */}
        <div
          onClick={() => handleCreate()}
          className="group rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 shadow-sm hover:border-indigo-500 hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-indigo-600"
        >
          <div className="text-4xl font-bold group-hover:scale-110 transition">
            ＋
          </div>
          <div className="mt-2 text-base font-medium">Create New Package</div>
        </div>

        {/* Package Cards */}
        {packages.map((pkg) => (
          <SponsorshipPackage
            key={pkg.packageId}
            pkg={pkg}
            onEdit={() => handleEdit(pkg)}
            onReload={() => fetchPackages()}
            setSelectedPackage={setSelectedPackage}
          />
        ))}
      </div>

      {/* Modal */}
      <SubmitPackageModal
        key={selectedPackage?.packageId || "create"}
        isOpen={isOpen}
        onClose={handleClose}
        onCreated={fetchPackages}
        existingPackage={selectedPackage}
        eventId={id}
      />
    </div>
  );
};

export default SponsorshipPackagesPage;
