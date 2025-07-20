import Select from "react-select";

const SponsorSelect = ({ sponsors, onChange }) => {
  const options = sponsors.map((sponsor) => ({
    value: sponsor.sponsorId,
    label: sponsor.name,
    data: sponsor,
  }));

  const formatOptionLabel = ({ label, data }) => (
    <div className="flex items-center gap-4">
      <img
        src={data.logoUrl}
        alt={label}
        className="w-10 h-10 rounded-md object-cover border border-gray-200 shadow-sm"
      />
      <div className="flex flex-col">
        <span className="text-base font-medium text-gray-800">{label}</span>
        <span className="text-sm text-gray-500">{data.industry}</span>
      </div>
    </div>
  );

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      borderColor: "#CBD5E0",
      padding: "0.25rem 0.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4F46E5",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#DBEAFE"
        : state.isFocused
        ? "#F3F4F6"
        : "white",
      color: "#1F2937",
      padding: "10px 15px",
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
    }),
  };

  return (
    <div className="w-full">
      <Select
        options={options}
        onChange={(selected) => onChange(selected?.value)}
        formatOptionLabel={formatOptionLabel}
        placeholder="Select a sponsor..."
        styles={customStyles}
        isClearable
      />
    </div>
  );
};

export default SponsorSelect;
