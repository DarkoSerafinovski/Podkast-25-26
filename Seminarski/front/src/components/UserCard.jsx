import React from "react";

const UserCard = ({ user, onDelete }) => {
  const isAutor = user.uloga === "autor";

  return (
    <div className="bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
          {user.korisnicko_ime.charAt(0).toUpperCase()}
        </div>

        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            isAutor
              ? "bg-amber-50 text-amber-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {user.uloga}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-black text-gray-900 truncate">
          {user.korisnicko_ime}
        </h3>
        <p className="text-gray-400 text-sm font-medium truncate">
          {user.email}
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
        <div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            Podkasti
          </p>
          <p className="text-lg font-black text-gray-900">
            {user.broj_podkasta}
          </p>
        </div>

        <button
          onClick={() => onDelete(user.id)}
          className="px-4 py-2 bg-red-50 text-red-500 text-[11px] rounded-xl hover:bg-red-500 font-black uppercase hover:text-white transition-all transform group-hover:scale-105"
          title="Obriši korisnika"
        >
          Obriši
        </button>
      </div>
    </div>
  );
};

export default UserCard;
