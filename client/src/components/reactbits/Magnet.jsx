import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

export const Magnet = ({
  children,
  padding = 40,
  disabled = false,
  className = '',
  magnetStrength = 0.3,
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e) => {
    if (disabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    if (Math.abs(distanceX) < width / 2 + padding && Math.abs(distanceY) < height / 2 + padding) {
      springX.set(distanceX * magnetStrength);
      springY.set(distanceY * magnetStrength);
    } else {
      springX.set(0);
      springY.set(0);
    }
  }, [disabled, padding, magnetStrength, springX, springY]);

  const handleMouseLeave = useCallback(() => {
    springX.set(0);
    springY.set(0);
  }, [springX, springY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
