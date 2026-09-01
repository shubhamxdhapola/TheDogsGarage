import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({
  children,
  animation = 'fade-up', // 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'blur-in'
  duration = 0.6,
  delay = 0,
  stagger = 0,
  blur = true,
  yOffset = 36,
  xOffset = 36,
  scale = 0.94,
  viewportAmount = 0.15,
  once = true,
  className = '',
}) => {
  const getVariants = () => {
    switch (animation) {
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -yOffset, filter: blur ? 'blur(8px)' : 'none' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: xOffset, filter: blur ? 'blur(8px)' : 'none' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: -xOffset, filter: blur ? 'blur(8px)' : 'none' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale, filter: blur ? 'blur(8px)' : 'none' },
          visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        };
      case 'blur-in':
        return {
          hidden: { opacity: 0, filter: 'blur(16px)' },
          visible: { opacity: 1, filter: 'blur(0px)' },
        };
      case 'fade-up':
      default:
        return {
          hidden: { opacity: 0, y: yOffset, filter: blur ? 'blur(8px)' : 'none' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth premium cubic bezier
        staggerChildren: stagger,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
