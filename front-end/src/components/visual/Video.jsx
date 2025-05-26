import React from 'react';

const Video = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 border-b-4 border-red-500 pb-2">
        Remarkable
      </h1>
      <div className="w-full max-w-5xl aspect-video border-2 border-gray-200 p-4 rounded-2xl shadow-xl overflow-hidden">
        <iframe
          className="w-full h-full rounded-xl"
          src="https://www.youtube.com/embed/pZ0hy0Eu2MA?si=FCNSrpUgc2gRvtHH"
          title="Remarkable Event"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Video;
