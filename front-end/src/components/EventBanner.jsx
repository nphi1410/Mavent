import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getAccountById } from "../services/accountService";
import { useNavigate } from "react-router-dom";
import { registerEvent } from "../services/eventService";

const EventBanner = ({ eventData }) => {
  const [createAccount, setCreateAccount] = useState(null);
  const navigate = useNavigate();
  const PARTICIPANT_ROLE = "PARTICIPANT";
  const MEMBER_ROLE = "MEMBER";
  const RECRUITING_STATUS = "RECRUITING";

  useEffect(() => {
    const getAccount = async () => {
      if (!eventData?.createBy) return;

      try {
        const data = await getAccountById(eventData.createBy);
        setCreateAccount(data);
      } catch (err) {
        console.error("Failed to fetch creator info:", err);
      }
    };

    getAccount();
  }, [eventData?.createBy]);

  const handleRegister = async (role) => {
    //check user has logged in
    //if not logged in show message you have to login first, then redirect to login page
    if (!sessionStorage.getItem("isLoggedIn")) {
      alert("You have to login first");
      navigate("/login");
      return;
    }

    const registerDTO = {
      eventId: eventData.eventId,
      username: sessionStorage.getItem("username"),
      role: role,
      departmentId: null,
    };

    if (role === PARTICIPANT_ROLE) {
      const responseData = await registerEvent(registerDTO);
      if(responseData.status === 200) {
        alert("Register successfully!");
      }
      console.log("Response from register event:", responseData);
      
      return;
    }

    if (role === MEMBER_ROLE) {
      console.log("Registering for role:", role);
      console.log("Choose department");
    }
    console.log("Registering for role:", role);
  };

  return (
    <div className="relative w-full">
      <iframe
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
          {createAccount && (
            <span className="block text-base sm:text-lg font-semibold mb-2">
              By {createAccount.username}
            </span>
          )}
          <p className="text-sm sm:text-base leading-relaxed line-clamp-2">
            {eventData.description}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 max-w-sm w-full text-gray-800">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Date & Time</h3>
          <p className="text-sm mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} />
            {eventData.startDatetime.split("T")[0]}
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default EventBanner;
