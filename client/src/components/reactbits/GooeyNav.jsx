import React from 'react';
import { motion } from 'framer-motion';

export const GooeyNav = ({
  items = [],
  activeValue,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex p-1.5 rounded-full bg-stone-100/90 border border-stone-200/60 relative ${className}`}>
      {items.map((item) => {
        const isActive = (item.value ?? item.id ?? item) === activeValue;
        const val = item.value ?? item.id ?? item;
        const label = item.label ?? item.name ?? item;

        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`relative px-4 py-2 text-xs font-bold rounded-full transition-colors z-10 cursor-pointer ${
              isActive ? 'text-white font-black' : 'text-stone-600 hover:text-tdg-brown'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="gooeyNavActive"
                className="absolute inset-0 bg-tdg-orange rounded-full -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default GooeyNav;
