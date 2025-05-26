import React from "react";
import CardSmall from "./card/CardSmall";
import CardDetails from "./card/CardDetails";

const Content = ({imageUrl}) => {
  return (
    <div className="flex flex-col md:flex-row mx-4 gap-8 my-6">
      {/* Left Column */}
      <div className="md:w-1/3 flex flex-col items-start px-4">
        <h2 className="text-4xl font-extrabold mb-6 border-b-4 border-amber-400 pb-2">
          Upcoming Events
        </h2>
        <div className="flex flex-col gap-4 w-full">
          <CardSmall imageUrl={imageUrl}/>
          <CardSmall imageUrl={imageUrl}/>
          <CardSmall imageUrl={imageUrl}/>
          <CardSmall imageUrl={imageUrl}/>
          <CardSmall imageUrl={imageUrl}/>
          <CardSmall imageUrl={imageUrl}/>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:flex-1 flex flex-col items-start px-4">
        <h2 className="text-4xl font-extrabold mb-6 border-b-4 border-indigo-500 pb-2">
          For You
        </h2>
        <div className="flex flex-col gap-6 w-full">
          <CardDetails imageUrl={imageUrl}/>
          <CardDetails imageUrl={imageUrl}/>
          <CardDetails imageUrl={imageUrl}/>
          <CardDetails imageUrl={imageUrl}/>
          <CardDetails imageUrl={imageUrl}/>
        </div>
      </div>
    </div>
  );
};

export default Content;
