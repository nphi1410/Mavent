import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers
} from '@fortawesome/free-solid-svg-icons';

// Sidebar component for admin dashboard
const Sidebar = ({ activeItem }) => {
  // Main section items
  const mainItems = [
    {
      name: 'Members',
      icon: <FontAwesomeIcon icon={faUsers} />,
      link: '/members',
    }
  ];
  // Không hiển thị phần Settings
  const settingsItems = [];

  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 pt-16">
      <div className="px-4 py-6">
        <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase">Main</h2>
        <ul className="space-y-2">
          {mainItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.link}
                className={`flex items-center p-3 text-sm font-medium rounded-lg hover:bg-gray-100 ${
                  activeItem === item.name.toLowerCase()
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-900'
                }`}
              >
                <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                <span className="ml-3">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <hr className="my-6 border-gray-200" />
        <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase">Settings</h2>
        <ul className="space-y-2">
          {settingsItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.link}
                className={`flex items-center p-3 text-sm font-medium rounded-lg hover:bg-gray-100 ${
                  activeItem === item.name.toLowerCase()
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-900'
                }`}
              >
                <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                <span className="ml-3">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
