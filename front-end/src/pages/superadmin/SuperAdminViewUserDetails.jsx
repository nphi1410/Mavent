import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faPhone, faIdCard, faVenusMars,
    faBirthdayCake, faHashtag
} from '@fortawesome/free-solid-svg-icons';
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import { getAccountById } from '../../services/accountService';

const SuperAdminViewUserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getAccountById(id);
                setUser(response);
            } catch (error) {
                console.error(`Error fetching user with ID ${id}:`, error);
            }
        };
        fetchUser();
    }, [id]);

    if (!user) {
        return <div className="p-10">Loading user details...</div>;
    }

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className="flex flex-col flex-1">
                <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
                    <div className="py-10 w-full">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">User Details</h1>
                        <p className="text-gray-500 mb-6">View and manage user details</p>
                        <div className="w-full max-w-5xl bg-white shadow-md rounded-xl p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                        {user.avatarUrl ? (
                                            <img
                                                src={`${user.avatarUrl}`}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">No Avatar</span>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">{user.fullName}</h1>
                                        <p className="text-gray-500">@{user.username}</p>
                                        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                                            {user.systemRole}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-black mb-6">User Information</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm">
                                <li className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 mt-1" />
                                    <span>
                                        <strong>Email:</strong><br />
                                        {user.email || 'N/A'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-600 mt-1" />
                                    <span>
                                        <strong>Phone Number:</strong><br />
                                        {user.phoneNumber || 'N/A'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faIdCard} className="text-gray-600 mt-1" />
                                    <span>
                                        <strong>Student ID:</strong><br />
                                        {user.studentId || 'N/A'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faHashtag} className="text-gray-600 mt-1" />
                                    <span>
                                        <strong>Account ID:</strong><br />
                                        {user.accountId || 'N/A'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faVenusMars} className="text-gray-600 mt-1" />
                                    <span>
                                        <strong>Gender:</strong><br />
                                        {user.gender || 'N/A'}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <FontAwesomeIcon icon={faBirthdayCake} className="text-gray-600 mt-1" />
                                    <span>
                                        <strong>Date of Birth:</strong><br />
                                        {user.dateOfBirth || 'N/A'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminViewUserDetails;
