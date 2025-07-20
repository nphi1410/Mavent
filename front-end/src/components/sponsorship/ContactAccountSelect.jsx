import Select from "react-select";

const ContactAccountSelect = ({ accounts, onChange }) => {
  const options = accounts.map((account) => ({
    value: account.accountId,
    label: account.fullName,
    data: account,
  }));

  const formatOptionLabel = ({ label, data }) => (
    <div className="flex items-center gap-4 p-1">
      <img
        src={data.avatarUrl}
        alt={label}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
      />
      <div className="flex-1">
        <div className="text-base font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-500">{data.email}</div>
      </div>
      <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
        {data.gender}
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
      padding: "12px 16px",
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
        placeholder="Select a contact..."
        styles={customStyles}
        isClearable
      />
    </div>
  );
};

export default ContactAccountSelect;
