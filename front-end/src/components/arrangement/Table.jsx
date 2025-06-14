
const Table = ({ data = [] }) => {
  if (!data.length) {
    return <p className="text-gray-500 italic">No data available.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {headers.map((header) => (
                <td
                  key={`${index}-${header}`}
                  className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap"
                >
                  {row[header]}
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
