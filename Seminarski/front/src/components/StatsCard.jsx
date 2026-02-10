import React from "react";

const StatsCard = ({ title, children }) => {
  console.log(children);
  return (
    <div className="bg-[#181818] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl animate-fadeIn">
      <h3 className="text-indigo-500 font-black uppercase tracking-widest text-sm mb-6 border-l-4 border-indigo-500 pl-4">
        {title}
      </h3>
      <div className="w-full flex justify-center items-center overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default StatsCard;
