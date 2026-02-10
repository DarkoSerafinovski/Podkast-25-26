import React from 'react';

const ArtistList = ({ artists, onSelect }) => (
  <div className="artist-list">
    {artists.map((artist) => (
      <div key={artist.id} className="artist-card" onClick={() => onSelect(artist)}>
        <img src={artist.images[0]?.url} alt={artist.name} className="artist-image" />
        <h3>{artist.name}</h3>
      </div>
    ))}
  </div>
);

export default ArtistList;
