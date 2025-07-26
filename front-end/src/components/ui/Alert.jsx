import React from "react";
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react"; // install with: npm install lucide-react

const Alert = ({ variant = "info", message = "" }) => {
  const getVariant = (variant) => {
    switch (variant) {
      case "success":
        return {
          color: "bg-green-100 text-green-800 border-green-400",
          icon: <CheckCircle className="w-5 h-5 mr-2 text-green-600" />,
        };
      case "warning":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-400",
          icon: <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />,
        };
      case "danger":
        return {
          color: "bg-red-100 text-red-800 border-red-400",
          icon: <XCircle className="w-5 h-5 mr-2 text-red-600" />,
        };
      default: // info
        return {
          color: "bg-blue-100 text-blue-800 border-blue-400",
          icon: <Info className="w-5 h-5 mr-2 text-blue-600" />,
        };
    }
  };

  const { color, icon } = getVariant(variant);

  return (
    <div className={`flex items-center border px-4 py-3 rounded relative ${color}`} role="alert">
      {icon}
      <span className="block sm:inline">{message}</span>
      <button className="absolute top-2 right-2 text-inherit hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;
