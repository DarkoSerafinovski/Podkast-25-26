import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import api from "../api";
import FormInput from "../components/FormInput";

const AddEpisodeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    naslov: "",
    file: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Molimo izaberite fajl (audio ili video).");
      return;
    }

    setSubmitting(true);

    const data = new FormData();
    data.append("naslov", formData.naslov);
    data.append("podcast_id", id);
    data.append("file", formData.file);

    try {
      await api.post("/emisije", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Epizoda uspešno dodata!");
      navigate(`/podcasts/${id}`);
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.error || "Greška pri čuvanju epizode.";
      alert(
        typeof errorMsg === "string" ? errorMsg : "Validacija nije prošla."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-indigo-600 font-bold text-sm uppercase mb-2 block hover:underline"
            >
              ← Nazad na podkast
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Nova Epizoda
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <FormInput
              label="Naslov Epizode"
              required
              placeholder="npr. Epizoda 1"
              value={formData.naslov}
              onChange={(e) =>
                setFormData({ ...formData, naslov: e.target.value })
              }
            />

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase ml-1">
                Audio ili Video fajl
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*,video/*"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                  className="w-full px-6 py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors file:hidden"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-indigo-600 font-bold">
                    {formData.file ? "" : "Klikni da otpremiš fajl"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-1 italic">
                Podržani formati: MP3, WAV, MP4 (max 50MB)
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-gray-400"
            >
              {submitting ? "Slanje..." : "Objavi epizodu"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddEpisodeForm;
