import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import PodcastCard from "../components/PodcastCard";
import FormInput from "../components/FormInput";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import api from "../api";
import { usePodcasts } from "../hooks/usePodcasts";

const AllPodcasts = () => {
  const user = {
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
  };

  const [authors, setAuthors] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    podkasti,
    loading,
    meta,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    toggleFavorite,
  } = usePodcasts(
    {
      view: "all",
      category: "all",
      minEpisodes: 0,
      searchQuery: "",
      idAutora: null,
    },
    user
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setFilters, setCurrentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await api.get("/kategorije");
        setAllCategories(catRes.data.data.map((c) => c.naziv));
      } catch (err) {
        console.error("Greška kod učitavanja kategorija:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        let url = "/users/autori";

        if (user.role === "gledalac" && filters.view === "personal") {
          url = "/users/autori/favorites";
        }

        const authRes = await api.get(url);
        setAuthors(authRes.data.data);
      } catch (err) {
        console.error("Greška kod učitavanja autora:", err);
      }
    };

    fetchAuthors();
  }, [filters.view, user.role, podkasti]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex flex-1 mt-5">
        <Sidebar
          userRole={user.role}
          filters={filters}
          setFilters={setFilters}
          categories={allCategories}
          authors={authors}
        />

        <main className="flex-1 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {filters.view === "all" ? "Svi Podkasti" : "Moja Kolekcija"}
              </h1>
              <p className="text-gray-500 text-sm">Zdravo, {user.username}</p>
            </div>
            <div className="w-full md:w-64">
              <FormInput
                type="text"
                placeholder="Pretraži..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 animate-pulse text-indigo-600 font-bold">
              Učitavanje...
            </div>
          ) : podkasti.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {podkasti.map((podcast) => (
                  <Link to={`/podcasts/${podcast.id}`} key={podcast.id}>
                    <PodcastCard
                      podcast={podcast}
                      onToggleFavorite={toggleFavorite}
                      user={user}
                    />
                  </Link>
                ))}
              </div>

              <Pagination
                meta={meta}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Nismo pronasli nijedan podkast
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto mb-8">
                Pokusajte da promenite filtere ili pretrazite nesto drugo.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    view: "all",
                    category: "all",
                    minEpisodes: 0,
                    searchQuery: "",
                    idAutora: null,
                  })
                }
                className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-colors"
              >
                Ponisti sve filtere
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllPodcasts;
