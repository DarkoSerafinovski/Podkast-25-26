import React from "react";

const PodcastAbout = ({ naslov, opis, statLabel, statValue }) => {
  return (
    <div className="lg:col-span-1">
      <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">
        {naslov}
      </h2>
      <p className="text-gray-600 leading-relaxed text-lg">{opis}</p>

      <div className="mt-8 p-6 bg-gray-100 rounded-3xl border border-gray-100">
        <p className="text-sm text-gray-400 font-bold uppercase mb-1">
          {statLabel}
        </p>
        <p className="text-2xl mt-3 font-black text-indigo-600">{statValue}</p>
      </div>
    </div>
  );
};

export default PodcastAbout;
