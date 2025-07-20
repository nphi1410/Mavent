import Select from "react-select";

const PackageSelect = ({ packages, onChange }) => {
  const options = packages.map((pkg) => ({
    value: pkg.packageId,
    label: pkg.name,
    data: pkg,
  }));

  const formatOptionLabel = ({ label, data }) => (
    <div className="flex flex-row gap-1">
      <span className="text-base font-medium text-gray-800">{label}</span>
      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full w-fit">
        {data.amount.toLocaleString()} VND
      </span>
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
        ? "#D1FAE5"
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
        placeholder="Select a package..."
        styles={customStyles}
        isClearable
      />
    </div>
  );
};

export default PackageSelect;
