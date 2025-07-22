import React from "react";

const SponsorPagination = ({ page, setPage, totalPages }) => {
  return (
    <div className=" flex items-center gap-4 justify-between md:justify-end">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page <strong>{page + 1}</strong> of {totalPages}
      </span>
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
        disabled={page >= totalPages - 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default SponsorPagination;
