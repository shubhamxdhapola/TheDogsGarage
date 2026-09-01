import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl border border-stone-200 bg-white text-tdg-brown hover:bg-stone-50 hover:border-tdg-orange disabled:opacity-30 disabled:hover:border-stone-200 transition-all cursor-pointer shadow-2xs"
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
              isActive
                ? 'bg-tdg-brown text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-tdg-brown hover:text-tdg-brown'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl border border-stone-200 bg-white text-tdg-brown hover:bg-stone-50 hover:border-tdg-orange disabled:opacity-30 disabled:hover:border-stone-200 transition-all cursor-pointer shadow-2xs"
        title="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
