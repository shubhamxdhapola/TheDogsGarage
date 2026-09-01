import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const TiltedCard = ({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  glareEnable = false,
}) => {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const tiltX = -(mouseY / (rect.height / 2)) * maxTilt;
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

    rotateX.set(tiltX);
    rotateY.set(tiltY);
  }, [maxTilt, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        rotateX: springX,
        rotateY: springY,
      }}
      whileHover={{ scale }}
      transition={{ duration: speed / 1000 }}
    >
      {children}
    </motion.div>
  );
};

export default TiltedCard;
