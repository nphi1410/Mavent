import Select from "react-select";
import { getLogoUrl } from "../../services/LogoService";

const SponsorSelect = ({ sponsors, value, onChange, onCreateNew }) => {
  const CREATE_NEW_OPTION = {
    value: "__create_new__",
    label: "➕ Create New Sponsor",
    data: {},
  };

  const options = [
    CREATE_NEW_OPTION,
    ...sponsors.map((sponsor) => ({
      value: sponsor.sponsorId,
      label: sponsor.name,
      data: sponsor,
    })),
  ];

  const formatOptionLabel = ({ label, data }) => {
    if (label === CREATE_NEW_OPTION.label) {
      return <div className="text-blue-600 font-semibold text-sm">{label}</div>;
    }

    return (
      <div className="flex items-center gap-4">
        {data.logoUrl ? (
          <img
            src={getLogoUrl(data.logoUrl)}
            alt={label}
            className="w-10 h-10 rounded-md object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-200 border border-gray-200 shadow-sm flex items-center justify-center text-xs text-gray-500">
            N/A
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-base font-medium text-gray-800">{label}</span>
          <span className="text-sm text-gray-500">{data.industry}</span>
        </div>
      </div>
    );
  };

  const handleChange = (selected) => {
    if (selected?.value === "__create_new__") {
      onCreateNew?.(); // Trigger modal or form if defined
      onChange(null);
    } else {
      onChange(selected?.value);
    }
  };

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

  const selectedOption = options.find((o) => o.value === value) || null;
  return (
    <div className="w-full">
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        formatOptionLabel={formatOptionLabel}
        placeholder="Select a sponsor..."
        styles={customStyles}
        isClearable
      />
    </div>
  );
};

export default SponsorSelect;
