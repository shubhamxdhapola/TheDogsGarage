import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const GlareCard = ({
  children,
  className = '',
  innerClassName = '',
  maxTilt = 12,
  glareOpacity = 0.25,
  borderRadius = '24px',
}) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  const glareX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / rect.width;
    const clientY = (e.clientY - rect.top) / rect.height;
    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius,
        }}
        whileHover={{ scale: 1.025, y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative w-full h-full overflow-hidden transition-shadow duration-300 ${
          innerClassName || 'bg-white border border-stone-200/90 shadow-subtle hover:shadow-float'
        }`}
      >
        {children}

        {/* Dynamic Specular Glare / Sheen Overlay */}
        <motion.div
          style={{
            background: `radial-gradient(circle 220px at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, ${glareOpacity}), transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 mix-blend-overlay"
        />
      </motion.div>
    </motion.div>
  );
};

export default GlareCard;
