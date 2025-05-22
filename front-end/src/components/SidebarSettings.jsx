import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-[280px] bg-white p-[30px_20px] border-r border-gray-100 box-border flex-shrink-0">
      <h2 className="text-3xl font-bold text-[#0d2c5a] mt-0 mb-10 pl-4">Settings</h2>
      <nav>
        <ul className="list-none p-0 m-0">
          <li>
            <NavLink
              to="/profile/account"
              className={({ isActive }) =>
                `block py-[15px] px-5 no-underline rounded-lg mb-2.5 text-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-[#0d2c5a] font-bold'
                    : 'text-gray-700 hover:bg-yellow-300 hover:text-black transition'
                }`
              }
            >
              Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/oldevents"
              className={({ isActive }) =>
                `block py-[15px] px-5 no-underline rounded-lg mb-2.5 text-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-[#0d2c5a] font-bold'
                    : 'text-gray-700 hover:bg-yellow-300 hover:text-black transition'
                }`
              }
            >
              Old Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile/notifications"
              className={({ isActive }) =>
                `block py-[15px] px-5 no-underline rounded-lg mb-2.5 text-lg font-medium transition-all ${
                  isActive
                    ? 'bg-blue-100 text-[#0d2c5a] font-bold'
                    : 'text-gray-700 hover:bg-yellow-300 hover:text-black transition'
                }`
              }
            >
              Notifications
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
