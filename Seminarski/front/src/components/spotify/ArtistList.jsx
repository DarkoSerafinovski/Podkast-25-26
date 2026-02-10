import React from "react";

const ArtistList = ({ artists, onSelect }) => {
  if (!artists || artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-xl font-medium">
          Nema rezultata za prikaz. Pretražite nešto!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {artists.map((item) => {
        const isArtist = item.type === "artist";

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group bg-[#181818] p-4 rounded-2xl hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-lg border border-transparent hover:border-indigo-500/30"
          >
            <div className="relative mb-4 overflow-hidden shadow-2xl">
              <img
                src={
                  item.images[0]?.url ||
                  "https://via.placeholder.com/300?text=No+Image"
                }
                alt={item.name}
                className={`w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105 ${
                  isArtist ? "rounded-full" : "rounded-xl"
                }`}
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-indigo-600 p-3 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-black text-sm text-white truncate uppercase tracking-tight mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                {isArtist ? "Izvođač" : "Podkast"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ArtistList;
