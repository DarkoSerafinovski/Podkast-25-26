import React from "react";
import FormInput from "./FormInput";

const Sidebar = ({
  userRole,
  filters,
  setFilters,
  categories,
  authors = [],
  setSearchTerm,
}) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isAuthorViewingSelf =
    userRole === "autor" && filters.view === "personal";

  return (
    <aside className="w-full md:w-64 bg-white min-h-screen p-6 border-r border-gray-100 hidden md:block">
      <div className="space-y-8">
        {userRole !== "administrator" && (
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
              Prikaz
            </h3>

            <FormInput
              label={
                userRole === "autor" ? "Samo moji podkasti" : "Samo omiljeni"
              }
              type="toggle"
              checked={filters.view === "personal"}
              onChange={(e) => {
                const isChecked = e.target.checked;
                handleFilterChange(
                  "view",
                  e.target.checked ? "personal" : "all",
                );
                if (isChecked && userRole === "autor") {
                  handleFilterChange("idAutora", null);
                }
              }}
            />
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            isAuthorViewingSelf
              ? "opacity-40 pointer-events-none grayscale"
              : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Autori
            </h3>
            {isAuthorViewingSelf && (
              <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                Vaš profil
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <button
              onClick={() => handleFilterChange("idAutora", null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                !filters.idAutora
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Svi autori
            </button>
            {authors.map((author) => (
              <button
                key={author.id}
                onClick={() => handleFilterChange("idAutora", author.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  filters.idAutora === author.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{author.korisnicko_ime}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
                    {author.broj_podkasta}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
            Kategorije
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange("category", "all")}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                filters.category === "all"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Sve kategorije
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange("category", cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  filters.category === cat
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">
            Min. broj epizoda:
            <span className="text-indigo-600">{filters.minEpisodes}</span>
          </h3>
          <input
            type="range"
            min="0"
            max="10"
            value={filters.minEpisodes}
            onChange={(e) => handleFilterChange("minEpisodes", e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold">
            <span>0</span>
            <span>10+</span>
          </div>
        </div>

        <button
          onClick={() => {
            setFilters({
              view: "all",
              category: "all",
              minEpisodes: 0,
              searchQuery: "",
            });
            setSearchTerm("");
          }}
          className="w-full py-3 text-xs font-bold text-gray-400 hover:text-red-500 border border-dashed border-gray-200 rounded-xl transition-colors"
        >
          Poništi filtere
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
