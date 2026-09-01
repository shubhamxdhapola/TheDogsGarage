import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const Lightbox = ({ images = [], currentIndex = 0, onClose, onSelectIndex }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelectIndex((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onSelectIndex((currentIndex + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onSelectIndex]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex]?.url || images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top Controls */}
      <div className="flex items-center justify-between text-white/80 z-10">
        <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-400">
          Photo {currentIndex + 1} of {images.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Close Lightbox (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Viewport */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={() => onSelectIndex((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-transform hover:scale-110"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Display Image */}
        <img
          src={currentImage}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-200"
        />

        {/* Next Button */}
        <button
          onClick={() => onSelectIndex((currentIndex + 1) % images.length)}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-transform hover:scale-110"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex justify-center items-center gap-2 overflow-x-auto py-2 max-w-4xl mx-auto scrollbar-none">
        {images.map((img, idx) => {
          const thumbUrl = img.url || img;
          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === idx
                  ? 'border-tdg-orange scale-105 opacity-100 shadow-md'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={thumbUrl} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
