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
import Card from "./Card";
import SpotifyHero from "./SpotifyHero";

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

  const BackButton = ({ onClick, label }) => (
    <button
      className="group mb-8 flex items-center text-indigo-400 hover:text-white transition-all font-black uppercase text-xs tracking-widest"
      onClick={onClick}
    >
      <span className="mr-2 text-xl group-hover:-translate-x-1 transition-transform">
        ←
      </span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navigation />

      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* JOS NIJE PRETRAZENO */}

        {!selectedArtist && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-xl font-bold uppercase tracking-widest">
              Pretražite omiljenu muziku ili podkaste
            </p>
          </div>
        )}

        {/* TEK PRETRAZENO */}

        {!selectedArtist && items.length > 0 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-wider text-indigo-500">
              Rezultati pretrage
            </h2>
            <ArtistList artists={items} onSelect={handleSelectArtist} />
          </div>
        )}

        {/* IZABRAN MUZICAR */}

        {selectedArtist &&
          !selectedAlbum &&
          selectedArtist.type === "artist" && (
            <div className="animate-fadeIn">
              <BackButton
                onClick={() => setSelectedArtist(null)}
                label="Nazad na rezultate"
              />

              <h2 className="text-4xl font-bold mb-8 text-white">
                Albumi:{" "}
                <span className="text-indigo-500 font-bold">
                  {selectedArtist.name}
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {albums.map((album) => (
                  <Card
                    key={album.id}
                    title={album.name}
                    subtitle={new Date(album.release_date).getFullYear()}
                    image={album.images[0]?.url}
                    onClick={() => setSelectedAlbum(album)}
                  />
                ))}
              </div>
            </div>
          )}

        {/* SELEKTOVAN MUZICAR I NJEGOV ALBUM ILI SELEKTOVAN PODKAST KREATOR */}
        {selectedArtist &&
          (selectedAlbum || selectedArtist.type === "show") && (
            <div className="animate-fadeIn">
              <BackButton
                onClick={() =>
                  selectedArtist.type === "show"
                    ? setSelectedArtist(null)
                    : setSelectedAlbum(null)
                }
                label="Nazad"
              />
              <SpotifyHero
                image={
                  selectedArtist.type === "artist"
                    ? selectedAlbum?.images[0]?.url
                    : selectedArtist.images[0]?.url
                }
                type={selectedArtist.type}
                title={
                  selectedArtist.type === "artist"
                    ? selectedAlbum?.name
                    : selectedArtist.name
                }
                author={selectedArtist.name}
                totalTracks={selectedAlbum?.total_tracks}
              />
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
