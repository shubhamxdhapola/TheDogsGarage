import React from 'react';
import { X } from 'lucide-react';

export const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-xs transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Player */}
        <div className="aspect-video w-full">
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {video.caption && (
          <div className="p-4 bg-stone-900 text-stone-300 text-sm font-medium">
            {video.caption}
          </div>
        )}
      </div>
    </div>
  );
};
