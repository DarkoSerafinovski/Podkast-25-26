import React from "react";

const Pagination = ({ meta, currentPage, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-12 gap-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all active:scale-95"
      >
        Prethodna
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">Stranica</span>
        <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-lg text-sm font-bold">
          {currentPage}
        </span>
        <span className="text-sm font-medium text-gray-400">
          od {meta.last_page}
        </span>
      </div>

      <button
        disabled={currentPage === meta.last_page}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all active:scale-95"
      >
        Sledeća
      </button>
    </div>
  );
};

export default Pagination;
