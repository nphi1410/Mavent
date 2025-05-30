import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminHeader from '../components/SuperAdminHeader';
import SuperAdminActionDropdown from '../components/SuperAdminActionDropdown';

function SuperAdminManageUsers() {
    // Sample user data
    const users = [
        {
            id: 1, name: "John Doe", role: "Admin", status: "Active", gender: "Male", dateOfBirth: "1990-05-15",
        },
        {
            id: 2, name: "Jane Smith", role: "User", status: "Inactive", gender: "Female", dateOfBirth: "1985-08-22",
        },
        {
            id: 3, name: "Alex Johnson", role: "User", status: "Pending", gender: "Non-binary", dateOfBirth: "1995-03-10",
        },
        {
            id: 4, name: "Jane Smith", role: "User", status: "Inactive", gender: "Female", dateOfBirth: "1985-08-22",
        },
        {
            id: 5, name: "Jane Smith", role: "User", status: "Inactive", gender: "Female", dateOfBirth: "1985-08-22",
        },
        {
            id: 6, name: "Jane Smith", role: "User", status: "Inactive", gender: "Female", dateOfBirth: "1985-08-22",
        },
        {
            id: 7, name: "Jane Smith", role: "User", status: "Inactive", gender: "Female", dateOfBirth: "1985-08-22",
        },
    ];

    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    // Sample status and role options
    const statusOptions = ["All Statuses", "Active", "Inactive", "Pending"];
    const rolesOptions = ["All Roles", "Admin", "User"];

    // Hàm lọc người dùng
    const filterUsers = (users, searchTerm, filters) => {
        return users.filter((user) => {
            // Kiểm tra tìm kiếm theo tên
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            // Kiểm tra các bộ lọc (status, role)
            const matchesFilters = Object.entries(filters).every(([filterType, filterValue]) => {
                // Nếu filterValue là "All Statuses" hoặc "All Roles", bỏ qua bộ lọc
                return (
                    filterValue === (filterType === "status" ? "All Statuses" : "All Roles") ||
                    user[filterType] === filterValue
                );
            });
            return matchesSearch && matchesFilters;
        });
    };

    // Sử dụng useMemo để tối ưu hóa hiệu suất khi lọc
    const filteredUsers = useMemo(() => {
        const isNoFilterApplied =
            searchTerm.trim() === "" &&
            statusFilter === "All Statuses" &&
            roleFilter === "All Roles";

        return isNoFilterApplied
            ? users
            : filterUsers(users, searchTerm, {
                status: statusFilter,
                role: roleFilter,
            });
    }, [users, searchTerm, statusFilter, roleFilter]);

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className="flex flex-col flex-1">
                <SuperAdminHeader />
                <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
                    <div className="py-10 w-full">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Users</h1>
                        <p className="text-gray-500 mb-6">Manage your users and their permissions</p>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h2 className="text-2xl font-semibold mb-1 text-black">All Users</h2>
                            <p className="text-sm text-gray-500 mb-4">View and manage all users from one place</p>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search user by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 sm:w-1/2 placeholder:text-gray-500"
                                />

                                <div className="relative w-full sm:w-48 border border-gray-300 rounded">
                                    <button
                                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                                    >
                                        {roleFilter}
                                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4 text-black" />
                                    </button>
                                    {roleDropdownOpen && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                            {rolesOptions.map((role) => (
                                                <li
                                                    key={role}
                                                    onClick={() => {
                                                        setRoleFilter(role);
                                                        setRoleDropdownOpen(false);
                                                    }}
                                                    className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center"
                                                >
                                                    {roleFilter === role && <span className="mr-2">✓</span>}
                                                    {role}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="relative w-full sm:w-48 border border-gray-300 rounded">
                                    <button
                                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                                    >
                                        {statusFilter}
                                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4 text-black" />
                                    </button>
                                    {statusDropdownOpen && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                            {statusOptions.map((status) => (
                                                <li
                                                    key={status}
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setStatusDropdownOpen(false);
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
                                            <th className="p-2 font-medium">Users</th>
                                            <th className="p-2 font-medium">Role</th>
                                            <th className="p-2 font-medium">Status</th>
                                            <th className="p-2 font-medium">Gender</th>
                                            <th className="p-2 font-medium">Date Of Birth</th>
                                            <th className="p-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-gray-200">
                                                    <td className="p-2 font-medium text-black whitespace-nowrap">{user.name}</td>
                                                    <td className="p-2 whitespace-nowrap text-gray-600">{user.role}</td>
                                                    <td className="p-2 whitespace-nowrap text-gray-600">{user.status}</td>
                                                    <td className="p-2 whitespace-nowrap text-gray-600">{user.gender}</td>
                                                    <td className="p-2 whitespace-nowrap text-gray-600">
                                                        <span className="text-xs font-semibold px-2 py-1 rounded-full">
                                                            {user.dateOfBirth}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap text-right flex justify-start items-center">
                                                        <SuperAdminActionDropdown
                                                            isOpen={openId === user.id}
                                                            onToggle={() => setOpenId(openId === user.id ? null : user.id)}
                                                            onView={() => {
                                                                alert(`Viewing ${user.name}`);
                                                                setOpenId(null);
                                                            }}
                                                            onEdit={() => {
                                                                alert(`Editing ${user.name}`);
                                                                setOpenId(null);
                                                            }}
                                                            onDelete={() => {
                                                                alert(`Deleting ${user.name}`);
                                                                setOpenId(null);
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SuperAdminManageUsers;