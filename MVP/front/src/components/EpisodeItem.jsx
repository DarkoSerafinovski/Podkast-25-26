import React from "react";

const EpisodeItem = ({ epizoda, index, onClick }) => {
  console.log(epizoda);
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-indigo-50 transition-all cursor-pointer border border-transparent hover:border-indigo-100"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-gray-500 font-bold">
        {index + 1}
      </div>

      <div className="flex-1">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
          {epizoda.naslov}
        </h4>
      </div>
    </div>
  );
};

export default EpisodeItem;
