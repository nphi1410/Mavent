import React from "react";

const Description = ({ eventData }) => {
  return (
    <section className="w-full h-full flex flex-col px-4 sm:px-6 text-gray-800">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          Event Description
        </h1>
      </div>

      <div className="flex-grow">
        <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[700px] overflow-y-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-inner ring-1 ring-gray-200">
          <p className="text-base sm:text-lg leading-relaxed text-justify text-gray-700">
            {eventData.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Description;
