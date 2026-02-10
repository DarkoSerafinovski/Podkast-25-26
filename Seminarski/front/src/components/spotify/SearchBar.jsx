import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('show'); 

  const handleSearch = () => {
    if (query) {
      onSearch(query, type);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        className="search-type-select"
        style={{
          padding: '15px',
          borderRadius: '30px 0 0 30px',
          border: '1px solid #ccc',
          borderRight: 'none',
          backgroundColor: '#fff',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        <option value="artist">Music</option>
        <option value="show">Podcasts</option>
      </select>

      <input
        type="text"
        placeholder={type === 'artist' ? "Search for an artist..." : "Search for a podcast..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{
          borderRadius: '0', 
          borderLeft: '1px solid #eee'
        }}
      />
      
      <button 
        onClick={handleSearch}
        style={{
          borderRadius: '0 30px 30px 0' 
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;