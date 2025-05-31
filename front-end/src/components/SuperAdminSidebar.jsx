import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCalendarDays, faBell, faGauge, faUsers, faChevronRight, faChevronDown, faUser, faGear, faPersonShelter } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


function SuperAdminSidebar() {
  const [eventOpen, setEventOpen] = useState(true);
  const [userOpen, setUserOpen] = useState(true);

  return (
    <div className="w-64 h-screen py-16 bg-white shadow-md flex flex-col justify-between border-r border-gray-200">
      {/* Top Section */}
      <div>

        {/* Dashboard */}
        <Link to="/superadmin" className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-800">
          <FontAwesomeIcon icon={faGauge} />
          Dashboard
        </Link>

        {/* Manage Events */}
        <div>
          <div
            onClick={() => setEventOpen(!eventOpen)}
            className="p-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer text-gray-800"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCalendarDays} />
              Manage Events
            </div>
            <FontAwesomeIcon icon={eventOpen ? faChevronDown : faChevronRight} />
          </div>
          {eventOpen && (
            <div className="pl-12">
              <Link to="/superadmin/events" className="py-2 flex items-center gap-3 hover:text-black cursor-pointer text-gray-600">
                <FontAwesomeIcon icon={faCalendar} />
                All Events
              </Link>
              <div className="py-2 flex items-center gap-3 hover:text-black cursor-pointer text-gray-600">
                <FontAwesomeIcon icon={faBell} />
                Pending Events
              </div>
            </div>
          )}
        </div>

        {/* Manage Users */}
        <div>
          <div
            onClick={() => setUserOpen(!userOpen)}
            className="p-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer text-gray-800"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} />
              Manage Users
            </div>
            <FontAwesomeIcon icon={userOpen ? faChevronDown : faChevronRight} />
          </div>
          {userOpen && (
            <div className="pl-12">
              <Link to="/superadmin/users" className="py-2 flex items-center gap-3 hover:text-black cursor-pointer text-gray-600">
                <FontAwesomeIcon icon={faUsers} />
                All Users
              </Link>
              <div className="py-2 flex items-center gap-3 hover:text-black cursor-pointer text-gray-600">
                <FontAwesomeIcon icon={faPersonShelter} />
                Invitations
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminSidebar;