import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import SuperAdminHeader from '../../components/superadmin/SuperAdminHeader';
import SuperAdminActionDropdown from '../../components/superadmin/SuperAdminActionDropdown';
import { getAllAccounts } from '../../services/accountService';

function SuperAdminManageUsers() {
    const [users, setUsers] = useState([]);
    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL ROLES");
    const [genderFilter, setGenderFilter] = useState("ALL GENDERS");
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const navigate = useNavigate();

    const rolesOptions = ["ALL ROLES", "SUPER_ADMIN", "USER"];
    const genderOptions = ["ALL GENDERS", "MALE", "FEMALE", "OTHER"];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllAccounts();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filterUsers = (users, searchTerm, role, gender) => {
        return users.filter((user) => {
            const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = role === "ALL ROLES" || user.systemRole === role;
            const matchesGender = gender === "ALL GENDERS" || user.gender === gender;
            return matchesSearch && matchesRole && matchesGender;
        });
    };

    const filteredUsers = useMemo(() => {
        const noFilters =
            searchTerm.trim() === "" &&
            roleFilter === "ALL ROLES" &&
            genderFilter === "ALL GENDERS";
        return noFilters
            ? users
            : filterUsers(users, searchTerm, roleFilter, genderFilter);
    }, [users, searchTerm, roleFilter, genderFilter]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

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
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded px-3 py-2 sm:w-1/2 placeholder:text-gray-500"
                                />

                                {/* Role filter */}
                                <div className="relative w-full sm:w-48">
                                    <button
                                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                                    >
                                        {roleFilter}
                                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4" />
                                    </button>
                                    {roleDropdownOpen && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                            {rolesOptions.map((role) => (
                                                <li
                                                    key={role}
                                                    onClick={() => {
                                                        setRoleFilter(role);
                                                        setRoleDropdownOpen(false);
                                                        setCurrentPage(1);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                >
                                                    {roleFilter === role && <span className="mr-2">✓</span>}
                                                    {role}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Gender filter */}
                                <div className="relative w-full sm:w-48">
                                    <button
                                        onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                                        className="border border-gray-300 rounded px-3 py-2 w-full flex justify-between items-center text-black"
                                    >
                                        {genderFilter}
                                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4" />
                                    </button>
                                    {genderDropdownOpen && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow">
                                            {genderOptions.map((gender) => (
                                                <li
                                                    key={gender}
                                                    onClick={() => {
                                                        setGenderFilter(gender);
                                                        setGenderDropdownOpen(false);
                                                        setCurrentPage(1);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                >
                                                    {genderFilter === gender && <span className="mr-2">✓</span>}
                                                    {gender}
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
                                            <th className="p-2 font-medium">Full Name</th>
                                            <th className="p-2 font-medium">Email</th>
                                            <th className="p-2 font-medium">Role</th>
                                            <th className="p-2 font-medium">Gender</th>
                                            <th className="p-2 font-medium">Date Of Birth</th>
                                            <th className="p-2 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.length > 0 ? (
                                            currentUsers.map((user) => (
                                                <tr key={user.accountId} className="border-b border-gray-200">
                                                    <td className="p-2 font-medium text-black whitespace-nowrap">{user.fullName}</td>
                                                    <td className="p-2 text-gray-600 whitespace-nowrap">{user.email}</td>
                                                    <td className="p-2 text-gray-600 whitespace-nowrap">{user.systemRole}</td>
                                                    <td className="p-2 text-gray-600 whitespace-nowrap">{user.gender}</td>
                                                    <td className="p-2 text-gray-600 whitespace-nowrap">{user.dateOfBirth}</td>
                                                    <td className="p-2 whitespace-nowrap text-right flex justify-start items-center">
                                                        <SuperAdminActionDropdown
                                                            isOpen={openId === user.accountId}
                                                            onToggle={() => setOpenId(openId === user.accountId ? null : user.accountId)}
                                                            onView={() => {
                                                                navigate(`/superadmin/user-detail/${user.accountId}`);
                                                                setOpenId(null);
                                                            }}
                                                            onEdit={() => {
                                                                alert(`Editing ${user.fullName}`);
                                                                setOpenId(null);
                                                            }}
                                                            onDelete={() => {
                                                                alert(`Deleting ${user.fullName}`);
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-4 space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100 text-black'}`}
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100 text-black'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SuperAdminManageUsers;
