import { useState, useEffect } from "react";
import api from "../api";

export const usePodcasts = (initialFilters, user) => {
  const [podkasti, setPodkasti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  const getFetchUrl = () => {
    if (filters.view === "personal") {
      return user.role === "autor"
        ? "/users/podcasti"
        : "/users/favorites/podcasti";
    }
    return "/podcasti";
  };

  useEffect(() => {
    const fetchPodkasti = async () => {
      setLoading(true);
      try {
        const url = getFetchUrl();
        const res = await api.get(url, {
          params: {
            page: currentPage,
            per_page: 9,
            id_autora: filters.idAutora,
            search: filters.searchQuery,
            kategorija: filters.category === "all" ? null : filters.category,
            min_episodes: filters.minEpisodes,
          },
        });
        setPodkasti(res.data.data);
        setMeta(res.data.meta);
      } catch (err) {
        console.error("Greška pri učitavanju podkasta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodkasti();
  }, [
    filters.view,
    currentPage,
    filters.idAutora,
    filters.searchQuery,
    filters.category,
    filters.minEpisodes,
  ]);

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const toggleFavorite = async (podcastId) => {
    const podcast = podkasti.find((p) => p.id === podcastId);
    if (!podcast) return;

    const isFavorite = podcast.omiljeni;

    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${podcastId}`);
      } else {
        await api.post(`/users/favorites/${podcastId}`);
      }

      setPodkasti((prevPodkasti) => {
        if (
          filters.view === "personal" &&
          user.role === "gledalac" &&
          isFavorite
        ) {
          return prevPodkasti.filter((p) => p.id !== podcastId);
        }

        return prevPodkasti.map((p) =>
          p.id === podcastId ? { ...p, omiljeni: !isFavorite } : p
        );
      });
    } catch (err) {
      console.error("Greška pri izmeni omiljenih:", err);
      alert("Nije moguće izmeniti omiljene. Proverite da li ste ulogovani.");
    }
  };

  return {
    podkasti,
    loading,
    meta,
    currentPage,
    setCurrentPage,
    filters,
    setFilters: updateFilters,
    toggleFavorite,
  };
};
