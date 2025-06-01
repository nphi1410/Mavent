import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarDays, faBell } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navLinkClass = ({ isActive }) => 
    `block py-[15px] px-5 no-underline rounded-lg mb-2.5 text-lg font-medium transition-all ${
      isActive
        ? 'bg-blue-100 text-[#0d2c5a] font-bold'
        : 'text-gray-700 hover:text-[#0d2c5a] transition'
    }`;

  return (
    <aside className="w-64 bg-white px-4 py-8 border-r border-gray-100 box-border flex-shrink-0">
      <h2 className="text-3xl font-bold text-[#0d2c5a] mt-0 mb-10 pl-4">User Center</h2>
      <nav>
        <ul className="list-none p-0 m-0">
          <li>
            <NavLink
              to="/profile/account"
              className={navLinkClass}
            >
              <div className="flex items-center gap-3">
                {/* <FontAwesomeIcon icon={faUser} className="w-5 h-5" /> */}
                <span>Account</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/events"
              className={({ isActive }) =>
                `block py-[15px] px-5 no-underline rounded-lg mb-2.5 text-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-[#0d2c5a] font-bold'
                    : 'text-gray-700 hover:text-black transition'
                }`
              }
            >
              Past Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/tasks"
              className={({ isActive }) =>
                `block py-[15px] px-5 no-underline rounded-lg mb-2.5 text-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-[#0d2c5a] font-bold'
                    : 'text-gray-700 hover:text-black transition'
                }`
              }
            >
              Tasks
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
