import axios from 'axios';


let accessToken = '';

const getAccessToken = async () => {
  const clientId = window._env_?.SPOTIFY_CLIENT_ID || process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = window._env_?.SPOTIFY_CLIENT_SECRET || process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  if (accessToken) return accessToken;
  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    params: {
      grant_type: 'client_credentials'
    }
  });
  accessToken = response.data.access_token;
  return accessToken;
};

export const searchArtists = async (query) => {
  const token = await getAccessToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: 'artist' }
  });
  sessionStorage.setItem("token",token);
  return response.data.artists.items;
};


export const searchShows = async (query) => {
  const token = await getAccessToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: 'show' }
  });
  sessionStorage.setItem("token",token);
  return response.data.shows.items;
};



export const getArtistAlbums = async (artistId) => {
  const token = await getAccessToken();
  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { include_groups: 'album,single', limit: 50 } 
  });
  return response.data.items;
};


export const getAlbumTracks = async (albumId, limit = 10, page = 1) => {
  const token = await getAccessToken();
  const offset = (page - 1) * limit;
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: limit, offset: offset }
  });
  return response.data; 
};



export const getShowEpisodes = async (showId, limit = 10, page = 1) => {
  const token = await getAccessToken();
  const offset = (page - 1) * limit;
  const response = await axios.get(`https://api.spotify.com/v1/shows/${showId}/episodes`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: limit, offset: offset }
  });
  return response.data; 
};