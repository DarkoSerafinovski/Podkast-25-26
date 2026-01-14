import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import api from "../api";
import FormInput from "../components/FormInput";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/kategorije");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Greska pri ucitavanju kategorija:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post("/kategorije", { naziv: newCategoryName });

      setCategories([...categories, res.data.data]);
      setNewCategoryName("");
    } catch (err) {
      alert("Greska: Kategorija verovatno vec postoji.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Upravljanje kategorijama
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Dodaj nove ili obrisite postojece kategorije podkasta.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 mb-10">
          <form
            onSubmit={handleAddCategory}
            className="flex flex-col md:flex-row gap-4"
          >
            <FormInput
              placeholder="Naziv nove kategorije..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={submitting}
              className="flex-1"
            />
            <button
              type="submit"
              disabled={submitting || !newCategoryName.trim()}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-indigo-700 disabled:bg-gray-300 transition-all shadow-lg shadow-indigo-100"
            >
              {submitting ? "Slanje..." : "Dodaj kategoriju"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
          <div className="p-6 bg-gray-50/50 border-b border-gray-100">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
              Sve kategorije ({categories.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-indigo-600 font-bold animate-pulse">
              Učitavanje lista...
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></div>
                    <span className="text-lg font-bold text-gray-800">
                      {cat.naziv}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium">
              Trenutno nema definisanih kategorija.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryManagement;
