import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getAccountById } from "../services/AccountService";
import { registerEvent } from "../services/EventService";
import { useNavigate } from "react-router-dom";
import DepartmentChooseForm from "./department/DepartmentChooseForm";

const EventBanner = ({ eventData }) => {
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const navigate = useNavigate();

  const PARTICIPANT_ROLE = "PARTICIPANT";
  const MEMBER_ROLE = "MEMBER";
  const RECRUITING_STATUS = "RECRUITING";

  const handleRegister = async (role) => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      alert("You have to login first");
      navigate("/login");
      return;
    }

    if (role === PARTICIPANT_ROLE) {
      const registerDTO = {
        eventId: eventData.eventId,
        accountId: sessionStorage.getItem("accountId"),
        role: PARTICIPANT_ROLE,
        departmentId: null,
      };
      const responseData = await registerEvent(registerDTO);
      if (responseData.status === 200) {
        alert("Register successfully!");
        window.location.reload();
      }
    }

    if (role === MEMBER_ROLE) {
      setShowDepartmentForm(true);
    }
  };

  const handleDepartmentSelect = async (department) => {
    const registerDTO = {
      eventId: eventData.eventId,
      accountId: sessionStorage.getItem("accountId"),
      role: "GUEST",
      departmentId: department.departmentId,
    };

    const responseData = await registerEvent(registerDTO);
    if (responseData.status === 200) {
      alert("Register successfully!");
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full">
      <img
        src={eventData.bannerUrl}
        title="codefest banner"
        className="w-full h-64 sm:h-128 md:h-[500px] lg:h-[650px] object-cover"
      />
      <div className="absolute inset-0 bg-black/50 bg-[linear-gradient(to_bottom,transparent_80%,white_100%)] flex flex-col md:flex-row items-center justify-between gap-8 px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-12">
        {/* Event Info */}
        <div className="text-white max-w-xl p-4 sm:p-6 rounded-lg text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            {eventData.name}
          </h1>
          <div className="flex items-center gap-3 my-1 md:mt-0 font-semibold">
            By
            {eventData.createdByAvatar && (
              <img
                src={eventData.createdByAvatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            )}
            <span>{eventData.createdByName ?? "Unknown"}</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed line-clamp-2">
            {eventData.description}
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-sm w-full text-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Date & Time</h3>
          <p className="text-sm mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} />
            {eventData.startDatetime.split("T")[0]}
          </p>
          {Date.now() > eventData.endDatetime ? (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => handleRegister(PARTICIPANT_ROLE)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
              >
                Participate Now
              </button>
              {eventData.status === RECRUITING_STATUS && (
                <button
                  onClick={() => handleRegister(MEMBER_ROLE)}
                  className="bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-semibold py-2 px-4 rounded text-sm sm:text-base"
                >
                  Become a Member
                </button>
              )}
            </div>
          ) : (
            <span>Event has ended</span>
          )}

          {/* Department Choose Form */}
          {showDepartmentForm && (
            <DepartmentChooseForm
              eventId={eventData.eventId}
              onDepartmentSelect={handleDepartmentSelect}
              onClose={() => setShowDepartmentForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
