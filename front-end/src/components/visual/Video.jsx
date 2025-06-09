import React from "react";

const Video = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 border-b-4 border-red-500 pb-2">
        Remarkable
      </h1>
      <div className="w-full max-w-5xl aspect-video border-2 border-gray-200 p-4 rounded-2xl shadow-xl overflow-hidden">
        <iframe
          className="w-full h-full rounded-xl"
          title="Remarkable Event"
          src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Ffu.jsclub%2Fvideos%2F1329638691433044%2F&show_text=false&width=560&t=0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
};

export default Video;
