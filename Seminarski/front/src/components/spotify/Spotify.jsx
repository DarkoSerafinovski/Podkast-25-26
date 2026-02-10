import React, { useState, useEffect } from 'react';
import './Spotify.css';
import SearchBar from './SearchBar'; 
import ArtistList from './ArtistList';
import ArtistDetails from './ArtistDetails';
import { 
  searchArtists, 
  searchShows, 
  getArtistAlbums, 
  getAlbumTracks, 
  getShowEpisodes 
} from './SpotifyService';
import Navigation from '../Navigation';

const Spotify = () => {
  const [items, setItems] = useState([]); 
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [songs, setSongs] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('artist'); 
  const songsPerPage = 10;

  const handleSearch = async (query, type = 'artist') => {
    setSearchType(type);
    const data = type === 'artist' ? await searchArtists(query) : await searchShows(query);
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
        let data;
        if (selectedArtist.type === 'artist') {
          data = await getAlbumTracks(selectedAlbum.id, songsPerPage, currentPage);
        } else {
          data = await getShowEpisodes(selectedAlbum.id, songsPerPage, currentPage);
        }
        setSongs(data);
        console.log(data);
      } catch (error) {
        console.error("Greška pri učitavanju sadržaja:", error);
      }
    };
    fetchData();
  }, [selectedAlbum, currentPage, selectedArtist]);

  const handleSelectArtist = async (item) => {
    setSelectedArtist(item);
    setCurrentPage(1);
    setSongs(null);

    if (item.type === 'artist') {
      const artistAlbums = await getArtistAlbums(item.id);
      setAlbums(artistAlbums);
      setSelectedAlbum(null);
    } else {
      setAlbums([]); 
      setSelectedAlbum(item); 
    }
  };

  return (
    <>
      <Navigation/>
      <div className="app">
        <SearchBar onSearch={handleSearch} />

        {!selectedArtist ? (
          <ArtistList artists={items} onSelect={handleSelectArtist} />
        ) : (!selectedAlbum && selectedArtist.type === 'artist') ? (
          <div className="albums-container">
            <button className="back-btn" onClick={() => setSelectedArtist(null)}>← Nazad na rezultate</button>
            <h2 className="section-title">Albumi: {selectedArtist.name}</h2>
            <div className="albums-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', padding: '20px' }}>
              {albums.map(album => (
                <div key={album.id} className="album-card" onClick={() => setSelectedAlbum(album)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <img src={album.images[0]?.url} alt={album.name} style={{ width: '100%', borderRadius: '12px' }} />
                  <p><strong>{album.name}</strong></p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="tracks-container">
            <button className="back-btn" onClick={() => selectedArtist.type === 'show' ? setSelectedArtist(null) : setSelectedAlbum(null)}>
              ← Nazad {selectedArtist.type === 'show' ? 'na rezultate' : 'na albume'}
            </button>
            
            <div className="album-header" style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '30px 0' }}>
               <img src={selectedArtist.type === 'artist' ? selectedAlbum.images[1]?.url : selectedArtist.images[0]?.url} alt="" style={{ width: '150px', borderRadius: '8px' }} />
               <div>
                 <p style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>
                   {selectedArtist.type === 'artist' ? 'Album' : 'Podcast'}
                 </p>
                 <h1 style={{ fontSize: '32px', margin: '0' }}>{selectedArtist.type === 'artist' ? selectedAlbum.name : selectedArtist.name}</h1>
               </div>
            </div>

            <ArtistDetails 
              artist={selectedArtist} 
              songs={songs} 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage} 
              songsPerPage={songsPerPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Spotify;