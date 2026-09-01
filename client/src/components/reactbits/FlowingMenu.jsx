import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export const FlowingMenu = ({ items = [], className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav className={`flex items-center space-x-1 relative ${className}`}>
      {items.map((item, index) => (
        <NavLink
          key={item.name}
          to={item.path}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={({ isActive }) =>
            `relative px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-colors duration-200 z-10 ${
              isActive
                ? 'text-amber-700 font-bold'
                : 'text-stone-500 hover:text-stone-900 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {hoveredIndex === index && (
                <motion.span
                  layoutId="navHover"
                  className="absolute inset-0 bg-stone-100/80 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {item.name}
              {isActive && (
                <motion.span
                  layoutId="navActive"
                  className="absolute bottom-1 left-4 right-4 h-0.5 bg-tdg-orange rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default FlowingMenu;
