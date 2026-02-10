import React from "react";
import Pagination from "../Pagination";

const ArtistDetails = ({
  artist,
  songs,
  currentPage,
  setCurrentPage,
  songsPerPage,
}) => {
  const items = songs?.items || [];
  const totalResults = songs?.total || 0;
  const totalPages = Math.ceil(totalResults / songsPerPage);

  const paginationMeta = {
    last_page: totalPages,
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300 border border-white/5 hover:border-indigo-500/30 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-gray-500 font-black text-sm w-5">
                  {(currentPage - 1) * songsPerPage + (index + 1)}
                </span>
                <div className="flex-1">
                  <h4 className="text-white font-bold truncate tracking-tight uppercase text-sm">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">
                    {artist.type === "artist"
                      ? "Audio Track"
                      : "Podcast Episode"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={`https://open.spotify.com/embed/${artist.type === "artist" ? "track" : "episode"}/${item.id}?utm_source=generator&theme=0`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="encrypted-media"
                  title={item.name}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-400 font-bold uppercase tracking-widest text-xs">
              Učitavanje...
            </span>
          </div>
        )}
      </div>

      <div className="py-10 border-t border-white/5 mt-8">
        <Pagination
          meta={paginationMeta}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ArtistDetails;
