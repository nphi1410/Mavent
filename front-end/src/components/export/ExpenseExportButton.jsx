// src/components/ExpenseExportButton.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { exportExpensesToExcel } from '../../services/ExpenseExportService'; // Adjust path as needed

function ExpenseExportButton({ eventId, fileName = 'expenses_report' }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setLoading(true);
        setError(null);
        try {
            await exportExpensesToExcel(eventId);
        } catch (err) {
            setError('Failed to export data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleExport}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200
                           ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                ) : (
                    <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                )}
                Export to Excel
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}

export default ExpenseExportButton;