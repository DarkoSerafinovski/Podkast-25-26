import React, { useState } from "react";
import FormSelect from "../FormSelect";
import FormInput from "../FormInput";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("show");

  const searchOptions = [
    { value: "artist", label: "Muzika" },
    { value: "show", label: "Podkasti" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-end w-full max-w-4xl mx-auto gap-2">
      <div className="w-full md:w-48">
        <FormSelect
          options={searchOptions}
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Tip"
          required={true}
        />
      </div>

      <div className="flex-grow w-full">
        <FormInput
          type="text"
          name="search"
          placeholder={
            type === "artist"
              ? "Unesite ime izvođača..."
              : "Pronađite omiljeni podkast..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        onClick={() => onSearch(query, type)}
        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg uppercase text-sm"
      >
        Traži
      </button>
    </div>
  );
};

export default SearchBar;
