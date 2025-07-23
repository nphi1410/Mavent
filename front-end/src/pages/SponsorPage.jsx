import React, { useEffect, useState } from "react";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminSidebar from "../components/superadmin/SuperAdminSidebar";
import {
  createSponsor,
  deleteSponsor,
  filterSponsors,
} from "../services/SponsorService";
import SponsorTable from "../components/sponsorship/SponsorTable";
import SponsorSearch from "../components/sponsorship/SponsorSearch";
import SponsorPagination from "../components/sponsorship/SponsorPagination";
import CreateSponsorModal from "../components/sponsorship/CreateSponsorModal";

const SponsorListPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("updated_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const fetchSponsors = async (filters = {}) => {
    const response = await filterSponsors({
      name: filters.name ?? name,
      industry: filters.industry ?? industry,
      page,
      size,
      sort: `${sortField},${sortDirection}`,
    });

    setSponsors(response.content);
    setTotalPages(response.page.totalPages);
  };

  useEffect(() => {
    fetchSponsors();
  }, [page, size, sortField, sortDirection]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSponsors({ name, industry });
    }, 500);
    return () => clearTimeout(timeout);
  }, [name, industry]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSponsor(null);
  };

  const handleCreate = async (formData) => {
    try {
      await createSponsor(formData);
      fetchSponsors();
      alert("Sponsor submitted successfully.");
      handleClose();
    } catch (error) {
      alert("Failed to submit sponsor.");
      console.error("Failed to submit sponsor:", error);
    }
  };

  const handleDelete = async (sponsorId) => {
    if (window.confirm("Are you sure you want to delete this sponsor?")) {
      try {
        await deleteSponsor(sponsorId);
        fetchSponsors();
        alert("Sponsor deleted successfully.");
      } catch (error) {
        alert("Failed to delete sponsor because is sponsoring an event.");
        console.error("Failed to delete sponsor:", error);
      }
    }
  };

  const handleEdit = (sponsor) => {
    setSelectedSponsor(sponsor);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex-1 p-6 space-y-6 overflow-auto bg-gray-50 mt-12">
        <h1 className="text-3xl font-semibold">Sponsors</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded shadow-sm ">
          <div className="flex-1/4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => setIsOpen(true)}
            >
              Create Sponsor
            </button>
          </div>
          <div className="flex-1/2">
            <SponsorSearch
              name={name}
              setName={setName}
              industry={industry}
              setIndustry={setIndustry}
              setPage={setPage}
            />
          </div>
          <div className="flex-1/4">
            <SponsorPagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <SponsorTable
            sponsors={sponsors}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>
      </div>
      <CreateSponsorModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleCreate}
        sponsor={selectedSponsor}
      />
    </>
  );
};

export default SponsorListPage;
