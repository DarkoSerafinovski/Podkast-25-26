import React from 'react';

const ArtistDetails = ({ artist, songs, currentPage, setCurrentPage, songsPerPage }) => {
  const items = songs?.items || [];
  const totalResults = songs?.total || 0;
  const totalPages = Math.ceil(totalResults / songsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="artist-details" style={{ width: '100%' }}>
      <div className="songs-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="song-card">
              <p><strong>{item.name}</strong></p>
              <iframe
                src={`https://open.spotify.com/embed/${artist.type === 'artist' ? 'track' : 'episode'}/${item.id}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                title={item.name}
                style={{ borderRadius: '8px' }}
              ></iframe>
            </div>
          ))
        ) : (
          <p>Učitavanje sadržaja...</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;