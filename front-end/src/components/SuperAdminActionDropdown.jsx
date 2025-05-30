import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

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
                <div className="absolute right-0 z-20 w-fit bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-2 text-sm font-semibold text-gray-500 border-b">
                        Actions
                    </div>
                    <ul className="text-sm text-gray-700 divide-y">
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
                        <li
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={onDelete}
                        >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                            Delete
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SuperAdminActionDropdown;
