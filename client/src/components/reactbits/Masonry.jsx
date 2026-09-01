import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const Masonry = ({
  items = [],
  renderItem,
  columns = { default: 3, 1024: 3, 768: 2, 640: 1 },
  gap = 20,
  className = '',
}) => {
  const [colCount, setColCount] = useState(3);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColCount(columns[640] || 1);
      else if (width < 768) setColCount(columns[768] || 2);
      else if (width < 1024) setColCount(columns[1024] || 3);
      else setColCount(columns.default || 3);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  const columnWrappers = Array.from({ length: colCount }, () => []);

  items.forEach((item, index) => {
    columnWrappers[index % colCount].push({ item, index });
  });

  return (
    <div ref={containerRef} className={`flex ${className}`} style={{ gap: `${gap}px` }}>
      {columnWrappers.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
          {col.map(({ item, index }) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.08 }}
            >
              {renderItem ? renderItem(item, index) : item}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
