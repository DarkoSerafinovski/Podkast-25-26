import React from "react";

const PodcastCard = ({ podcast, onToggleFavorite, user }) => {
  const {
    id,
    naslov,
    kratak_sadrzaj,
    logo_putanja,
    kategorija,
    emisije,
    autori,
    omiljeni,
  } = podcast;

  const autorIme =
    autori && autori.length > 0 ? autori[0].korisnicko_ime : "Nepoznat autor";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(id);
  };

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={logo_putanja}
          alt={naslov}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
            {kategorija?.naziv || "Opšte"}
          </span>
        </div>

        {user.role === "gledalac" && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-all"
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                omiljeni ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
              fill={omiljeni ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {naslov}
          </h3>
          <p className="text-sm font-medium text-gray-400 italic">
            by {autorIme}
          </p>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
          {kratak_sadrzaj}
        </p>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div className="flex items-center text-gray-500 text-[11px] font-black uppercase tracking-tighter">
            <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 text-indigo-600">
              {emisije?.length || 0}
            </span>
            {emisije?.length < 2 || emisije?.length > 5 ? "Epizoda" : "Epizode"}
          </div>

          <span className="text-indigo-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            Detaljnije →
          </span>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
