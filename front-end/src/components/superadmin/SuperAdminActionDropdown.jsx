import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEye, faPen } from '@fortawesome/free-solid-svg-icons';

const SuperAdminActionDropdown = ({ isOpen, onToggle, onView, onEdit, onDelete }) => {
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={onToggle}
                className="p-2 text-gray-600 hover:text-black rounded-md cursor-pointer"
            >
                <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-fit bg-white border border-gray-200 rounded-xl shadow-xl z-[99999]"
                >
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 border-b border-gray-300">
                        Actions
                    </div>
                    <ul className="text-sm text-gray-900 divide-y">
                        <li
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={onView}
                        >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                            View
                        </li>
                        <li
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={onEdit}
                        >
                            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                            Edit
                        </li>
                    </ul>
                </div>
            )}

        </div>
    );
};

export default SuperAdminActionDropdown;
