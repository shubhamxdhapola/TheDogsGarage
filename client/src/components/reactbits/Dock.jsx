import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DockItem = ({ icon: Icon, label, onClick, mouseX, badge }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 58, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      className="aspect-square rounded-2xl bg-white/90 shadow-card border border-stone-200/80 flex flex-col items-center justify-center relative cursor-pointer group text-stone-700 hover:text-tdg-orange transition-colors"
    >
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-tdg-orange text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border border-white">
          {badge}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </motion.button>
  );
};

export const Dock = ({ items = [], className = '' }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-3 p-2.5 rounded-3xl bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-float ${className}`}
    >
      {items.map((item, index) => (
        <DockItem key={index} mouseX={mouseX} {...item} />
      ))}
    </div>
  );
};

export default Dock;
