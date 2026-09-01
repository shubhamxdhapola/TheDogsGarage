import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const VerticalMarquee = ({
  items = [],
  speed = 25,
  direction = 'up', // 'up' | 'down'
  pauseOnHover = true,
  className = '',
  renderItem,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const tripleItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative overflow-hidden h-[480px] ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className="flex flex-col gap-4"
        animate={isPaused ? {} : {
          y: direction === 'up' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {tripleItems.map((item, index) => (
          <div key={index} className="shrink-0">
            {renderItem ? renderItem(item, index) : item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default VerticalMarquee;
