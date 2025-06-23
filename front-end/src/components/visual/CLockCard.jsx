import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const ClockCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) =>
    date.getHours() + ":" + date.getMinutes().toString().padStart(2, "0");

  const formatDate = (date) =>
    date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-md flex items-center justify-center gap-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center w-24 h-24 bg-blue-100 text-blue-600 rounded-full">
        <FontAwesomeIcon icon={faClock} className="text-[clamp(2rem,5vw,5rem)]" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-gray-500 text-[clamp(0.75rem,2vw,1.125rem)]">
          {formatDate(currentTime)}
        </p>
        <p className="font-bold text-gray-800 text-[clamp(2rem,5vw,5rem)] leading-none">
          {formatTime(currentTime)}
        </p>
      </div>
      </div>
    </div>
  );
};

export default ClockCard;
