import React from "react";

const SpotifyHero = ({ image, type, title, author, totalTracks }) => {
  return (
    <div className="flex flex-col md:flex-row gap-10 items-end mb-12 bg-gradient-to-t from-[#181818] to-transparent p-10 rounded-[3rem] border border-white/5 shadow-2xl animate-fadeIn">
      <img
        src={image || "https://via.placeholder.com/300"}
        alt={title}
        className="w-56 h-56 md:w-80 md:h-80 shadow-[0_30px_60px_rgba(0,0,0,0.7)] object-cover rounded-3xl transition-transform duration-700 hover:scale-105"
      />

      <div className="flex-1">
        <p className="uppercase text-sm font-black tracking-[0.4em] mb-4 text-indigo-500">
          {type === "artist" ? "Album" : "Podcast"}
        </p>

        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
          {title}
        </h1>

        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-indigo-300">
          <span>{author}</span>
          {type === "artist" && totalTracks && (
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-gray-300 border border-white/5">
              • {totalTracks} pesama
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotifyHero;
