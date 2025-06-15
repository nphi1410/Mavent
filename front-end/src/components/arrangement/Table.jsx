import React from "react";

const formatHeader = (header) =>
  header
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

const formatValue = (value) => {
  if (typeof value === "boolean") return value ? "✅" : "❌";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return value;
};

const Table = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-500 italic">
        No data available.
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white text-sm text-gray-700">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600"
              >
                {formatHeader(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="border-b border-gray-100 transition-colors duration-100 hover:bg-blue-50"
            >
              {headers.map((header) => (
                <td
                  key={`${idx}-${header}`}
                  className="px-5 py-3 whitespace-nowrap text-sm text-gray-800"
                >
                  {formatValue(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
