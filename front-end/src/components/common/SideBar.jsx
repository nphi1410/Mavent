import { Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const SideBar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const navList = [
    { name: "Home", icon: "fa-solid fa-house", path: "/" },
    { name:"all events", icon: "fa-solid fa-calendar", path: "/events" },
    { name: "Profile", icon: "fa-solid fa-user", path: "/profile" },
    { name: "Dashboard", icon: "fa-solid fa-chart-line", path: "/profile/dashboard" },
    { name: "Attended Events", icon: "fa-solid fa-calendar-check", path: "/profile/attended" },
    { name: "tasks", icon: "fa-solid fa-list-check", path: "/profile/tasks" },
    { name: "Create New Event", icon: "fa-solid fa-list-check", path: "/create-event" }
  ];

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50">
        <TransitionChild
          as={Fragment}
          enter="transition-transform ease-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div
            ref={sidebarRef}
            className="absolute right-0 top-0 h-full w-80 bg-gray-200 shadow-xl flex flex-col pointer-events-auto"
          >
            <div className="flex items-center gap-2 p-4">
              <button onClick={() => setIsOpen(false)}>
                <FontAwesomeIcon icon="fa-solid fa-xmark" />
              </button>
              <span className="font-bold text-lg">User Center</span>
            </div>

            {navList.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-300 transition"
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.name}
              </div>
            ))}

            <div
              onClick={() => {
                navigate("/logout");
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
              Logout
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
};

export default SideBar;
