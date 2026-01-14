import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import EpisodeItem from "../components/EpisodeItem";
import PodcastAbout from "../components/PodcastAbout";
import api from "../api";

const PodcastDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = {
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
  };

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const res = await api.get(`/podcasti/${id}`);
        setPodcast(res.data.data);
      } catch (err) {
        console.error("Greška pri učitavanju podkasta:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcast();
  }, [id]);

  const isOwner = podcast?.autori?.some(
    (a) => a.korisnicko_ime === user.username
  );
  const canDelete = user.role === "administrator" || isOwner;

  const handleDelete = async () => {
    if (
      window.confirm("Da li ste sigurni da želite da obrišete ovaj podkast?")
    ) {
      try {
        await api.delete(`/podcasti/${id}`);
        navigate("/podcasts");
      } catch (err) {
        alert("Došlo je do greške prilikom brisanja.");
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!podcast)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Podkast nije pronađen.
        </h2>
        <button
          onClick={() => navigate("/podcasts")}
          className="mt-4 text-indigo-600 font-bold"
        >
          ← Nazad na listu
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="relative h-[450px] w-full overflow-hidden bg-gray-900">
        <img
          src={podcast.logo_putanja}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-colors"
          >
            ← Nazad
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full mt-10">
            <img
              src={podcast.logo_putanja}
              alt={podcast.naslov}
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-3xl shadow-2xl border-4 border-white/10"
            />

            <div className="text-center md:text-left flex-1">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
                {podcast.kategorija?.naziv}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-2 tracking-tighter leading-tight">
                {podcast.naslov}
              </h1>
              <p className="text-xl text-gray-300 font-medium">
                Autori:{" "}
                <span className="text-white">
                  {podcast.autori?.map((a) => a.korisnicko_ime).join(", ")}
                </span>
              </p>
            </div>

            {canDelete && (
              <button
                onClick={handleDelete}
                className="mb-4 px-6 py-3 bg-red-600/20 hover:bg-red-600 border border-red-600/50 text-red-100 rounded-2xl backdrop-blur-md transition-all flex items-center gap-2 font-bold group"
              >
                <svg
                  className="w-5 h-5 text-red-400 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Obriši podkast
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <PodcastAbout
            naslov="O Podkastu"
            opis={podcast.kratak_sadrzaj}
            statLabel="Ukupno emisija"
            statValue={`${podcast.emisije?.length || 0} ${
              podcast.emisije?.length === 1 ? "Epizoda" : "Epizoda"
            }`}
          />

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Sve Epizode
              </h2>
              <div className="h-1 flex-1 bg-gray-100 ml-6 rounded-full hidden sm:block"></div>
            </div>

            <div className="space-y-4">
              {podcast.emisije?.length > 0 ? (
                podcast.emisije.map((epizoda, index) => (
                  <EpisodeItem
                    key={epizoda.id}
                    epizoda={epizoda}
                    index={index}
                    onClick={() =>
                      navigate(`/podcasts/${id}/episodes/${epizoda.id}`)
                    }
                  />
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">
                    Trenutno nema dostupnih epizoda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetails;
