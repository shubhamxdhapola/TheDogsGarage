import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TextLoop = ({
  items = [],
  interval = 2500,
  direction = 'up',
  className = '',
  itemClassName = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, interval]);

  if (!items || items.length === 0) return null;

  const yOffset = direction === 'up' ? 20 : -20;

  return (
    <span className={`inline-block relative overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: yOffset, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -yOffset, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`inline-block whitespace-nowrap ${itemClassName}`}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default TextLoop;
