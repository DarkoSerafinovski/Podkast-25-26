import React from "react";

const Card = ({ title, subtitle, image, onClick, isCircle = false }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-[#181818] p-4 rounded-2xl hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-xl border border-transparent hover:border-indigo-500/30"
    >
      <div className="relative mb-4">
        <img
          src={image || "https://via.placeholder.com/300"}
          alt={title}
          className={`w-full aspect-square object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105 ${
            isCircle ? "rounded-full" : "rounded-xl"
          }`}
        />
        <div className="absolute bottom-2 right-2 bg-indigo-600 p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <h3 className="font-bold truncate text-sm mb-1 uppercase tracking-tight text-gray-100">
        {title}
      </h3>
      {subtitle && (
        <p className="text-indigo-400 text-xs font-black italic tracking-wider">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Card;
