import React from "react";

const AudioPlayer = ({ audioUrl, title }) => {
  return (
    <div className="w-full bg-indigo-50 p-6 rounded-3xl border border-indigo-100 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
          Audio Player
        </span>
        <span className="text-sm font-medium text-indigo-600">{title}</span>
      </div>

      <audio controls className="w-full h-12 accent-indigo-600">
        <source src={audioUrl} type="audio/mpeg" />
        Vaš pretraživač ne podržava audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
