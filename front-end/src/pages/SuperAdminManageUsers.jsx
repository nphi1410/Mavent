import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { getEvents } from '../services/eventService';


function SuperAdminManageUsers() {

    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    return (
        <div className="py-10 w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Users</h1>
            <p className="text-gray-500 mb-6">Manage your users and their permissions</p>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h2 className="text-lg font-semibold mb-1 text-black">All Users</h2>
                <p className="text-sm text-gray-500 mb-4">View and manage all users from one place</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search users by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 sm:w-1/2 placeholder:text-gray-500"
                    />

                    <div className="relative w-full sm:w-48 border border-gray-300 rounded">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                        >
                            {statusFilter}
                            <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4 text-black" />
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                {statusOptions.map((status) => (
                                    <li
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setDropdownOpen(false);
                                        }}
                                        className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center"
                                    >
                                        {statusFilter === status && <span className="mr-2">✓</span>}
                                        {status}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="relative w-full sm:w-48 border border-gray-300 rounded">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                        >
                            {statusFilter}
                            <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4 text-black" />
                        </button>
                        {dropdownOpen && (
                            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                {statusOptions.map((status) => (
                                    <li
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setDropdownOpen(false);
                                        }}
                                        className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center"
                                    >
                                        {statusFilter === status && <span className="mr-2">✓</span>}
                                        {status}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200">
                        <thead>
                            <tr className="text-sm text-gray-500 border-b border-gray-200">
                                <th className="p-2 font-medium ">Users</th>
                                <th className="p-2 font-medium">Role</th>
                                <th className="p-2 font-medium">Status</th>
                                <th className="p-2 font-medium">Gender</th>
                                <th className="p-2 font-medium">Date Of Birth</th>
                                <th className="p-2 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr className="border-b border-gray-200">
                                <td className="p-2 font-medium text-black whitespace-nowrap"></td>
                                <td className="p-2 whitespace-nowrap text-gray-600"></td>
                                <td className="p-2 whitespace-nowrap text-gray-600"></td>
                                <td className="p-2 whitespace-nowrap text-gray-600"></td>
                                <td className="p-2 whitespace-nowrap text-gray-600">
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full"
                                    >
                                    </span>
                                </td>
                                <td className="p-2 whitespace-nowrap text-right flex justify-start items-center">
                                    <FontAwesomeIcon icon={faEllipsis} className="text-gray-500 cursor-pointer" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminManageUsers;
