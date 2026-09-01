import React from 'react';
import { motion } from 'framer-motion';

export const LogoLoop = ({
  logos = [],
  speed = 30, // seconds for full loop
  direction = 'left',
  pauseOnHover = true,
  className = '',
}) => {
  const items = [...logos, ...logos, ...logos];

  return (
    <div
      className={`relative w-full overflow-hidden py-4 ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
      }}
    >
      <motion.div
        className="flex items-center gap-10 sm:gap-16 w-max cursor-pointer"
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
      >
        {items.map((logo, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/70 border border-stone-200/70 shadow-xs hover:border-amber-400 hover:shadow-subtle transition-all shrink-0 group"
          >
            {logo.icon && (
              <span className="text-xl group-hover:scale-110 transition-transform">
                {logo.icon}
              </span>
            )}
            {logo.image && (
              <img
                src={logo.image}
                alt={logo.name || 'Brand Logo'}
                className="h-7 w-auto object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
              />
            )}
            <span className="font-extrabold text-xs tracking-wider text-stone-600 group-hover:text-stone-900 transition-colors uppercase font-display">
              {logo.name || logo}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoLoop;
