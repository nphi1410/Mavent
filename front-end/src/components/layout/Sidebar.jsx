import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Sidebar component for admin dashboard
const Sidebar = ({ activeItem, isOpen, onToggle }) => {
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
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white shadow-md h-screen fixed left-0 top-0 pt-16 z-30">
        <div className="px-4 py-6 h-full overflow-y-auto">
          <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h2>
          <ul className="space-y-1">
            {mainItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
                    activeItem === item.name.toLowerCase()
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-900'
                  }`}
                >
                  <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
          
          {settingsItems.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h2>
              <ul className="space-y-1">
                {settingsItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
                        activeItem === item.name.toLowerCase()
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-900'
                      }`}
                    >
                      <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                      <span className="ml-3">{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`
        lg:hidden fixed left-0 top-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onToggle}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="px-4 py-6 h-full overflow-y-auto">
          <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h3>
          <ul className="space-y-1">
            {mainItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  onClick={onToggle}
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
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
          
          {settingsItems.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
              <ul className="space-y-1">
                {settingsItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      onClick={onToggle}
                      className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
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
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
