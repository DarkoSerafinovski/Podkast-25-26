import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import ArtistList from "./ArtistList";
import ArtistDetails from "./ArtistDetails";
import {
  searchArtists,
  searchShows,
  getArtistAlbums,
  getAlbumTracks,
  getShowEpisodes,
} from "./SpotifyService";
import Navigation from "../Navigation";

const Spotify = () => {
  const [items, setItems] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [songs, setSongs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;

  const handleSearch = async (query, type = "artist") => {
    const data =
      type === "artist" ? await searchArtists(query) : await searchShows(query);
    setItems(data);
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSongs(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAlbum) return;
      try {
        let data =
          selectedArtist.type === "artist"
            ? await getAlbumTracks(selectedAlbum.id, songsPerPage, currentPage)
            : await getShowEpisodes(
                selectedAlbum.id,
                songsPerPage,
                currentPage,
              );
        setSongs(data);
      } catch (error) {
        console.error("Greška:", error);
      }
    };
    fetchData();
  }, [selectedAlbum, currentPage, selectedArtist]);

  const handleSelectArtist = async (item) => {
    setSelectedArtist(item);
    if (item.type === "artist") {
      const artistAlbums = await getArtistAlbums(item.id);
      setAlbums(artistAlbums);
      setSelectedAlbum(null);
    } else {
      setAlbums([]);
      setSelectedAlbum(item);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navigation />

      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {!selectedArtist ? (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-wider text-indigo-500">
              Rezultati pretrage
            </h2>
            <ArtistList artists={items} onSelect={handleSelectArtist} />
          </div>
        ) : !selectedAlbum && selectedArtist.type === "artist" ? (
          <div className="animate-fadeIn">
            <button
              className="group mb-8 flex items-center text-gray-400 hover:text-white transition-all font-black uppercase text-xs"
              onClick={() => setSelectedArtist(null)}
            >
              <span className="mr-2 text-xl group-hover:-translate-x-1 transition-transform">
                ←
              </span>{" "}
              Nazad na rezultate
            </button>

            <h2 className="text-4xl font-black mb-8">
              Albumi:{" "}
              <span className="text-indigo-500">{selectedArtist.name}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-[#181818] p-4 rounded-2xl hover:bg-[#282828] transition-all duration-300 group cursor-pointer shadow-xl border border-transparent hover:border-gray-700"
                  onClick={() => setSelectedAlbum(album)}
                >
                  <div className="relative mb-4">
                    <img
                      src={
                        album.images[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={album.name}
                      className="w-full aspect-square object-cover rounded-xl shadow-2xl"
                    />
                    <div className="absolute bottom-2 right-2 bg-indigo-600 p-3 rounded-full shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold truncate text-sm mb-1 uppercase tracking-tight">
                    {album.name}
                  </h3>
                  <p className="text-gray-500 text-xs font-black italic">
                    {new Date(album.release_date).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* DETALJI ALBUMA / PESME */
          <div className="animate-fadeIn">
            <button
              className="group mb-8 flex items-center text-gray-400 hover:text-white transition-all font-black uppercase text-xs"
              onClick={() =>
                selectedArtist.type === "show"
                  ? setSelectedArtist(null)
                  : setSelectedAlbum(null)
              }
            >
              <span className="mr-2 text-xl group-hover:-translate-x-1 transition-transform">
                ←
              </span>{" "}
              Nazad
            </button>

            <div className="flex flex-col md:flex-row gap-10 items-end mb-12 bg-gradient-to-t from-[#181818] to-transparent p-8 rounded-3xl border border-white/5">
              <img
                src={
                  selectedArtist.type === "artist"
                    ? selectedAlbum.images[0]?.url
                    : selectedArtist.images[0]?.url
                }
                alt=""
                className="w-52 h-52 md:w-72 md:h-72 shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover rounded-2xl"
              />
              <div className="flex-1">
                <p className="uppercase text-xs font-black tracking-[0.2em] mb-3 text-indigo-500">
                  {selectedArtist.type === "artist" ? "Album" : "Podcast"}
                </p>
                <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
                  {selectedArtist.type === "artist"
                    ? selectedAlbum.name
                    : selectedArtist.name}
                </h1>
                <div className="flex items-center gap-3 text-sm font-black uppercase">
                  <span className="text-white hover:text-indigo-400 cursor-pointer transition-colors">
                    {selectedArtist.name}
                  </span>
                  {selectedArtist.type === "artist" && (
                    <span className="text-gray-600">
                      • {selectedAlbum.total_tracks} pesama
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#181818]/50 rounded-3xl p-6 border border-white/5 backdrop-blur-xl">
              <ArtistDetails
                artist={selectedArtist}
                songs={songs}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                songsPerPage={songsPerPage}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Spotify;
