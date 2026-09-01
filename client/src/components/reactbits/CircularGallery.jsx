import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CircularGallery = ({
  items = [],
  radius = 220,
  itemWidth = 150,
  itemHeight = 200,
  autoRotateSpeed = 0.5,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const lastX = useRef(0);

  const totalItems = items.length || 1;
  const angleStep = 360 / totalItems;

  // Smooth continuous auto-rotation loop
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isDragging && !isHovered) {
        setRotationAngle((prev) => (prev + autoRotateSpeed * 25 * delta) % 360);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, isHovered, autoRotateSpeed]);

  // Pointer drag/touch support
  const handlePointerDown = (e) => {
    setIsDragging(true);
    lastX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const deltaX = clientX - lastX.current;
    lastX.current = clientX;
    setRotationAngle((prev) => (prev + deltaX * 0.4) % 360);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={`relative w-full h-[360px] sm:h-[400px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => {
          // Calculate item's position on the circle relative to current rotation
          const baseAngle = index * angleStep;
          const currentAngle = (baseAngle + rotationAngle) % 360;
          const rad = (currentAngle * Math.PI) / 180;

          // 3D coordinates
          const x = Math.sin(rad) * radius;
          const z = Math.cos(rad) * radius; // z is positive in front, negative in back

          // Front-facing calculations: 1 at front (z=radius), 0.5 at back (z=-radius)
          const normalizedZ = (z + radius) / (2 * radius);
          const scale = 0.7 + 0.35 * normalizedZ;
          const opacity = Math.max(0.25, Math.min(1, 0.3 + 0.7 * normalizedZ));
          const zIndex = Math.round(100 + z);

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: itemWidth,
                height: itemHeight,
                transform: `translate3d(${x}px, 0px, ${z}px) scale(${scale})`,
                zIndex,
                opacity,
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              }}
              className="rounded-3xl p-2 bg-white/95 backdrop-blur-md shadow-card border border-stone-200/90 transition-shadow duration-300 hover:shadow-float flex flex-col items-center justify-center shrink-0"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-stone-100 flex flex-col justify-end group">
                <img
                  src={item.image || '/images/dog-default.png'}
                  alt={item.title || item.name || `Dog ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/dog-default.png';
                  }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 pointer-events-none"
                  loading="lazy"
                />
                
                {/* Information Overlay at Bottom */}
                <div className="relative z-10 w-full bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white text-center">
                  <p className="text-xs font-black tracking-tight leading-tight truncate">
                    {item.title || item.name}
                  </p>
                  {item.subtitle && (
                    <p className="text-[10px] text-amber-300 font-bold mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircularGallery;
