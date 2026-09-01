import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const InfiniteScroll = ({
  items = [],
  speed = 25,
  direction = 'left',
  className = '',
  itemWidth = 260,
  itemHeight = 320,
}) => {
  const tripleItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden py-6 ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className="flex items-center gap-6 w-max cursor-grab active:cursor-grabbing"
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {tripleItems.map((item, idx) => (
          <div
            key={idx}
            style={{ width: itemWidth, height: itemHeight }}
            className="relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-card hover:shadow-float transition-all duration-500 shrink-0 group"
          >
            <img
              src={item.image || item}
              alt={item.title || `Gallery image ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
              {item.tag && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-black/40 px-2 py-0.5 rounded-full w-fit mb-1.5 backdrop-blur-xs">
                  {item.tag}
                </span>
              )}
              <h4 className="font-black text-sm tracking-tight leading-tight">{item.title || item.name}</h4>
              {item.description && (
                <p className="text-xs text-stone-300 font-medium line-clamp-2 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;
