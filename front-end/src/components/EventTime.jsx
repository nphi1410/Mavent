import React from "react";
import { separateDayMonthYear } from "../utils/SeparateDayMonthYear";

const EventTime = ({eventData}) => {
  
  const [startDay,startMonth,startYear] = separateDayMonthYear(eventData.startDatetime);
  const [endDay,endMonth,endYear] = separateDayMonthYear(eventData.endDatetime);
  return (
    <section className="w-full max-w-2xl px-4 md:px-6 text-gray-900">
      <div className="mb-6 border-b border-gray-300 pb-3">
        <h2 className="text-4xl font-bold tracking-tight">🕒 Event Time</h2>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm border border-gray-200">
          <span className="font-medium text-lg">Start date</span>
          <span className="text-gray-700 text-base">{startDay} {startMonth} {startYear}</span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm border border-gray-200">
          <span className="font-medium text-lg">End date</span>
          <span className="text-gray-700 text-base">{endDay} {endMonth} {endYear}</span>
        </div>
      </div>
    </section>
  );
};

export default EventTime;
