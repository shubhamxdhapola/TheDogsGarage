import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageTrail = ({
  images = [],
  maxImages = 5,
  distance = 60,
  children,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [trail, setTrail] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const count = useRef(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current || images.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist > distance) {
      lastPos.current = { x, y };
      const imageIndex = count.current % images.length;
      count.current += 1;

      const newPoint = {
        id: Date.now() + Math.random(),
        x,
        y,
        image: images[imageIndex],
        rotation: (Math.random() - 0.5) * 20,
      };

      setTrail((prev) => [...prev.slice(-(maxImages - 1)), newPoint]);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      {children}

      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.5, rotate: item.rotation }}
              animate={{ opacity: 1, scale: 1, rotate: item.rotation }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute w-28 h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white p-1"
              style={{
                left: item.x - 56,
                top: item.y - 72,
              }}
            >
              <img
                src={item.image}
                alt="Trail"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageTrail;
