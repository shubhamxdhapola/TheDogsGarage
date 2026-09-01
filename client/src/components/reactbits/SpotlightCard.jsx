import React, { useRef, useState, useCallback } from 'react';

export const SpotlightCard = ({
  children,
  className = '',
  contentClassName = '',
  spotlightColor = 'rgba(232, 106, 44, 0.08)',
  spotlightSize = 300,
}) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setOpacity(1), []);
  const handleMouseLeave = useCallback(() => setOpacity(0), []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Spotlight gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      {/* Card content */}
      <div className={`relative z-20 w-full h-full ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
