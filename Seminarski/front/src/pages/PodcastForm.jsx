import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import api from "../api";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

const PodcastForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [me, setMe] = useState(null);

  const [formData, setFormData] = useState({
    naslov: "",
    kratak_sadrzaj: "",
    kategorija_id: "",
    logo: null,
    kreatori: [],
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const storedUsername = localStorage.getItem("username");

        const [catRes, authRes] = await Promise.all([
          api.get("/kategorije"),
          api.get("/users/autori"),
        ]);

        const allFetchedAuthors = authRes.data.data;
        setCategories(catRes.data.data);

        const currentMe = allFetchedAuthors.find(
          (u) => u.korisnicko_ime === storedUsername
        );
        setMe(currentMe);

        const otherAuthors = allFetchedAuthors.filter(
          (u) => u.korisnicko_ime !== storedUsername
        );
        setAllAuthors(otherAuthors);

        if (id) {
          // EDIT MODE
          const podRes = await api.get(`/podcasti/${id}`);
          const p = podRes.data.data;

          setFormData({
            naslov: p.naslov || "",
            kratak_sadrzaj: p.kratak_sadrzaj || "",
            kategorija_id: p.kategorija ? String(p.kategorija.id) : "",
            logo: null,
            kreatori:
              Array.isArray(p.autori) && p.autori.length > 0
                ? p.autori
                : currentMe
                ? [currentMe]
                : [],
          });
        } else {
          setFormData({
            naslov: "",
            kratak_sadrzaj: "",
            kategorija_id: "",
            logo: null,
            kreatori: currentMe ? [currentMe] : [],
          });
        }
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("naslov", formData.naslov);
    data.append("kratak_sadrzaj", formData.kratak_sadrzaj);
    data.append("kategorija_id", formData.kategorija_id);

    if (formData.logo) {
      data.append("logo_putanja", formData.logo);
    }

    formData.kreatori.forEach((kreator, index) => {
      data.append(`kreatori[${index}][id]`, kreator.id);
    });

    if (isEditMode) {
      data.append("_method", "PUT");
    }

    try {
      const url = isEditMode ? `/podcasti/${id}` : `/podcasti`;
      await api.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/podcasts");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Greška pri čuvanju podkasta.";
      alert(typeof errorMsg === "string" ? errorMsg : "Proverite polja.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-20 text-center font-bold">Učitavanje...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter uppercase">
            {isEditMode ? "Izmeni podkast" : "Novi podkast"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Naslov Podkasta"
              required
              value={formData.naslov}
              onChange={(e) =>
                setFormData({ ...formData, naslov: e.target.value })
              }
            />

            <FormSelect
              label="Kategorija"
              required
              value={formData.kategorija_id}
              onChange={(e) =>
                setFormData({ ...formData, kategorija_id: e.target.value })
              }
              placeholder="Izaberi Kategoriju"
              options={categories.map((c) => ({ id: c.id, naziv: c.naziv }))}
            />

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase ml-1">
                Opis podkasta
              </label>
              <textarea
                rows="4"
                required
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-700"
                value={formData.kratak_sadrzaj}
                onChange={(e) =>
                  setFormData({ ...formData, kratak_sadrzaj: e.target.value })
                }
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-gray-700 uppercase ml-1">
                Kreatori
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.kreatori.map((kreator) => {
                  const isMe = kreator.id === me?.id;
                  return (
                    <div
                      key={kreator.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border ${
                        isMe
                          ? "bg-indigo-600 text-white border-indigo-700"
                          : "bg-indigo-50 text-indigo-700 border-indigo-100"
                      }`}
                    >
                      <span>
                        {kreator.korisnicko_ime} {isMe && "(Ti)"}
                      </span>
                      {!isMe && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              kreatori: formData.kreatori.filter(
                                (k) => k.id !== kreator.id
                              ),
                            })
                          }
                          className="hover:text-red-500"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <select
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none text-gray-900 cursor-pointer"
                value=""
                onChange={(e) => {
                  const user = allAuthors.find((u) => u.id == e.target.value);
                  if (user && !formData.kreatori.find((k) => k.id == user.id)) {
                    setFormData({
                      ...formData,
                      kreatori: [...formData.kreatori, user],
                    });
                  }
                }}
              >
                <option value="" hidden>
                  Dodaj kolegu autora...
                </option>
                {allAuthors.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.korisnicko_ime} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase ml-1">
                Logo / Slika
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files[0] })
                  }
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors file:hidden"
                />
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-indigo-600 font-bold">
                  {formData.logo
                    ? formData.logo.name
                    : "Klikni da izabereš sliku"}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-gray-400"
            >
              {submitting
                ? "Čuvanje..."
                : isEditMode
                ? "Sačuvaj izmene"
                : "Kreiraj podkast"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PodcastForm;
