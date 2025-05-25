import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Tag = ({
  dotColor = "gray",
  bgColor = "bg-gray-100",
  textcolor = "text-gray-700",
  topic,
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${bgColor} ${textcolor} py-1.5 px-3 rounded-full text-sm font-semibold cursor-default select-none transition-colors duration-200 hover:brightness-95`}
    >
      <FontAwesomeIcon icon={faCircle} size="2xs" color={dotColor} />
      <span>{topic}</span>
    </div>
  );
};

export default Tag;
