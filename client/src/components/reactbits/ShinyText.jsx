import React from 'react';

export const ShinyText = ({
  text = '',
  disabled = false,
  speed = 3,
  className = '',
  children,
}) => {
  return (
    <span
      className={`inline-block bg-clip-text ${disabled ? '' : 'animate-shimmer'} ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(110deg, currentColor 35%, rgba(232, 106, 44, 0.9) 50%, currentColor 65%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: disabled ? 'currentColor' : 'transparent',
        animationDuration: `${speed}s`,
      }}
    >
      {children || text}
    </span>
  );
};

export default ShinyText;
