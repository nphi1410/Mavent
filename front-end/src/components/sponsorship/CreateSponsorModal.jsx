import React, { useState, useRef, useEffect } from "react";

const CreateSponsorModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    website: "",
    industry: "",
    address: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // also clears create option externally
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["name", "industry", "contactPersonName"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose(); // clear modal and also clear "Create New" from parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-[80px] overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl relative mb-10"
      >
        <h2 className="text-xl font-bold mb-4">Create New Sponsor</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Industry *</label>
              <input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.industry && (
                <p className="text-red-500 text-sm">{errors.industry}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Website</label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Logo URL</label>
              <input
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Contact Person *</label>
              <input
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.contactPersonName && (
                <p className="text-red-500 text-sm">
                  {errors.contactPersonName}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Contact Phone</label>
              <input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Sponsor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSponsorModal;
