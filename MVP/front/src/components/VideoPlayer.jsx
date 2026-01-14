import React from "react";

const VideoPlayer = ({ videoUrl, title }) => {
  return (
    <div className="relative w-full bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group">
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <h4 className="text-white font-bold text-lg truncate">{title}</h4>
      </div>

      <video
        controls
        className="w-full aspect-video object-contain"
        poster="/video-placeholder.jpg"
      >
        <source src={videoUrl} type="video/mp4" />
        Vaš pretraživač ne podržava video plejer.
      </video>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
    </div>
  );
};

export default VideoPlayer;
