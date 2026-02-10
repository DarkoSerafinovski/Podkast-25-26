import axios from "axios";

// 1. Osnovna konfiguracija
const SPOTIFY_API_BASE = "https://api.spotify.com/v1"; // Standardni Spotify URL
const clientId =
  window._env_?.SPOTIFY_CLIENT_ID || process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret =
  window._env_?.SPOTIFY_CLIENT_SECRET ||
  process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

let accessToken = "";

const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_BASE,
});

const fetchAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        params: { grant_type: "client_credentials" },
      },
    );
    accessToken = response.data.access_token;
    sessionStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Spotify Auth Error:", error);
    throw error;
  }
};

spotifyApi.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      await fetchAccessToken();
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const searchArtists = async (query) => {
  const response = await spotifyApi.get("/search", {
    params: { q: query, type: "artist" },
  });
  return response.data.artists.items;
};

export const searchShows = async (query) => {
  const response = await spotifyApi.get("/search", {
    params: { q: query, type: "show" },
  });
  return response.data.shows.items;
};

export const getArtistAlbums = async (artistId) => {
  const response = await spotifyApi.get(`/artists/${artistId}/albums`, {
    params: { include_groups: "album,single", limit: 50 },
  });
  return response.data.items;
};

export const getAlbumTracks = async (albumId, limit = 10, page = 1) => {
  const response = await spotifyApi.get(`/albums/${albumId}/tracks`, {
    params: { limit, offset: (page - 1) * limit },
  });
  return response.data;
};

export const getShowEpisodes = async (showId, limit = 10, page = 1) => {
  const response = await spotifyApi.get(`/shows/${showId}/episodes`, {
    params: { limit, offset: (page - 1) * limit },
  });
  return response.data;
};
